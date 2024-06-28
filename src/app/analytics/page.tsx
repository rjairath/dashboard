import { analytics } from "@/utils/analytics";

const AnalyticsPage = async () => {
    const eventData = await analytics.retrieve("pageView", "23/06/2024")
    return (
        <div>
            <pre>{JSON.stringify(eventData)}</pre>
        </div>
    )
}

export default AnalyticsPage