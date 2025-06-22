import { BlogDetailAPIResponse } from '@/types/BlogDetails';
import { HighlightApiResponse } from '@/types/Highlight';
import { WorkDetailsAPIResponse } from '@/types/WorkDetails';
import { analyticsTypeEnum } from '@/types/Analytics';

const baseUrl = process.env.NEXT_PUBLIC_SERVER_IP;
export const getHighlights = async () => {
	const response = await fetch(
		`${baseUrl}/api/highlights/?sort=createdAt:desc`,
		{ next: { revalidate: 30 } },
	);

	if (!response.ok) {
		throw new Error('Error in Highlight API');
	}

	const result: HighlightApiResponse = await response.json();
	return result;
};

export const getWorkDetails = async () => {
	const response = await fetch(
		`${baseUrl}/api/work-sections/?populate[skills][fields][0]=name&sort=startingDate:desc`,
		{ next: { revalidate: 30 } },
	);

	if (!response.ok) {
		throw new Error('Error in Work Details API');
	}

	const result: WorkDetailsAPIResponse = await response.json();
	return result;
};

export const getBlogs = async () => {
	const response = await fetch(
		`${baseUrl}/api/blogs/?sort=datePublished:desc`,
		{ next: { revalidate: 30 } },
	);

	if (!response.ok) {
		throw new Error('Error in Blog Details API');
	}

	const result: BlogDetailAPIResponse = await response.json();
	return result;
};

// Make this generic, to be used from header for recording page views
// and from section clicks to record click counts
// send the stringified body, date in the form: 30/09/2024
export const postAnalytics = async (
	originUrl: string,
	date: string,
	type: string,
	body: string,
) => {
	console.log('postAnalytics called with:', { originUrl, date, type, body });
	try {
		const response = await fetch(
			`${originUrl}/api/analytics/?date=${date}&type=${type}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body,
			},
		);
		if (!response.ok) {
			console.error('Error calling analytics API:', response.statusText);
			throw new Error(`Failed to post analytics: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error('Error calling analytics API:', error);
		const errorMessage =
			error instanceof Error ? error.message : 'Unknown error occurred';
		return { success: false, error: errorMessage };
	}
};

export const getAnalytics = async (
	originUrl: string,
	date: string,
	type: string,
) => {
	try {
		const response = await fetch(
			`${originUrl}/api/analytics/?date=${date}&type=${type}`,
		);
		if (!response.ok) {
			const errorResponse = await response.json();
			throw new Error(errorResponse.message || 'Error');
		}
		const result = await response.json();
		const resultObj = result?.value;
		return {
			date,
			events: Object.entries(resultObj).map(([key, value]) => ({
				[key]: Number(value),
			})),
		};
	} catch (error) {
		console.log(error);
		throw error;
	}
};
