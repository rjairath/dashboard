import React from 'react';
import { AreaChart, Card } from '@tremor/react';
import type { AnalyticsResponse } from '@/types/Analytics';
import { format, parse } from 'date-fns';

const CHART_COLORS = ['blue', 'cyan', 'green', 'amber', 'violet', 'indigo'];

type PageViewsChartProps = {
	data: AnalyticsResponse;
};

const PageViewsChart = ({ data }: PageViewsChartProps) => {
	// Transform the data for AreaChart with a simpler approach
	const transformData = (data: AnalyticsResponse) => {
		if (!data || !data.length) return [];

		const pageSet = new Set<string>();

		// Sort the dates to ensure chronological order
		const sortedData = [...data].sort((a, b) => {
			return parse(a.date, 'dd/MM/yyyy', new Date()) <
				parse(b.date, 'dd/MM/yyyy', new Date())
				? -1
				: 1;
		});

		console.log('Sorted Data:', sortedData);

		// Create a map of page views by date
		const chartData = sortedData.map((day) => {
			// Parse the date and format it for display
			const parsedDate = parse(day.date, 'dd/MM/yyyy', new Date());
			const formattedDate = format(parsedDate, 'MMM d');

			// Start with formatted date
			const dataPoint: Record<string, string | number> = {
				date: formattedDate,
			};

			// Add each page's views
			day.events.forEach((event) => {
				const eventKey = Object.keys(event)[0];
				try {
					const pageUrl = JSON.parse(eventKey).page;
					// Clean the URL for display (remove / at beginning)
					const pageName =
						pageUrl === '/' ? 'home' : pageUrl.substring(1);
					dataPoint[pageName] = Object.values(event)[0];
					pageSet.add(pageName); // Add to the set of unique pages
				} catch (e) {
					console.error('Error parsing event key:', eventKey, e);
				}
			});

			return dataPoint;
		});

		// Fill in missing pages with 0
		chartData.forEach((dataPoint) => {
			pageSet.forEach((page) => {
				if (!(page in dataPoint)) {
					dataPoint[page] = 0; // Set missing pages to 0
				}
			});
		});

		console.log('chartData', chartData);
		return chartData;
	};

	const chartData = transformData(data);

	// Get unique pages from the transformed data
	const getUniquePages = () => {
		if (!chartData.length) return [];

		// Using a Set because it automatically handles duplicates
		const allPages = new Set<string>();
		chartData.forEach((dataPoint) => {
			Object.keys(dataPoint).forEach((key) => {
				if (key !== 'date') allPages.add(key);
			});
		});

		return Array.from(allPages);
	};

	const uniquePages = getUniquePages();

	return (
		<Card>
			<h3 className="text-lg font-mediummb-4">Page Views by Date</h3>
			<AreaChart
				className="h-72"
				data={chartData}
				index="date"
				categories={uniquePages}
				colors={CHART_COLORS}
				showLegend={true}
				stack={true}
				showAnimation={true}
				connectNulls={true}
				curveType="monotone"
				showGridLines={true}
				showXAxis={true}
				showYAxis={true}
				yAxisWidth={40}
				valueFormatter={(number) => `${number.toString()}`}
			/>
		</Card>
	);
};

export default PageViewsChart;
