import { NextRequest, NextResponse } from 'next/server';
import redisSingleton from '@/lib/redisSingleton';
import {
	analyticsTypeEnum,
	type AnalyticsType,
	type BatchAnalyticsResponse,
} from '@/types/Analytics';

export async function GET(
	request: NextRequest,
): Promise<NextResponse<BatchAnalyticsResponse | { error: string }>> {
	const searchParams = request.nextUrl.searchParams;
	const type = searchParams.get('type') as AnalyticsType | null;
	const dates = searchParams.getAll('date'); // Support multiple date params

	if (
		!type ||
		!dates.length ||
		!Object.values(analyticsTypeEnum).includes(type)
	) {
		return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
	}

	try {
		const redisClient = redisSingleton.getClient();
		const pipeline = redisClient.multi();

		// Build all commands in a pipeline
		const keys = dates.map((date) => `analytics::${type}::${date}`);
		keys.forEach((key) => pipeline.hGetAll(key));

		// Execute all commands in a single round-trip
		const results = await pipeline.exec();

		// Format results with their corresponding dates
		const formattedResults = dates.map((date, i) => ({
			date,
			events: formatEvents(
				(results[i] as unknown as Record<string, string>) || {},
			),
		}));

		// Return the response matching the BatchAnalyticsResponse type
		return NextResponse.json(
			{ results: formattedResults },
			{
				status: 200,
			},
		);
	} catch (error) {
		console.error('Error fetching batch analytics:', error);
		return NextResponse.json(
			{ error: 'Error fetching analytics data' },
			{ status: 500 },
		);
	}
}

// Helper function to transform Redis hash responses into the expected format
function formatEvents(
	redisResult: Record<string, string>,
): Record<string, number>[] {
	if (!redisResult || Object.keys(redisResult).length === 0) return [];

	return Object.entries(redisResult).map(([key, value]) => {
		try {
			// Create an object with the parsed key and its count
			const count = parseInt(value, 10);
			return { [key]: count };
		} catch (e) {
			// Fallback in case parsing fails
			return { [key]: parseInt(value, 10) || 0 };
		}
	});
}
