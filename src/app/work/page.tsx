import SkillTag from '@/components/SkillTag';
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
				<div className="md:w-3/4 text-zinc-600 dark:text-zinc-500 mb-4">
					<p>Here's a summary of my work so far.</p>
				</div>

				<h4 className="font-medium text-xl tracking-tighter">
					Glance
				</h4>
				<p className="text-zinc-600 dark:text-zinc-500 text-sm">
					SDE-III
				</p>
                <ul className='custom-list text-base text-zinc-600 dark:text-zinc-500'>
					<li>Joined the gaming team at Glance as an SDE-II in 2022
						Majorly worked on Game Center, the gaming destination on glance surfaces and developed Dev Portal, the game publishing dashboard
					</li>
					<li> Was promoted to SDE-III in September 2023. Around this time we started Implementing challenges on game center to enhance user engagement
					</li>
					<li>Developed a standardized CDN URL schema for Nostra Games, optimizing the delivery and accessibility of game assets</li>
				</ul>
				<SkillTag skillArray={["ReactJS", "Redux", "Typescript", "NextJS", "ExpressJS", "Webpack", "Tailwind"]}/>

                <hr className="my-6 border-neutral-100 dark:border-neutral-800" />

                {/* Pharmeasy */}
                <h4 className="font-medium text-xl tracking-tighter">
					Pharmeasy
				</h4>
				<p className="text-zinc-600 dark:text-zinc-500 text-sm">
					Software Engineer
				</p>
                <ul className='custom-list text-base text-zinc-600 dark:text-zinc-500'>
					<li>Developed Vault, the accounting platform for Pharmeasy's finance team, as the sole frontend developer</li>
					<li>Made an auto payments dashboard facilitating bulk payment and status monitoring</li>
				</ul>
				<SkillTag skillArray={["Angular", "Typescript", "Java", "SQL"]}/>

                <hr className="my-6 border-neutral-100 dark:border-neutral-800" />

                {/* Tapchief */}
                <h4 className="font-medium text-xl tracking-tighter">
					Tapchief
				</h4>
				<p className="text-zinc-600 dark:text-zinc-500 text-sm">
					Product Engineer
				</p>
                <ul className='custom-list text-base text-zinc-600 dark:text-zinc-500'>
					<li>Developed ATS Admin, an internal tool for the fulfillment team leveraging Angular for the UI and utilizing a micro
					frontend architecture. Learned some python and occasionally managed the backend code as well</li>
				</ul>
				<SkillTag skillArray={["Angular", "ReactJS", "Typescript", "Python"]}/>
				
                <hr className="my-6 border-neutral-100 dark:border-neutral-800" />

                {/* Digit Insurance */}
                <h4 className="font-medium text-xl tracking-tighter">
					Digit Insurance
				</h4>
				<p className="text-zinc-600 dark:text-zinc-500 text-sm">
					Graduate Trainee Engineer
				</p>
                <ul className='custom-list text-base text-zinc-600 dark:text-zinc-500'>
					<li>Developed Digit Direct, a customer-facing insurance app with AngularJS and jQuery, and Digit Care, an internal
					operations portal.</li>
					<li>Additionally, led the creation of the Travel Delay Claim App, where you verify your boarding pass in case of a flight delay</li>
				</ul>
			</div>
		</div>
  );
}

export default WorkPage;