// Use the date in dd/MM/yyyy and then format with date-fns
export const highlightList = [
    {
        date: 1719859461606,
        title: "Adding PageView Analytics to Portfolio",
        description: "Maintaining the analytics data in a serverless redis db, and visualising it with some React charts. Click on Analytics in the menu above to see it in action!"
    },
    {
        date: 1719687093486,
        title: "Enabled dark mode for all pages",
        description: "Leveraging tailwind for toggling dark and light mode. Detects system preference on first load and picks up from localStorage on subsequent reloads \u2728"
    }
];

export const namespace = {
    pageView: "pageView",
    clickEvent: "clickEvent"
}

export const clickEvents = {
    theme_click: "theme_click",
    workSection_click: "workSection_click",
    analyticsSection_click: "analyticsSection_click"
}