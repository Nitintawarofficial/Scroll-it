import { Story } from "../types";
import { Plus } from "lucide-react";
import { motion } from "motion/react";

interface StoriesProps {
  stories: Story[];
  onStoryClick: (index: number) => void;
  onAddStoryClick: () => void;
}

export default function Stories({ stories, onStoryClick, onAddStoryClick }: StoriesProps) {
  return (
    <div className="flex gap-4 overflow-x-auto no-scrollbar py-4 md:py-6 bg-white dark:bg-black border border-[#dbdbdb] dark:border-[#262626] rounded-lg md:rounded-sm mb-4 md:mb-6 px-4">
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onAddStoryClick}
        className="flex-shrink-0 flex flex-col items-center gap-1.5"
      >
        <div className="w-[66px] h-[66px] rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center relative bg-gray-50 dark:bg-white/5">
          <Plus size={24} className="text-gray-400 dark:text-white/20" />
          <div className="absolute bottom-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white dark:border-black">
            <Plus size={10} className="text-white" strokeWidth={5} />
          </div>
        </div>
        <span className="text-[11px] font-normal text-gray-500 dark:text-gray-400">Your Story</span>
      </motion.button>

      {stories.map((story, index) => (
        <motion.button
          key={story.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onStoryClick(index)}
          className="flex-shrink-0 flex flex-col items-center gap-1.5"
        >
          <div className={`w-[66px] h-[66px] rounded-full p-[2px] ${story.isSeen ? 'bg-gray-200 dark:bg-[#262626]' : 'bg-gradient-to-tr from-yellow-400 via-[#f2295b] to-[#c913b9]'}`}>
            <div className="w-full h-full rounded-full border-2 border-white dark:border-black overflow-hidden bg-white dark:bg-black p-0.5">
              <img 
                src={story.user.avatar} 
                alt={story.user.username} 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
          <span className="text-[11px] font-normal text-gray-700 dark:text-gray-300 truncate w-16 text-center">
            {story.user.username}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
