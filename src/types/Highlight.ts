interface Highlight {
    title: string;
    description: string;
    date: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

interface HighlightObj {
  id: number;
  attributes: Highlight;
}

// Define the main interface that includes the 'attributes' object
export interface HighlightApiResponse {
  data: HighlightObj[];
  meta?: any;
}
