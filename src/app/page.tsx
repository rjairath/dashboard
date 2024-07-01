import HighlightCard from "@/components/HighlightCard";
import { highlightList } from '@/constants';

export default function Home() {
  return (
      <div
          id="container"
          className="w-full bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-200"
      >
          <div id="homeSection" className="max-w-6xl mx-auto p-8">
              <div className="flex flex-col mb-10">
                  <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-2">
                      Rishabh Jairath
                  </h1>
                  <div className="md:w-3/4 text-zinc-600 dark:text-zinc-500">
                      <p>
                          Experienced software engineer crafting seamless web
                          experiences. Currently working with frontend team at
                          Glance Gaming, bringing joyful gaming experiences to
                          200Mn+ users
                      </p>
                  </div>
              </div>
              <div className="flex flex-col mb-10">
                <h3 className="font-bold text-2xl md:text-4xl tracking-tight mb-4 text-black dark:text-white">
                    Highlights
                </h3>
                <div id="hlList" className="flex flex-col gap-4">
                  {
                    highlightList?.map((item) => (
                      <HighlightCard 
                        date={item.date}
                        title={item.title}
                        description={item.description}
                      />
                    ))
                  }
                </div>
              </div>
          </div>
      </div>
  );
}
