import { NextRequest, NextResponse } from 'next/server';
import redisSingleton from '@/lib/redisSingleton';
import { type AnalyticsType, analyticsTypeEnum } from '@/types/Analytics';

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const type = searchParams.get('type') as AnalyticsType | null;
	const date = searchParams.get('date');

	if (!type || !date || !Object.values(analyticsTypeEnum).includes(type)) {
		return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
	}

	let key = `analytics::${type}::${date}`;

	try {
		const redisClient = redisSingleton.getClient();
		const val = await redisClient.hGetAll(key);
		return NextResponse.json({ value: val });
	} catch (error) {
		console.error(error, 'Error fetching analytics data');
		return NextResponse.json(
			{ error: 'Error fetching analytics data' },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const type = searchParams.get('type') as AnalyticsType | null;
	const date = searchParams.get('date');

	const body = await request.json();

	if (!type || !date || !Object.values(analyticsTypeEnum).includes(type)) {
		return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
	}

	// date to be in the form of 28/09/2024
	let key = `analytics::${type}::${date}`;
	let field: string | { page: string };

	if (type === analyticsTypeEnum.pageView) {
		field = {
			page: body?.pageUrl,
		};
	} else if (type === analyticsTypeEnum.clickEvent) {
		field = body?.clickEvent;
	} else {
		return NextResponse.json(
			{ error: 'Incompatible analytics type' },
			{ status: 400 },
		);
	}

	try {
		const redisClient = redisSingleton.getClient();
		const val = await redisClient.hIncrBy(key, JSON.stringify(field), 1);

		const FIFTEEN_DAYS_IN_SECONDS = 15 * 24 * 60 * 60;
		await redisClient.expire(key, FIFTEEN_DAYS_IN_SECONDS);

		return NextResponse.json({ value: val });
	} catch (error) {
		console.error(error, 'Error storing analytics data');
		return NextResponse.json(
			{ error: 'Error storing analytics data' },
			{ status: 500 },
		);
	}
}
