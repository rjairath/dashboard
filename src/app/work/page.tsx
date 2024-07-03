import type { Metadata } from 'next';
import Link from 'next/link';

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
				<div className="md:w-3/4 text-zinc-600 dark:text-zinc-500">
					<p>Here's a summary of my work so far.</p>
				</div>
				<hr className="my-6 border-neutral-100 dark:border-neutral-800" />

				<h4 className="font-medium text-xl tracking-tighter">
					Glance
				</h4>
				<p className="text-zinc-600 dark:text-zinc-500 text-sm">
					SDE-III
				</p>
                <ul>
					<li></li>
					<li></li>
					<li></li>
				</ul>
                <hr className="my-6 border-neutral-100 dark:border-neutral-800" />

                {/* Pharmeasy */}
                <h4 className="font-medium text-xl tracking-tighter">
					Pharmeasy
				</h4>
				<p className="text-zinc-600 dark:text-zinc-500 text-sm">
					Software Engineer
				</p>
                <ul>
					<li></li>
					<li></li>
					<li></li>
				</ul>
                <hr className="my-6 border-neutral-100 dark:border-neutral-800" />

                {/* Tapchief */}
                <h4 className="font-medium text-xl tracking-tighter">
					Tapchief
				</h4>
				<p className="text-zinc-600 dark:text-zinc-500 text-sm">
					Product Engineer
				</p>
                <ul>
					<li></li>
					<li></li>
					<li></li>
				</ul>
                <hr className="my-6 border-neutral-100 dark:border-neutral-800" />

                {/* Digit Insurance */}
                <h4 className="font-medium text-xl tracking-tighter">
					Digit Insurance
				</h4>
				<p className="text-zinc-600 dark:text-zinc-500 text-sm">
					Graduate Trainee Engineer
				</p>
                <ul>
					<li></li>
					<li></li>
					<li></li>
				</ul>
			</div>
		</div>
  );
}

export default WorkPage;