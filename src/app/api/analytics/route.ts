import { NextRequest, NextResponse } from 'next/server';
import redisSingleton from '@/lib/redisSingleton';
import { type AnalyticsType, analyticsTypeEnum } from '@/types/Analytics';

// Only storing and displaying data for the past 7 days
const REDIS_HASH_TTL = 7 * 24 * 60 * 60;
const ACTIVE_VISITORS_KEY = 'analytics::activeVisitors::current';
const getBaseAnalyticsKey = (type: string, date: string) =>
	`analytics::${type}::${date}`;
const getRetentionKey = (date: string) => `analytics::retention::${date}`;

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

	const BASE_ANALYTICS_KEY = getBaseAnalyticsKey(type, date);
	const RETENTION_KEY = getRetentionKey(date);

	try {
		const redisClient = redisSingleton.getClient();

		// Extract visitor information for active user tracking
		// We do this for all analytics types to maintain active visitor data
		const visitorId = body?.visitorId;
		const sessionId = body?.sessionId;

		// If we have visitor info, update the active visitors hash
		if (visitorId && sessionId) {
			const timestamp = Date.now().toString();
			const visitorTag = `${visitorId}:${sessionId}`;
			await redisClient.hSet(ACTIVE_VISITORS_KEY, visitorTag, timestamp);
		}

		// Process the specific analytics type
		if (type === analyticsTypeEnum.pageView) {
			const field = {
				page: body?.pageUrl,
			};
			await redisClient.hIncrBy(
				BASE_ANALYTICS_KEY,
				JSON.stringify(field),
				1,
			);

			// Track retention data on page views
			if (visitorId && body?.isNewVisitor !== undefined) {
				const field = body.isNewVisitor ? 'new' : 'returning';
				await redisClient.hIncrBy(RETENTION_KEY, field, 1);
			}
		} else if (type === analyticsTypeEnum.clickEvent) {
			const field = body?.clickEvent;
			await redisClient.hIncrBy(
				BASE_ANALYTICS_KEY,
				JSON.stringify(field),
				1,
			);
		}

		await redisClient.expire(BASE_ANALYTICS_KEY, REDIS_HASH_TTL);
		await redisClient.expire(RETENTION_KEY, REDIS_HASH_TTL);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error(error, 'Error storing analytics data');
		return NextResponse.json(
			{ error: 'Error storing analytics data' },
			{ status: 500 },
		);
	}
}
