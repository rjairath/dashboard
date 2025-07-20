import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

const VISITOR_ID_KEY = 'analytics_visitor_id';
const SESSION_ID_KEY = 'analytics_session_id';
const PAGE_VIEWS_KEY = 'analytics_page_views';

type VisitorData = {
	visitorId: string;
	sessionId: string;
	isNewVisitor: boolean;
	isNewSession: boolean;
	pageViews: string[];
	isNewPageView: boolean;
};

/**
 * Hook for tracking visitors and sessions
 */
export function useVisitor(): VisitorData {
	const currentPath = usePathname();

	const [visitorData, setVisitorData] = useState<VisitorData>({
		visitorId: '',
		sessionId: '',
		isNewVisitor: false,
		isNewSession: false,
		pageViews: [],
		isNewPageView: false,
	});

	useEffect(() => {
		// Get or create visitor ID (persists across browser sessions)
		let visitorId = localStorage.getItem(VISITOR_ID_KEY);
		const isNewVisitor = !visitorId;

		if (!visitorId) {
			// First time visitor
			visitorId = uuidv4();
			localStorage.setItem(VISITOR_ID_KEY, visitorId);
		}

		// Get or create session ID (lasts only for current browser session)
		let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
		const isNewSession = !sessionId;

		if (!sessionId) {
			// New session (either new tab/window or after browser was closed)
			sessionId = uuidv4();
			sessionStorage.setItem(SESSION_ID_KEY, sessionId);
		}

		// If we don't have a valid path yet, just update the basic visitor data
		if (!currentPath) {
			setVisitorData((prev) => ({
				...prev,
				visitorId,
				sessionId,
				isNewVisitor,
				isNewSession,
			}));
			return;
		}

		// Get stored page views
		let pageViews: string[] = [];
		try {
			const stored = sessionStorage.getItem(PAGE_VIEWS_KEY);
			pageViews = stored ? JSON.parse(stored) : [];
		} catch (e) {
			console.error('Error parsing page views:', e);
		}

		const isNewPageView = !pageViews.includes(currentPath);

		// If this is a new page view, add it to the tracked pages
		if (isNewPageView) {
			pageViews.push(currentPath);
			sessionStorage.setItem(PAGE_VIEWS_KEY, JSON.stringify(pageViews));
		}

		// Update state with all the values
		setVisitorData((prev) => {
			const newState = {
				...prev,
				visitorId,
				sessionId,
				isNewVisitor,
				isNewSession,
				pageViews,
				isNewPageView,
			};
			return newState;
		});
	}, [currentPath]); // Now depends only on pathname changes
	return visitorData;
}
