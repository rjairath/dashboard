import { Card } from '@tremor/react';

type CurrentlyActiveUsersCardProps = {
	activeUsers: number;
};

export const CurrentlyActiveUsersCard = ({
	activeUsers,
}: CurrentlyActiveUsersCardProps) => {
	return (
		<Card className="w-full mx-auto h-full flex flex-col justify-start gap-2">
			<div className="flex items-center gap-2">
				<p className="text-tremor-default text-dark-tremor-content">
					Currently Active Users
				</p>
				<div className="relative flex h-3 w-3">
					<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
					<span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
				</div>
			</div>
			<p className="text-3xl text-dark-tremor-content font-semibold">
				{activeUsers}
			</p>
		</Card>
	);
};
