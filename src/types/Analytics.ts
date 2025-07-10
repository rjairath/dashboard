export const analyticsTypeEnum = {
	pageView: 'pageView',
	clickEvent: 'clickEvent',
} as const;

export type AnalyticsType =
	(typeof analyticsTypeEnum)[keyof typeof analyticsTypeEnum];

export const clickEventsEnum = {
	theme_click: 'theme_click',
	workSection_click: 'workSection_click',
	analyticsSection_click: 'analyticsSection_click',
} as const;

export type ClickEventType =
	(typeof clickEventsEnum)[keyof typeof clickEventsEnum];

export type AnalyticsResponse = {
	date: string;
	events: Record<string, number>[];
}[];

export type BatchAnalyticsResponse = {
	results: AnalyticsResponse;
};

// Types for the analytics data state
export type AnalyticsData = {
	pageViews?: AnalyticsResponse;
	clickEvents?: AnalyticsResponse;
	stats: {
		avgVisitorsPerDay: string;
		totalVisitors: number;
	};
};

// Types for the click events state
export type ClickEventData = {
	selectedEvent: {
		name: string;
		key: string;
	};
	filteredEvents: AnalyticsResponse;
	stats: {
		totalClicks: number;
		clicksToday: number;
	};
};
