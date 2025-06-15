import { getDate } from '@/utils';
import { parse } from 'date-fns';
import { getAnalytics } from '@/lib/api';
import type {
	AnalyticsType,
	AnalyticsResponse,
	BatchAnalyticsResponse,
} from '@/types/Analytics';

export const retrieveDaysBatch = async (
	originUrl: string,
	type: AnalyticsType,
	nDays: number,
): Promise<AnalyticsResponse> => {
	const dates = [];

	for (let i = 0; i < nDays; i++) {
		dates.push(getDate(i));
	}

	// Build URL with multiple date parameters
	const url = new URL(`${originUrl}/api/analytics/batch`);
	url.searchParams.append('type', type);
	dates.forEach((date) => url.searchParams.append('date', date));

	const response = await fetch(url.toString());

	if (!response.ok) {
		throw new Error('Failed to fetch batch analytics');
	}

	const data = (await response.json()) as BatchAnalyticsResponse;

	// Sort in increasing order
	data.results?.sort((a, b) => {
		if (
			parse(a.date, 'dd/MM/yyyy', new Date()) >
			parse(b.date, 'dd/MM/yyyy', new Date())
		) {
			return 1;
		} else {
			return -1;
		}
	});

	return data.results;
};

export const retrieveDays = async (
	originUrl: string,
	type: AnalyticsType,
	nDays: number,
) => {
	// Original implementation for backward compatibility
	const promises = [];

	for (let i = 0; i < nDays; i++) {
		// getDate just returns the date in dd/MM/yyyy format
		const formattedDate = getDate(i);
		const promise = getAnalytics(originUrl, formattedDate, type);
		promises.push(promise);
	}

	const fetchedRes = await Promise.all(promises);

	// Sort in increasing order
	fetchedRes.sort((a, b) => {
		if (
			parse(a.date, 'dd/MM/yyyy', new Date()) >
			parse(b.date, 'dd/MM/yyyy', new Date())
		) {
			return 1;
		} else {
			return -1;
		}
	});

	return fetchedRes;
};
