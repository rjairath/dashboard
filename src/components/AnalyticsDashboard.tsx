"use client"

import { analytics } from '@/utils/analytics';
import { BarChart, Card } from '@tremor/react';
import { useState, useEffect } from 'react';
import { clickEventList, clickEvents } from '@/constants';
import { getDate } from '@/utils';

interface ClickEvents {
    [x: string]: number;
}

const AnalyticsDashboard = ({
    avgVisitorsPerDay = '0.0',
    totalVisitors = 0,
    timeSeriesPageviews,
    timeSeriesClickEvents,
    trackingDays
}: {
    avgVisitorsPerDay?: string;
    totalVisitors?: number;
    timeSeriesPageviews?: Awaited<ReturnType <typeof analytics.retrieveDays>>
    timeSeriesClickEvents?: Awaited<ReturnType <typeof analytics.retrieveDays>>
    trackingDays: number
}) => {
    const [dropdownOpen, setdropdownOpen] = useState(false);
    const [selectedClickEvent, setSelectedClickEvent] = useState(clickEventList[0]);
    const [totalEventClicks, setTotalEventClicks] = useState(0);
    const [eventClicksToday, setEventClicksToday] = useState(0);
    const [timeSeriesClickEventsPerKey, setTimeSeriesClickEventsPerKey] = useState<Awaited<ReturnType <typeof analytics.retrieveDays>>>([]);

    const handleEventSelection = (el: {key: string, name: string}) => {
        setdropdownOpen(!dropdownOpen);
        setSelectedClickEvent(el);
    }

    const findObj = (arr?: ClickEvents[]) => {
        const obj = arr?.find(item => {
          return item.hasOwnProperty(JSON.stringify(selectedClickEvent?.key))
        });
        return obj;
    }

    useEffect(() => {
        const totalClicks = timeSeriesClickEvents?.reduce((acc, curr) => {
            let objWithKey = findObj(curr.events);
            let currValue = 0
            if(objWithKey){ 
                currValue = objWithKey[JSON.stringify(selectedClickEvent?.key)]
            }
            return (
               acc + currValue
            )
        }, 0);

        const eventObjToday = timeSeriesClickEvents?.filter(item => item.date === getDate())[0];
        let objWithKey;
        let totalClicksToday = 0;

        if(eventObjToday) {
            objWithKey = findObj(eventObjToday?.events);
            if(objWithKey) {
                totalClicksToday = objWithKey[JSON.stringify(selectedClickEvent?.key)]
            }
        }
        
        const filteredData = timeSeriesClickEvents?.map(item => {
            return {
                date: item.date,
                events: item.events.filter((eventObj) => eventObj.hasOwnProperty(JSON.stringify(selectedClickEvent?.key)))
            }
        })
        console.log(filteredData, "filter");

        setTotalEventClicks(totalClicks ?? 0);
        setEventClicksToday(totalClicksToday);
        setTimeSeriesClickEventsPerKey(filteredData ?? []);
    }, [selectedClickEvent?.key]);


    return (
		<div className="flex flex-col gap-6">
			<div className="grid w-full mx-auto grid-cols-1 sm:grid-cols-2 gap-6">
				<Card className="w-full mx-auto">
					<p className="text-tremor-default text-dark-tremor-content">
						Avg. Visitors/day
					</p>
					<p className="text-3xl text-dark-tremor-content font-semibold">
						{avgVisitorsPerDay}
					</p>
				</Card>

				<div className="w-full flex flex-col justify-between relative select-none">
					<p className="text-xl font-bold mb-2">Select Click Event</p>
					<Card
						className="p-4 cursor-pointer"
						onClick={() => setdropdownOpen(!dropdownOpen)}
					>
						<p className="text-xl font-semibold text-dark-tremor-content">
							{selectedClickEvent?.name}
						</p>
					</Card>

					{dropdownOpen && (
						<div
							className={`absolute top-[100%] flex flex-col w-[90%] p-2 rounded-lg shadow-xl z-[900] 
                                bg-white dark:bg-gray-800 divide-y dark:divide-gray-700 right-0
                            `}
						>
							{[...clickEventList].map((el) => (
								<button
									key={el?.key}
									className="relative font-bold px-1 py-4 sm:px-4 sm:py-2 text-sm 
                                        text-gray-700 dark:text-dark-tremor-content transition-all delay-100 hover:text-gray-900 dark:hover:text-gray-200 text-left"
								>
									<span
										className="relative z-10"
										onClick={(e) =>
											handleEventSelection(el)
										}
									>
										{el.name}
									</span>
								</button>
							))}
						</div>
					)}
				</div>

				<Card className="w-full mx-auto">
					<p className="text-tremor-default text-dark-tremor-content">
						Total Visitors Today
					</p>
					<p className="text-3xl text-dark-tremor-content font-semibold">
						{totalVisitors}
					</p>
				</Card>

				<div className="w-full flex justify-between gap-4">
					<Card className="w-1/2 mx-auto">
						<p className="text-tremor-default text-dark-tremor-content">
                            Avg. clicks/day
						</p>
						<p className="text-3xl text-dark-tremor-content font-semibold">
							{(totalEventClicks/trackingDays).toFixed(1)}
						</p>
					</Card>

                    <Card className="w-1/2 mx-auto">
						<p className="text-tremor-default text-dark-tremor-content">
							Total Clicks Today
						</p>
						<p className="text-3xl text-dark-tremor-content font-semibold">
							{eventClicksToday}
						</p>
					</Card>
				</div>

				<Card>
					{timeSeriesPageviews ? (
						<BarChart
							showAnimation
							categories={['visitors']}
							data={timeSeriesPageviews.map((item) => ({
								name: item.date,
								visitors: item.events.reduce((acc, curr) => {
									return acc + Object.values(curr)[0]!;
								}, 0),
							}))}
							index="name"
							colors={['blue']}
							allowDecimals={false}
						/>
					) : null}
				</Card>

                <Card>
					{timeSeriesClickEventsPerKey ? (
						<BarChart
							showAnimation
							categories={['clicks']}
							data={timeSeriesClickEventsPerKey.map((item) => ({
								name: item.date,
								clicks: item.events.reduce((acc, curr) => {
									return acc + Object.values(curr)[0]!;
								}, 0),
							}))}
							index="name"
							colors={['teal']}
							allowDecimals={false}
						/>
					) : null}
				</Card>
			</div>
		</div>
	);
};

export default AnalyticsDashboard