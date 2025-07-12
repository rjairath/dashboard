import { NextRequest, NextResponse } from 'next/server';
import redisSingleton from '@/lib/redisSingleton';

// Define how recently a user must have been active (in milliseconds)
// 5 minutes = 300000 milliseconds
const ACTIVE_THRESHOLD = 15 * 60 * 1000;
const ACTIVE_VISITORS_KEY = 'analytics::activeVisitors::current';

export async function GET(request: NextRequest) {
	try {
		const redisClient = redisSingleton.getClient();

		// Get all entries from the active visitors hash
		const activeVisitors = await redisClient.hGetAll(ACTIVE_VISITORS_KEY);

		// Current timestamp
		const now = Date.now();

		// Filter to only include recently active visitors
		let activeCount = 0;

		Object.values(activeVisitors).forEach((timestamp) => {
			const visitorTimestamp = parseInt(timestamp, 10);
			if (now - visitorTimestamp <= ACTIVE_THRESHOLD) {
				activeCount++;
			}
		});

		return NextResponse.json({ activeUsers: activeCount });
	} catch (error) {
		console.error('Error fetching active visitors:', error);
		return NextResponse.json(
			{ error: 'Error fetching active visitors' },
			{ status: 500 },
		);
	}
}
