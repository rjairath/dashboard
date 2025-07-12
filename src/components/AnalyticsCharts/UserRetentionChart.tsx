import React from 'react';
import { BarChart, Card } from '@tremor/react';
import type { AnalyticsResponse } from '@/types/Analytics';
import { format, parse } from 'date-fns';

const CHART_COLORS = ['emerald', 'violet'];

type UserRetentionChartProps = {
	data: AnalyticsResponse;
};

const UserRetentionChart = ({ data }: UserRetentionChartProps) => {
	console.log(data, 'user retention chart data...');
	// Transform the data for BarChart with a consistent approach
	const transformData = (data: AnalyticsResponse) => {
		if (!data || !data.length) return [];

		// Sort the dates to ensure chronological order
		const sortedData = [...data].sort((a, b) => {
			const dateA = parse(a.date, 'dd/MM/yyyy', new Date());
			const dateB = parse(b.date, 'dd/MM/yyyy', new Date());
			return dateA.getTime() - dateB.getTime();
		});

		// Create chart data with new and returning users
		return sortedData.map((day) => {
			// Parse the date and format it for display
			const parsedDate = parse(day.date, 'dd/MM/yyyy', new Date());
			const formattedDate = format(parsedDate, 'MMM d');

			// Initialize data point with default values
			const dataPoint: Record<string, string | number> = {
				date: formattedDate,
				'New Users': 0,
				'Returning Users': 0,
			};

			// Populate with actual values if they exist
			day.events.forEach((event) => {
				const key = Object.keys(event)[0];
				if (key === 'new') {
					dataPoint['New Users'] = Object.values(event)[0] || 0;
				} else if (key === 'returning') {
					dataPoint['Returning Users'] = Object.values(event)[0] || 0;
				}
			});

			// Add a total field for reference
			dataPoint['Total'] =
				Number(dataPoint['New Users']) +
				Number(dataPoint['Returning Users']);

			return dataPoint;
		});
	};

	const chartData = transformData(data);
	const categories = ['New Users', 'Returning Users'];

	return (
		<Card>
			<h3 className="text-lg font-medium mb-4">User Retention</h3>
			<BarChart
				className="h-72"
				data={chartData}
				index="date"
				categories={categories}
				colors={CHART_COLORS}
				showLegend={true}
				stack={true}
				showAnimation={true}
				showGridLines={true}
				showXAxis={true}
				showYAxis={true}
				yAxisWidth={40}
				valueFormatter={(number) => `${number.toString()}`}
			/>
		</Card>
	);
};

export default UserRetentionChart;
