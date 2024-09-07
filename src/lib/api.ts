import { HighlightApiResponse } from "@/types/Highlight";

export const getHighlights = async () => {
    const response = await fetch("http://localhost:1337/api/highlights/?sort=createdAt:desc");

    if(!response.ok) {
        throw new Error('Error in Highlight API');
    }

    const result: HighlightApiResponse = await response.json();
    return result;
}