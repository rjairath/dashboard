import SkillTag from '@/components/SkillTag';
import WorkDetailList from '@/components/WorkDetailList';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Work',
    description: 'A summary of my work and contributions.',
};

const WorkPage = () => {
  return (
		<div
			id="container"
			className="w-full bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-200"
		>
			<div id="workSection" className="max-w-6xl mx-auto p-8">
				<h3 className="font-bold text-2xl md:text-4xl tracking-tight mb-2 text-black dark:text-white">
					My Work
				</h3>
				<div className="md:w-3/4 text-zinc-600 dark:text-zinc-500 mb-4">
					<p>Here is a summary of my work so far.</p>
				</div>

				<Suspense fallback={<p>Loading...</p>}>
					<WorkDetailList />
				</Suspense>
			</div>
		</div>
  );
}

export default WorkPage;