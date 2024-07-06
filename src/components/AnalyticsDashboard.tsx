"use client"

import { analytics } from '@/utils/analytics';
import { BarChart, Card } from '@tremor/react';

const AnalyticsDashboard = ({
    avgVisitorsPerDay = '0.0',
    totalVisitors = 0,
    timeSeriesPageviews,
    trackingDays
}: {
    avgVisitorsPerDay?: string;
    totalVisitors?: number;
    timeSeriesPageviews?: Awaited<ReturnType <typeof analytics.retrieveDays>>
    trackingDays: number
}) => {
    return (
        <div className="flex flex-col gap-6">
            <div className="grid w-full mx-auto grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="w-full mx-auto">
                    <p className="text-tremor-default text-dark-tremor-content">
                        Avg. visitors/day
                    </p>
                    <p className="text-3xl text-dark-tremor-content font-semibold">
                        {avgVisitorsPerDay}
                    </p>
                </Card>

                <Card className="w-full mx-auto">
                    <p className="text-tremor-default text-dark-tremor-content">
                        Total Visitors Today
                    </p>
                    <p className="text-3xl text-dark-tremor-content font-semibold">
                        {totalVisitors}
                    </p>
                </Card>

                <Card className="w-full mx-auto">
                    <p className="text-tremor-default text-dark-tremor-content">
                        Avg. clicks/day
                    </p>
                    <p className="text-3xl text-dark-tremor-content font-semibold">
                        {"-"}
                    </p>
                </Card>

                <Card className="w-full mx-auto">
                    <p className="text-tremor-default text-dark-tremor-content">
                        Total Clicks Today
                    </p>
                    <p className="text-3xl text-dark-tremor-content font-semibold">
                        {"-"}
                    </p>
                </Card>

                <Card>
                    {
                        timeSeriesPageviews ? (
                            <BarChart 
                                showAnimation
                                categories={["visitors"]}
                                data={timeSeriesPageviews.map((item => ({
                                    name: item.date,
                                    visitors: item.events.reduce((acc, curr) => {
                                        return (
                                            acc + Object.values(curr)[0]!
                                        )
                                    }, 0)
                                })))}
                                index="name"
                                colors={['blue']}
                                allowDecimals={false}
                            />
                        ) : null
                    }
                </Card>
            </div>
        </div>
    );
};

export default AnalyticsDashboard