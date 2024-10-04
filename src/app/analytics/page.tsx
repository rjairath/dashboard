import AnalyticsDashboardNew from "@/components/AnalyticsDashboardNew";

const AnalyticsPage = () => {
    const TRACKING_DAYS = 5;

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
                    <AnalyticsDashboardNew 
                        trackingDays={TRACKING_DAYS}
                    />
				</div>
			</div>
		</div>
	);
}

export default AnalyticsPage