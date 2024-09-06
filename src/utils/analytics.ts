import { getDate } from '@/utils';
import { redis } from '../lib/redis';
import { parse } from 'date-fns';

interface AnalyticsArgs {
    retention?: number;
}

class Analytics {
    private _retention = 7 * 24 * 60 * 60;

    constructor(args?: AnalyticsArgs) {
        if(args?.retention) this._retention = args.retention
    }

    // Increment the hash map key counts -> key here is sth like "{page: '/'}"
    async track(namespace: string, event: object | string, opts?: { persist?: boolean}) {
        let key = `analytics::${namespace}`;
        if(!opts?.persist) {
            key += `::${getDate(0)}`
        }
        // key here is the hashname
        await redis.hincrby(key, JSON.stringify(event), 1);
        if(!opts?.persist) {
            await redis.expire(key, this._retention);
        }
    }

    async retrieveDays(namespace: string, nDays: number) {
        type AnalyticsPromise = ReturnType<typeof analytics.retrieve>;
        const promises: AnalyticsPromise[] = [];

        for(let i=0; i<nDays; i++) {
            const formattedDate = getDate(i);
            const promise = analytics.retrieve(namespace, formattedDate); 
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

    async retrieve(namespace: string, date: string) {
        let key = `analytics::${namespace}::${date}`;
        const res = await redis.hgetall(key);

        return {
            date,
            events: Object.entries(res ?? []).map(([key, value]) => ({
                [key]: Number(value),
            })),
        }
    }
}

export const analytics = new Analytics()