'use client';

import { Card, Select, SelectItem } from '@tremor/react';
import { useState, useEffect } from 'react';
import { clickEventList } from '@/constants';
import { getDate, findEventByKey, getValueFromKey } from '@/utils';
import { retrieveDaysBatch } from '@/utils/analytics';
import {
	analyticsTypeEnum,
	type AnalyticsData,
	type ClickEventData,
} from '@/types/Analytics';
import PageViewsChart from './AnalyticsCharts/PageViewsChart';
import EventsBarChart from './AnalyticsCharts/EventsBarChart';

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
	};

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

	// Fetch data on component mount
	useEffect(() => {
		fetchData();
	}, []);

	// Process click event data when analytics data changes
	useEffect(() => {
		if (analyticsData.clickEvents && clickEventData.selectedEvent) {
			handleEventSelection(clickEventData.selectedEvent);
		}
	}, [analyticsData.clickEvents]);

	return (
		<div className="flex flex-col gap-6">
			<div className="grid-mobile sm:grid-desktop w-full mx-auto grid-cols-1 sm:grid-cols-2 gap-6">
				<Card
					className="w-full mx-auto"
					style={{ gridArea: 'avgVisitor' }}
				>
					{/* TODO: Show a currently active card - make the dot to be a blinking green color, looks nice */}
					<p className="text-tremor-default text-dark-tremor-content">
						Avg. Visitors/day
					</p>
					<p className="text-3xl text-dark-tremor-content font-semibold">
						{analyticsData.stats.avgVisitorsPerDay}
					</p>
				</Card>

				<Card
					className="w-full mx-auto"
					style={{ gridArea: 'selectClick' }}
				>
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
							<SelectItem key={event.key} value={event.key}>
								{event.name}
							</SelectItem>
						))}
					</Select>
				</Card>

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

				<div style={{ gridArea: 'chartVisitor' }}>
					{analyticsData.pageViews && (
						<EventsBarChart
							title="Visitors by Date"
							data={analyticsData.pageViews}
							categoryName="visitors"
							color="blue"
						/>
					)}
				</div>

				<div style={{ gridArea: 'chartClick' }}>
					{clickEventData.filteredEvents?.length > 0 && (
						<EventsBarChart
							title={`${
								clickEventData.selectedEvent?.name ||
								'Click Events'
							} by Date`}
							data={clickEventData.filteredEvents}
							categoryName="clicks"
							color="teal"
						/>
					)}
				</div>
			</div>

			{/* Page Views Chart */}
			{analyticsData.pageViews && (
				<PageViewsChart data={analyticsData.pageViews} />
			)}

			{/* TODO: Show user retention graph */}
		</div>
	);
}

// TODO: Once the chart changes are done, integrate CI/CD to deploy the changes automatically
// This will ensure that the latest analytics dashboard is always available to users.
// Consider using a CI/CD tool like GitHub Actions or CircleCI to automate the deployment process
