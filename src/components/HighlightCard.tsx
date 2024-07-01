import { formatTimestampToDate } from "@/utils";

interface HighlightCardProps {
    date: number;
    title: string;
    description: string;
    href?: string;
}

const HighlightCard: React.FC<HighlightCardProps> = ({
    date,
    title,
    description,
    href
}) => {
  return (
      <div className="w-full md:w-3/4 bg-gray-100 border-gray-200 
        dark:bg-zinc-800 dark:border-zinc-700 border rounded-md p-4">
          <div className="flex justify-between mb-2">
            <p className="text-xl md:text-2xl font-bold">{title}</p>
            <span className="text-zinc-600 dark:text-zinc-500">{formatTimestampToDate(date)}</span>
          </div>
          <div>
            <p>{description}</p>
          </div>
      </div>
  );
}

export default HighlightCard;