import { HighlightApiResponse } from "@/types/Highlight";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_IP;
export const getHighlights = async () => {
    const response = await fetch(`${baseUrl}/api/highlights/?sort=createdAt:desc`);

    if(!response.ok) {
        throw new Error('Error in Highlight API');
    }

    const result: HighlightApiResponse = await response.json();
    return result;
}