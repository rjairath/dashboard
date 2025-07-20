interface ShimmerProps {
	className?: string;
	height?: string;
	width?: string;
}

const Shimmer = ({
	className,
	height = '122px',
	width = 'full',
}: ShimmerProps) => {
	return (
		<div
			className={`bg-gray-100 border-gray-200 
        dark:bg-zinc-800 dark:border-zinc-700 border rounded-md p-4
        relative overflow-hidden ${className}`}
			style={{
				minHeight: height,
				width:
					width.includes('%') || width.includes('px')
						? width
						: `${width === 'full' ? '100%' : width}`,
			}}
		>
			<div
				className="absolute top-0 left-0 w-full h-full animate-shimmer
            bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-700
        "
			></div>
		</div>
	);
};

export default Shimmer;
