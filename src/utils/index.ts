import { format, subDays } from 'date-fns'

// Return the date after subtracting the sub days
export const getDate = (sub: number = 0) => {
    const dateXDaysAgo = subDays(new Date(), sub);
    return format(dateXDaysAgo, "dd/MM/yyyy");
}

export const formatTimestampToDate = (timestamp: number) => {
    // Create a Date object from the timestamp
    const date = new Date(timestamp);
    // Format the date to dd/MM/yyyy
    const formattedDate = format(date, 'dd/MM/yyyy');
    return formattedDate;
}