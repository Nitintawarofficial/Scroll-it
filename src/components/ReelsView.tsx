import React from "react";
import { Heart, MessageSquare, Share2, Music, MoreVertical, Music2 } from "lucide-react";
import { motion } from "motion/react";
import { INITIAL_POSTS } from "../constants";

export default function ReelsView() {
  const reels = INITIAL_POSTS.map((p, i) => ({
    ...p,
    videoUrl: `https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&q=80`, // Placeholder for vertical media
    music: "Original Audio - Night City Vibin'",
  }));

  return (
    <div className="flex flex-col items-center gap-8 py-4 snap-y snap-mandatory h-[80vh] overflow-y-auto no-scrollbar">
      {reels.map((reel) => (
        <div key={reel.id} className="relative w-full max-w-[400px] h-[700px] bg-black rounded-lg overflow-hidden flex-shrink-0 snap-center shadow-2xl">
          <img src={reel.image} className="w-full h-full object-cover opacity-80" alt="reel" />
          
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 p-4 flex flex-col justify-end">
            <div className="flex items-end justify-between">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <img src={reel.author.avatar} className="w-8 h-8 rounded-full border border-white" alt="" />
                  <span className="font-bold text-white text-sm">{reel.author.username}</span>
                  <button className="px-3 py-1 border border-white text-white rounded-lg text-xs font-bold">Follow</button>
                </div>
                <p className="text-white text-sm line-clamp-2">{reel.content}</p>
                <div className="flex items-center gap-2 text-white text-xs">
                  <Music size={12} />
                  <span>{reel.music}</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-6 mb-2">
                <div className="text-center">
                  <button className="text-white hover:text-red-500 transition-colors"><Heart size={28} /></button>
                  <p className="text-white text-[10px] font-bold mt-1">12.4k</p>
                </div>
                <div className="text-center">
                  <button className="text-white hover:text-gray-300 transition-colors"><MessageSquare size={28} /></button>
                  <p className="text-white text-[10px] font-bold mt-1">542</p>
                </div>
                <button className="text-white hover:text-gray-300 transition-colors"><Share2 size={28} /></button>
                <button className="text-white"><MoreVertical size={24} /></button>
                <div className="w-8 h-8 bg-gray-800 rounded-lg border-2 border-white overflow-hidden">
                  <img src={reel.image} className="w-full h-full object-cover" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
