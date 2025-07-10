'use client';

import { BarChart, Card } from '@tremor/react';
import { AnalyticsResponse } from '@/types/Analytics';
import { parse, format } from 'date-fns';

interface EventsBarChartProps {
	title: string;
	data: AnalyticsResponse;
	categoryName: string;
	color: string;
}

export default function EventsBarChart({
	title,
	data,
	categoryName,
	color,
}: EventsBarChartProps) {
	if (!data || data.length === 0) return null;

	const chartData = data.map((item) => {
		// Parse the date and format it for display
		const parsedDate = parse(item.date, 'dd/MM/yyyy', new Date());
		const formattedDate = format(parsedDate, 'MMM d');

		return {
			name: formattedDate,
			[categoryName]: item.events.reduce(
				(acc, curr) => acc + Object.values(curr)[0]!,
				0,
			),
		};
	});

	return (
		<Card>
			<h3 className="text-lg font-medium mb-4">{title}</h3>
			<BarChart
				showAnimation
				categories={[categoryName]}
				data={chartData}
				index="name"
				colors={[color]}
				allowDecimals={false}
			/>
		</Card>
	);
}
