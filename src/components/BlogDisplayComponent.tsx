"use client";

import { BlogDetailObj } from "@/types/BlogDetails";
import { formatISODate } from "@/utils";

export default function BlogDisplayComponent({ item }: { item : BlogDetailObj }) {
    const redirectTo = (url: string) => {
        window.open(url, '_blank');
    }

    return (
        <div onClick={() => redirectTo(item.attributes.blogUrl)} 
            className="pt-2 pr-2 pl-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-800">
            <h4 className="text-xl font-bold tracking-tighter">
                {item.attributes.title}
            </h4>
            <p className="text-base text-zinc-600 dark:text-zinc-500">
                {item.attributes.description}
            </p>
            <div className="flex justify-end mt-4">
                <p className="text-sm font-normal text-zinc-600 dark:text-zinc-500">{formatISODate(item.attributes.datePublished)}</p>
            </div>
            <hr className="mt-6 border-neutral-100 dark:border-neutral-800" />
        </div>
    )
}
