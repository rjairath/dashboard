'use client';

import { Card, Select, SelectItem, Divider } from '@tremor/react';
import { useState, useEffect } from 'react';
import { clickEventList } from '@/constants';
import { getDate, findEventByKey, getValueFromKey } from '@/utils';
import { retrieveDaysBatch } from '@/utils/analytics';
import { getActiveVisitors } from '@/lib/api';
import {
	analyticsTypeEnum,
	type AnalyticsData,
	type ClickEventData,
} from '@/types/Analytics';
import PageViewsChart from './AnalyticsCharts/PageViewsChart';
import EventsBarChart from './AnalyticsCharts/EventsBarChart';
import UserRetentionChart from './AnalyticsCharts/UserRetentionChart';
import { CurrentlyActiveUsersCard } from './AnalyticsCharts/CurrentlyActiveUsersCard';
import Shimmer from './Shimmer';
import { RefreshIcon } from './Icons/RefreshIcon';
import { InfoIcon } from './Icons/InfoIcon';

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
		selectedEvent: clickEventList[0], // Initialize with the first click event
		filteredEvents: [],
		stats: {
			totalClicks: 0,
			clicksToday: 0,
		},
	});

	const [activeUsers, setActiveUsers] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const fetchData = async () => {
		const origin = window.location.origin;

		setLoading(true); // Set loading to true when starting data fetch
		setError(null); // Reset error state

		try {
			// Fetch page views, click events, and retention data in parallel
			const [pageViews, clickEvents, retentionEvents, currentActive] =
				await Promise.all([
					retrieveDaysBatch(
						origin,
						analyticsTypeEnum.pageView,
						trackingDays,
					),
					retrieveDaysBatch(
						origin,
						analyticsTypeEnum.clickEvent,
						trackingDays,
					),
					retrieveDaysBatch(
						origin,
						analyticsTypeEnum.retention,
						trackingDays,
					),
					getActiveVisitors(origin),
				]);

			// Update active users count
			setActiveUsers(currentActive);

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
				retentionEvents,
				stats: {
					avgVisitorsPerDay: averagePageViews,
					totalVisitors: visitorsToday,
				},
			});
		} catch (err) {
			console.error('Error fetching analytics data:', err);
			setError('Failed to load analytics data. Please try again later.');
		} finally {
			setLoading(false); // Set loading to false after data is fetched
		}
	};

	// Polling for active users
	useEffect(() => {
		fetchData();

		// Set up polling every 30 seconds for active users only
		const pollingInterval = setInterval(async () => {
			try {
				const activeCount = await getActiveVisitors(
					window.location.origin,
				);
				setActiveUsers(activeCount);
			} catch (error) {
				console.error('Error polling for active users:', error);
			}
		}, 30000);

		return () => clearInterval(pollingInterval);
	}, []);

	// Handle click event selection
	const handleEventSelection = (selectedEvent: {
		key: string;
		name: string;
	}) => {
		if (!analyticsData.clickEvents) {
			// If no click events data yet, just update the selected event
			setClickEventData((prevState) => ({
				...prevState,
				selectedEvent,
			}));
			return;
		}

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

	// Process click event data when analytics data changes
	useEffect(() => {
		if (analyticsData.clickEvents && clickEventData.selectedEvent) {
			handleEventSelection(clickEventData.selectedEvent);
		}
	}, [analyticsData.clickEvents]);

	return (
		<div className="flex flex-col gap-6">
			{/* Error message display - moved to top for better visibility */}
			{error && (
				<Card className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
					<div className="flex items-center gap-2 text-red-600 dark:text-red-400">
						<InfoIcon width={16} height={16} />
						<p className=" font-medium">{error}</p>
					</div>
				</Card>
			)}

			{/* Header with reload button */}
			<div className="flex justify-between items-center mb-2">
				<div className="text-sm text-zinc-600 dark:text-zinc-400">
					Showing data for the last {trackingDays} days
				</div>
				<button
					onClick={fetchData}
					disabled={loading}
					className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					aria-label="Refresh dashboard data"
				>
					<RefreshIcon width={16} height={16} />
					{loading ? 'Refreshing...' : 'Refresh Data'}
				</button>
			</div>

			<div className="grid-mobile sm:grid-desktop w-full mx-auto grid-cols-1 sm:grid-cols-2 gap-6">
				{/* Active Users Card */}
				<div style={{ gridArea: 'activeUsers' }}>
					{loading ? (
						<Card className="h-full">
							<Shimmer height="80px" className="p-0 border-0" />
						</Card>
					) : (
						<CurrentlyActiveUsersCard activeUsers={activeUsers} />
					)}
				</div>

				<div style={{ gridArea: 'chartVisitor' }}>
					{loading ? (
						<Card className="h-[230px]">
							<Shimmer height="180px" className="p-0 border-0" />
						</Card>
					) : (
						analyticsData.pageViews && (
							<EventsBarChart
								title="Visitors by Date"
								data={analyticsData.pageViews}
								categoryName="visitors"
								color="blue"
							/>
						)
					)}
				</div>

				<div
					className="w-full flex justify-between gap-4"
					style={{ gridArea: 'visitorMeta' }}
				>
					<Card className="w-1/2 mx-auto">
						{loading ? (
							<Shimmer height="80px" className="p-0 border-0" />
						) : (
							<>
								<p className="text-tremor-default text-dark-tremor-content">
									Avg. Visitors/day
								</p>
								<p className="text-3xl text-dark-tremor-content font-semibold">
									{analyticsData.stats.avgVisitorsPerDay}
								</p>
							</>
						)}
					</Card>

					<Card className="w-1/2 mx-auto">
						{loading ? (
							<Shimmer height="80px" className="p-0 border-0" />
						) : (
							<>
								<p className="text-tremor-default text-dark-tremor-content">
									Total Visitors Today
								</p>
								<p className="text-3xl text-dark-tremor-content font-semibold">
									{analyticsData.stats.totalVisitors}
								</p>
							</>
						)}
					</Card>
				</div>

				<Card
					className="w-full mx-auto"
					style={{ gridArea: 'selectClick' }}
				>
					{loading ? (
						<Shimmer height="80px" className="p-0 border-0" />
					) : (
						<>
							<label
								htmlFor="clickEventSelect"
								className="text-tremor-default text-dark-tremor-content mb-2"
							>
								Select Click Event
							</label>
							<Select
								id="clickEventSelect"
								value={clickEventData.selectedEvent?.key || ''}
								onValueChange={(value) => {
									const selectedEvent = clickEventList.find(
										(event) => event.key === value,
									);
									if (selectedEvent) {
										handleEventSelection(selectedEvent);
									}
								}}
								className="mt-2"
							>
								{clickEventList.map((event) => (
									<SelectItem
										key={event.key}
										value={event.key}
									>
										{event.name}
									</SelectItem>
								))}
							</Select>
						</>
					)}
				</Card>

				<div style={{ gridArea: 'chartClick' }}>
					{loading ? (
						<Card className="h-[230px]">
							<Shimmer height="180px" className="p-0 border-0" />
						</Card>
					) : (
						clickEventData.filteredEvents?.length > 0 && (
							<EventsBarChart
								title={`${
									clickEventData.selectedEvent?.name ||
									'Click Events'
								} by Date`}
								data={clickEventData.filteredEvents}
								categoryName="clicks"
								color="teal"
							/>
						)
					)}
				</div>

				<div
					className="w-full flex justify-between gap-4"
					style={{ gridArea: 'clickMeta' }}
				>
					<Card className="w-1/2 mx-auto">
						{loading ? (
							<Shimmer height="80px" className="p-0 border-0" />
						) : (
							<>
								<p className="text-tremor-default text-dark-tremor-content">
									Avg. clicks/day
								</p>
								<p className="text-3xl text-dark-tremor-content font-semibold">
									{(
										clickEventData.stats.totalClicks /
										trackingDays
									).toFixed(1)}
								</p>
							</>
						)}
					</Card>

					<Card className="w-1/2 mx-auto">
						{loading ? (
							<Shimmer height="80px" className="p-0 border-0" />
						) : (
							<>
								<p className="text-tremor-default text-dark-tremor-content">
									Total Clicks Today
								</p>
								<p className="text-3xl text-dark-tremor-content font-semibold">
									{clickEventData.stats.clicksToday}
								</p>
							</>
						)}
					</Card>
				</div>
			</div>

			{/* Divider with descriptive text for detailed analytics section */}
			<div className="mt-8 mb-6">
				<div className="flex items-center gap-4">
					<h2 className="text-xl font-semibold text-black dark:text-white whitespace-nowrap">
						Detailed Analytics
					</h2>
					<Divider className="flex-grow bg-gradient-to-r from-blue-500/40 to-blue-500/0 dark:from-blue-400/40 dark:to-blue-400/0 h-px my-1" />
				</div>
				<p className="text-sm text-zinc-600 dark:text-zinc-500 mt-1 max-w-md">
					Comprehensive data visualizations for deeper insights
				</p>
			</div>

			{/* Page Views Chart */}
			{loading ? (
				<Card className="h-[350px]">
					<Shimmer height="302px" className="p-0 border-0" />
				</Card>
			) : (
				analyticsData.pageViews && (
					<PageViewsChart data={analyticsData.pageViews} />
				)
			)}

			{/* User Retention Chart */}
			{loading ? (
				<Card className="h-[350px]">
					<Shimmer height="302px" className="p-0 border-0" />
				</Card>
			) : (
				analyticsData.retentionEvents && (
					<UserRetentionChart data={analyticsData.retentionEvents} />
				)
			)}
		</div>
	);
}

// TODO: Once the chart changes are done, integrate CI/CD to deploy the changes automatically
// This will ensure that the latest analytics dashboard is always available to users.
// Consider using a CI/CD tool like GitHub Actions or CircleCI to automate the deployment process
