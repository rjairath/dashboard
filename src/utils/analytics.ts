import { getDate } from '@/utils';
import { redis } from '../lib/redis';

interface AnalyticsArgs {
    retention?: number;
}

class Analytics {
    private _retention = 7 * 24 * 60 * 60;

    constructor(args?: AnalyticsArgs) {
        if(args?.retention) this._retention = args.retention
    }

    async track(namespace: string, event: object, opts?: { persist?: boolean}) {
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

    async retrieve(namespace: string, date: string) {
        let key = `analytics::${namespace}::${date}`;
        const res = await redis.hgetall(key);
        
        console.log(res, "res...")

        return {
            date,
            events: Object.entries(res ?? []).map(([key, value]) => ({
                [key]: Number(value),
            })),
        }
    }
}

export const analytics = new Analytics()