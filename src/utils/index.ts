import { format, subDays, parseISO } from 'date-fns';

// Return the date after subtracting the sub days
export const getDate = (sub: number = 0) => {
	const dateXDaysAgo = subDays(new Date(), sub);
	return format(dateXDaysAgo, 'dd/MM/yyyy');
};

export const formatTimestampToDate = (timestamp: number) => {
	// Create a Date object from the timestamp
	const date = new Date(timestamp);
	// Format the date to dd/MM/yyyy
	const formattedDate = format(date, 'dd/MM/yyyy');
	return formattedDate;
};

export const formatISODate = (date: string) => {
	const formattedDate = format(parseISO(date), 'dd/MM/yyyy');
	return formattedDate;
};

// Helper function to find click event object by key
export const findEventByKey = (
	events?: Record<string, number>[],
	eventKey?: string,
) => {
	if (!events || !eventKey) return undefined;

	return events.find((item) =>
		Object.keys(item).some(
			(jsonKey) => JSON.parse(jsonKey) === `${eventKey}`,
		),
	);
};

// Helper function to get value for a specific key
export const getValueFromKey = (
	obj: Record<string, number> | undefined,
	eventKey?: string,
) => {
	if (!obj || !eventKey) return 0;
	const matchingKey = JSON.stringify(eventKey);
	return obj[matchingKey] || 0;
};
