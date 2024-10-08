import { getBlogs } from "@/lib/api";
import { BlogDetailAPIResponse } from "@/types/BlogDetails";
import BlogDisplayComponent from "./BlogDisplayComponent";


const BlogDetailList = async () => {
    try {
        const blogDetailsResponse: BlogDetailAPIResponse = await getBlogs();
        const blogDetails = blogDetailsResponse.data;

        return (
			<div id="blogList" className="flex flex-col gap-2 mt-10">
				{blogDetails?.map((item, index) => (
					<BlogDisplayComponent 
                        key={item.id}
                        item={item}
                    />
				))}
			</div>
		);
    } catch (error: any) {
        return (
            <div id="blogListError" className="flex flex-col gap-4">
                <h1>Error fetching Blogs...</h1>
            </div>
        );
    }
}

export default BlogDetailList