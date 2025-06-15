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
