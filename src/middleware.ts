import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { analytics } from "./utils/analytics";

export default function middleware(req: NextRequest) {
    if(req.nextUrl.pathname === '/') {
        // Track analytics event, design API
        try {
            analytics.track("pageView", {
                page: "/",
            })
        } catch (err) {
            // Fail silently
            console.log(err, "error");
        }
    }

    return NextResponse.next();
} 

export const config = {
    matcher: ['/'] 
}