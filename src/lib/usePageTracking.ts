import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useVisitor } from './useVisitor';
import { getDate } from '@/utils';
import { analyticsTypeEnum } from '@/types/Analytics';
import { postAnalytics } from './api';

/**
 * Hook for tracking page views
 * Only tracks each page once per session
 */
export function usePageTracking(customPageName?: string) {
	const {
		visitorId,
		sessionId,
		isNewVisitor,
		isNewSession,
		isNewPageView,
		pageViews,
	} = useVisitor();

	const pageUrl = customPageName || pageViews[pageViews.length - 1];

	useEffect(() => {
		if (visitorId && isNewPageView) {
			const baseUrl = window.location.origin;
			const date = getDate(0);
			const payload = JSON.stringify({
				pageUrl,
				visitorId,
				sessionId,
				isNewVisitor,
				isNewSession,
			});

			// Track the page view
			postAnalytics(baseUrl, date, analyticsTypeEnum.pageView, payload);
		}
	}, [visitorId, sessionId, isNewVisitor, isNewSession, isNewPageView]);
}
