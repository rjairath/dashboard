import { analytics } from "@/utils/analytics";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { getDate } from "@/utils";

interface PageViewObj {
    date: string;
    events: {
        [x: string]: number;
    }[]
}

const AnalyticsPage = async () => {
    const TRACKING_DAYS = 5;
    const pageViews = await analytics.retrieveDays("pageView", TRACKING_DAYS);

    /**
     * pageViews = [
     *  {date: "25/06/2024", event: []},
     *  {date: "29/06/2024", event: [{"{\"page\":\"/\"}":1}, {"{\"page\":\about"/\"}":2}]},
     * ]
     */

    let totalPageViews = 0;

    pageViews.forEach((item: PageViewObj) => {
        item.events?.forEach((eventEntry) => {
            totalPageViews += Object.values(eventEntry)[0]!
        })
    });
    const averagePageViews = (totalPageViews/TRACKING_DAYS).toFixed(1);
    const amtVisitorsToday = pageViews.filter(item => item.date === getDate()).reduce(
        (acc, curr) => {
            return (
                acc + curr.events.reduce((acc, curr) => (acc + Object.values(curr)[0]!), 0)
            )
        }, 0
    )

    return (
		<div
			id="container"
			className="w-full bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-200"
		>
			<div id="analyticsSection" className="max-w-6xl mx-auto p-8">
				<h3 className="font-bold text-2xl md:text-4xl tracking-tight mb-4 text-black dark:text-white">
					Analytics Dashboard
				</h3>
				<div className="relative w-full text-gray-700 dark:text-gray-200">
					<AnalyticsDashboard
						avgVisitorsPerDay={averagePageViews}
						totalVisitors={amtVisitorsToday}
						timeSeriesPageviews={pageViews}
						trackingDays={TRACKING_DAYS}
					/>
				</div>
			</div>
		</div>
	);
}

export default AnalyticsPage