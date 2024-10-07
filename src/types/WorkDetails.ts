interface SkillAttributes {
    name: string;
}
  
interface SkillData {
    id: number;
    attributes: SkillAttributes;
}

interface SkillsObj {
    data: SkillData[];
}

interface WorkDetail {
    companyName: string;
    designation: string;
    description: string[];
    startingDate: string;
    skills: SkillsObj;
}

interface WorkDetailObj {
  id: number;
  attributes: WorkDetail;
}

export interface WorkDetailsAPIResponse {
    data: WorkDetailObj[];
    meta?: any;
}