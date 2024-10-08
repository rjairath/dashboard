import { getWorkDetails } from "@/lib/api";
import { WorkDetailsAPIResponse } from "@/types/WorkDetails";
import SkillTag from "./SkillTag";


const WorkDetailList = async () => {
    try {
        const workDetailsResponse: WorkDetailsAPIResponse = await getWorkDetails();
        const workDetails = workDetailsResponse.data;

        return (
			<div id="workDetailList" className="flex flex-col gap-2">
				{workDetails?.map((item, index) => (
					<div key={item.id}>
						<h4 className="font-medium text-xl tracking-tighter">
							{item.attributes.companyName}
						</h4>
						<p className="text-zinc-600 dark:text-zinc-500 text-sm">
							{item.attributes.designation}
						</p>
						<ul className="custom-list text-base text-zinc-600 dark:text-zinc-500">
							{
                                item.attributes.description?.map((descItem, index) => (
                                    <li key={index}>{descItem}</li>
                                ))
                            }
						</ul>
						<SkillTag
							skillArray={item.attributes.skills.data?.map((item) => item.attributes.name)}
						/>

						<hr className="my-6 border-neutral-100 dark:border-neutral-800" />
					</div>
				))}
			</div>
		);
    } catch (error: any) {
        return (
            <div id="workDetailsError" className="flex flex-col gap-4">
                <h1>Error fetching Work Section...</h1>
            </div>
        );
    }
}

export default WorkDetailList