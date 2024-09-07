import { HighlightApiResponse } from '@/types/Highlight';
import { getHighlights } from '@/lib/api';
import HighlightCard from './HighlightCard';

const HighlightList = async () => {
    try {
        const highlightResponse: HighlightApiResponse = await getHighlights();
        const highlights = highlightResponse.data;

        return (
            <div id="hlList" className="flex flex-col gap-4">
                {highlights?.map((item, index) => (
                    <HighlightCard
                        date={item.attributes?.date}
                        title={item.attributes?.title}
                        description={item.attributes?.description}
                        key={index}
                    />
                ))}
            </div>
        );
    } catch (error: any) {
        return (
            <div id="hlList" className="flex flex-col gap-4">
                <h1>Error fetching Highlights...</h1>
            </div>
        );
    }
}

export default HighlightList;