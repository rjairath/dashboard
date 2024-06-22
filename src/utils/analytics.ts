import { redis } from '../lib/redis';

interface AnalyticsArgs {
    retention?: number;
}

class Analytics {
    private _retention = 7 * 24 * 60 * 60;

    constructor(args?: AnalyticsArgs) {
        if(args?.retention) this._retention = args.retention
    }

    async track(namespace: string, event: object) {
        const key = `analytics::${namespace}`;
        // key here is the hashname
        await redis.hincrby(key, JSON.stringify(event), 1);
    }
}

export const analytics = new Analytics()