interface BlogDetail {
    title: string;
    description: string;
    datePublished: string;
    blogUrl: string;
}

export interface BlogDetailObj {
    id: number;
    attributes: BlogDetail;
}

export interface BlogDetailAPIResponse {
    data: BlogDetailObj[];
    meta?: any;
}