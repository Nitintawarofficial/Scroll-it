import React from "react";
import { Grid, Heart, MessageSquare } from "lucide-react";
import { motion } from "motion/react";
import { INITIAL_POSTS } from "../constants";

import { User } from "../types";

interface ExploreGridProps {
  onUserClick?: (user: User) => void;
}

export default function ExploreGrid({ onUserClick }: ExploreGridProps) {
  // Creating more random posts for explore
  const explorePosts = [...INITIAL_POSTS, ...INITIAL_POSTS, ...INITIAL_POSTS].map((p, i) => ({
    ...p,
    id: `explore-${i}`,
    image: `https://picsum.photos/600/600?random=${i + 100}`,
  }));

  return (
    <div className="w-full max-w-[935px] mx-auto py-8">
      <div className="grid grid-cols-3 gap-1 md:gap-4">
        {explorePosts.map((post, i) => (
          <motion.div 
            key={post.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => onUserClick?.(post.author)}
            transition={{ delay: (i % 9) * 0.05 }}
            className={`aspect-square relative group cursor-pointer overflow-hidden ${
              (i % 10 === 1 || i % 10 === 6) ? "md:col-span-2 md:row-span-2" : ""
            }`}
          >
            <img 
              src={post.image} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              alt="" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-8 text-white font-bold">
              <div className="flex items-center gap-2"><Heart size={20} fill="white" /> {post.likes}</div>
              <div className="flex items-center gap-2"><MessageSquare size={20} fill="white" /> {post.comments}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
