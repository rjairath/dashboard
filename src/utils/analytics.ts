import { getDate } from '@/utils';
import { parse } from 'date-fns';
import { getAnalytics } from '@/lib/api';

export const retrieveDays = async (originUrl: string, type: string, nDays: number) => {
    const promises = [];

    for(let i = 0; i < nDays; i++) {
        const formattedDate = getDate(i);
        const promise = getAnalytics(originUrl, formattedDate, type); 
        promises.push(promise);
    }

    const fetchedRes = await Promise.all(promises);

    // Sort in increasing order
    fetchedRes.sort((a,b) => {
        if(parse(a.date, "dd/MM/yyyy", new Date()) > parse(b.date, "dd/MM/yyyy", new Date())) {
            return 1;
        } else {
            return -1;
        }
    })

    return fetchedRes;
}