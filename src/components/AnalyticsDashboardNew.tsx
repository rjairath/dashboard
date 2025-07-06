'use client';

import { BarChart, Card } from '@tremor/react';
import { useState, useEffect } from 'react';
import { clickEventList } from '@/constants';
import { getDate, findEventByKey, getValueFromKey } from '@/utils';
import { retrieveDaysBatch } from '@/utils/analytics';
import { analyticsTypeEnum, type AnalyticsResponse } from '@/types/Analytics';
import PageViewsChart from './PageViewsChart';

// Types for the analytics data state
type AnalyticsData = {
	pageViews?: AnalyticsResponse;
	clickEvents?: AnalyticsResponse;
	stats: {
		avgVisitorsPerDay: string;
		totalVisitors: number;
	};
};

// Types for the click events state
type ClickEventData = {
	selectedEvent: {
		name?: string;
		key?: string;
	};
	filteredEvents: AnalyticsResponse;
	stats: {
		totalClicks: number;
		clicksToday: number;
	};
};

export default function AnalyticsDashboardNew({
	trackingDays,
}: {
	trackingDays: number;
}) {
	// Consolidated analytics data state
	const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
		stats: {
			avgVisitorsPerDay: '0.0',
			totalVisitors: 0,
		},
	});

	// Consolidated click event state
	const [clickEventData, setClickEventData] = useState<ClickEventData>({
		selectedEvent: {},
		filteredEvents: [],
		stats: {
			totalClicks: 0,
			clicksToday: 0,
		},
	});

	// UI state
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const fetchData = async () => {
		const origin = window.location.origin;

		// Fetch page views and click events in parallel
		const [pageViews, clickEvents] = await Promise.all([
			retrieveDaysBatch(origin, analyticsTypeEnum.pageView, trackingDays),
			retrieveDaysBatch(
				origin,
				analyticsTypeEnum.clickEvent,
				trackingDays,
			),
		]);

		console.log('Page Views:', pageViews);
		console.log('Click Events:', clickEvents);

		// Calculate statistics
		const todayFormatted = getDate(0);

		// Calculate visitors today
		const visitorsToday = pageViews
			?.filter((item) => item.date === todayFormatted)
			?.reduce(
				(acc, curr) =>
					acc +
					curr.events.reduce(
						(sum, event) => sum + Object.values(event)[0]!,
						0,
					),
				0,
			);

		// Calculate total page views and average
		let totalPageViews = 0;
		pageViews?.forEach((item) => {
			item.events?.forEach((eventEntry) => {
				totalPageViews += Object.values(eventEntry)[0]!;
			});
		});

		const averagePageViews = (totalPageViews / trackingDays).toFixed(1);

		// Update analytics data state
		setAnalyticsData({
			pageViews,
			clickEvents,
			stats: {
				avgVisitorsPerDay: averagePageViews,
				totalVisitors: visitorsToday,
			},
		});

		// Initialize with first click event
		handleEventSelection(clickEventList[0]);
	};

	// Handle click event selection
	const handleEventSelection = (selectedEvent: {
		key: string;
		name: string;
	}) => {
		if (!analyticsData.clickEvents) return;

		setDropdownOpen(false);

		// Filter for the selected event
		const filteredEvents = analyticsData.clickEvents.map((item) => ({
			date: item.date,
			events: item.events.filter((eventObj) =>
				Object.keys(eventObj).some(
					(jsonKey) => JSON.parse(jsonKey) === `${selectedEvent.key}`,
				),
			),
		}));

		// Calculate total clicks
		const totalClicks = analyticsData.clickEvents.reduce((acc, curr) => {
			const eventObj = findEventByKey(curr.events, selectedEvent.key);
			return (
				acc +
				(eventObj ? getValueFromKey(eventObj, selectedEvent.key) : 0)
			);
		}, 0);

		// Calculate today's clicks
		const todayFormatted = getDate(0);
		const todayData = analyticsData.clickEvents.find(
			(item) => item.date === todayFormatted,
		);
		const clicksToday = todayData
			? getValueFromKey(
					findEventByKey(todayData.events, selectedEvent.key),
					selectedEvent.key,
			  )
			: 0;

		// Update click event state
		setClickEventData({
			selectedEvent,
			filteredEvents,
			stats: {
				totalClicks,
				clicksToday,
			},
		});
	};

	// Fetch data on component mount
	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div className="flex flex-col gap-6">
			<div className="grid-mobile sm:grid-desktop w-full mx-auto grid-cols-1 sm:grid-cols-2 gap-6">
				<Card
					className="w-full mx-auto"
					style={{ gridArea: 'avgVisitor' }}
				>
					<p className="text-tremor-default text-dark-tremor-content">
						Avg. Visitors/day
					</p>
					<p className="text-3xl text-dark-tremor-content font-semibold">
						{analyticsData.stats.avgVisitorsPerDay}
					</p>
				</Card>

				<div
					className="w-full flex flex-col justify-between relative select-none"
					style={{ gridArea: 'selectClick' }}
				>
					<p className="text-xl font-bold mb-2">Select Click Event</p>
					<Card
						className="p-4 cursor-pointer"
						onClick={() => setDropdownOpen(!dropdownOpen)}
					>
						<p className="text-xl font-semibold text-dark-tremor-content">
							{clickEventData.selectedEvent?.name}
						</p>
					</Card>

					{dropdownOpen && (
						<div
							className={`absolute top-[100%] flex flex-col w-[90%] p-2 rounded-lg shadow-xl z-[900] 
                                bg-white dark:bg-gray-800 divide-y dark:divide-gray-700 right-0
                            `}
						>
							{clickEventList.map((el) => (
								<button
									key={el?.key}
									className="relative font-bold px-1 py-4 sm:px-4 sm:py-2 text-sm 
                                        text-gray-700 dark:text-dark-tremor-content transition-all delay-100 hover:text-gray-900 dark:hover:text-gray-200 text-left"
								>
									<span
										className="relative z-10"
										onClick={() => handleEventSelection(el)}
									>
										{el.name}
									</span>
								</button>
							))}
						</div>
					)}
				</div>

				<Card
					className="w-full mx-auto"
					style={{ gridArea: 'totalVisitor' }}
				>
					<p className="text-tremor-default text-dark-tremor-content">
						Total Visitors Today
					</p>
					<p className="text-3xl text-dark-tremor-content font-semibold">
						{analyticsData.stats.totalVisitors}
					</p>
				</Card>

				<div
					className="w-full flex justify-between gap-4"
					style={{ gridArea: 'clickMeta' }}
				>
					<Card className="w-1/2 mx-auto">
						<p className="text-tremor-default text-dark-tremor-content">
							Avg. clicks/day
						</p>
						<p className="text-3xl text-dark-tremor-content font-semibold">
							{(
								clickEventData.stats.totalClicks / trackingDays
							).toFixed(1)}
						</p>
					</Card>

					<Card className="w-1/2 mx-auto">
						<p className="text-tremor-default text-dark-tremor-content">
							Total Clicks Today
						</p>
						<p className="text-3xl text-dark-tremor-content font-semibold">
							{clickEventData.stats.clicksToday}
						</p>
					</Card>
				</div>

				<Card style={{ gridArea: 'chartVisitor' }}>
					<h3 className="text-lg font-mediummb-4">
						Visitors by Date
					</h3>
					{analyticsData.pageViews ? (
						<BarChart
							showAnimation
							categories={['visitors']}
							data={analyticsData.pageViews.map((item) => ({
								name: item.date,
								visitors: item.events.reduce(
									(acc, curr) =>
										acc + Object.values(curr)[0]!,
									0,
								),
							}))}
							index="name"
							colors={['blue']}
							allowDecimals={false}
						/>
					) : null}
				</Card>

				<Card style={{ gridArea: 'chartClick' }}>
					{clickEventData.filteredEvents.length > 0 ? (
						<BarChart
							showAnimation
							categories={['clicks']}
							data={clickEventData.filteredEvents.map((item) => ({
								name: item.date,
								clicks: item.events.reduce(
									(acc, curr) =>
										acc + Object.values(curr)[0]!,
									0,
								),
							}))}
							index="name"
							colors={['teal']}
							allowDecimals={false}
						/>
					) : null}
				</Card>
			</div>

			{/* Page Views Chart */}
			{analyticsData.pageViews && (
				<PageViewsChart data={analyticsData.pageViews} />
			)}
		</div>
	);
}
