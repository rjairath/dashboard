import BlogDetailList from '@/components/BlogDetailList';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Blogs',
    description: 'A collection of my latest blogs.',
};

export default function BlogPage() {
    return (
        <div
			id="container"
			className="w-full bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-200"
		>
			<div id="workSection" className="max-w-6xl mx-auto p-8">
				<h3 className="font-bold text-2xl md:text-4xl tracking-tight mb-2 text-black dark:text-white">
					My Blogs
				</h3>
				<div className="md:w-3/4 text-zinc-600 dark:text-zinc-500 mb-4">
					<p>Writings on tech and startups</p>
				</div>

                <Suspense fallback={<p>Loading...</p>}>
					<BlogDetailList />
				</Suspense>
			</div>
		</div>
    )
}
