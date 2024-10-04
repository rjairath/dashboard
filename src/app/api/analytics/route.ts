import { NextRequest, NextResponse } from 'next/server';
import redisSingleton from '@/lib/redisSingleton';
import { namespace } from '@/constants'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type'); // pageView or clickEvent
    const date = searchParams.get('date');

    if(!type || !date) {
        return NextResponse.json({error: "Invalid data"}, {status: 400});
    }

    let key = `analytics::${type}::${date}`;

    try {
        const redisClient = redisSingleton.getClient();
        const val = await redisClient.hGetAll(key);
        return NextResponse.json({ value: val });
    } catch (error) {
        console.log(error, "error fetching the hashtable");
        return NextResponse.json({error: "Error in redis get hash"}, {status: 500});
    }
}

export async function POST(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type'); // pageView or clickEvent
    const date = searchParams.get('date');

    const body = await request.json();

    if(!type || !date) {
        return NextResponse.json({error: "Invalid data"}, {status: 400});
    }

    // date to be in the form of 28/09/2024
    let key = `analytics::${type}::${date}`;
    let field;
    if(type === namespace.pageView) {
        field = {
            // page: pageUrl
            page: body?.pageUrl
        }
    } else if(type === namespace.clickEvent) {
        // field = clickEvent;
        field = body?.clickEvent
    } else {
        return NextResponse.json({error: "Incompatible analytics type"}, {status: 400});
    }

    try {
        const redisClient = redisSingleton.getClient();
        const val = await redisClient.hIncrBy(key, JSON.stringify(field), 1); 
        return NextResponse.json({ value: val });
    } catch (error) {
        console.log(error, "error in redis update hash");
        return NextResponse.json({error: "Error in redis update hash"}, {status: 500});
    }
}