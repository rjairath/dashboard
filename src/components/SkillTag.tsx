
const SkillTag = ({skillArray}: {skillArray: string[]}) => {
  return (
    <div className="w-full overflow-x-auto flex gap-2 mt-4">
        {
            skillArray?.map((item, index) => (
                <div key={index} className="p-2 rounded-md bg-gray-200 dark:bg-gray-800 text-sm">
                    <span>{item}</span>
                </div>
            ))
        }
    </div>
  )
}

export default SkillTag