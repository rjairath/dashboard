
const Shimmer = () => {
  return (
    <div className="w-full md:w-3/4 bg-gray-100 border-gray-200 
        dark:bg-zinc-800 dark:border-zinc-700 border rounded-md p-4 min-h-[122px]
        relative overflow-hidden"
    >
        <div className="absolute top-0 left-0 w-full h-full animate-shimmer
            bg-gradient-to-r from-transparent via-gray-200 to-transparent
        "></div>
    </div>
  )
}

export default Shimmer;