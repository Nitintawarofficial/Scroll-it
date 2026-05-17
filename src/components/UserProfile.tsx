import { useState } from "react";
import { INITIAL_POSTS } from "../constants";
import { Edit3, MapPin, Link as LinkIcon, Calendar, Grid, MessageSquare, Heart, Bookmark, Settings } from "lucide-react";
import PostCard from "./PostCard";
import { motion, AnimatePresence } from "motion/react";
import EditProfileModal from "./EditProfileModal";
import { User } from "../types";

interface UserProfileProps {
  user: User;
  onUserUpdate: (user: User) => void;
  isCurrentUser?: boolean;
  isFollowing?: boolean;
  onToggleFollow?: (userId: string) => void;
}

export default function UserProfile({ user, onUserUpdate, isCurrentUser, isFollowing, onToggleFollow }: UserProfileProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="w-full max-w-[935px] mx-auto py-8 px-4 md:px-0">
      <div className="flex flex-col md:flex-row gap-8 md:gap-24 mb-12 px-4 md:px-12 items-center md:items-start">
        <div className="flex-shrink-0">
          <div className="w-20 h-20 md:w-[150px] md:h-[150px] rounded-full overflow-hidden border border-gray-100 dark:border-[#262626]">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <h1 className="text-xl font-normal">{user.username}</h1>
            <div className="flex gap-2">
              {isCurrentUser ? (
                <>
                  <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="px-4 py-1.5 bg-gray-100 dark:bg-[#363636] hover:opacity-80 rounded-lg transition-all font-semibold text-sm"
                  >
                    Edit profile
                  </button>
                  <button className="px-4 py-1.5 bg-gray-100 dark:bg-[#363636] hover:opacity-80 rounded-lg transition-all font-semibold text-sm">
                    View archive
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => onToggleFollow?.(user.id)}
                    className={`px-6 py-1.5 rounded-lg transition-all font-semibold text-sm ${
                      isFollowing 
                        ? 'bg-gray-100 dark:bg-[#363636] text-gray-900 dark:text-white' 
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <button className="px-4 py-1.5 bg-gray-100 dark:bg-[#363636] hover:opacity-80 rounded-lg transition-all font-semibold text-sm">
                    Message
                  </button>
                </>
              )}
              <button className="p-1.5"><Settings size={22} /></button>
            </div>
          </div>

          <div className="hidden md:flex gap-10">
            <div className="flex gap-1 items-baseline">
              <span className="font-semibold text-base">12</span>
              <span className="text-gray-900 dark:text-gray-100">posts</span>
            </div>
            <div className="flex gap-1 items-baseline">
              <span className="font-semibold text-base">{user.followers}</span>
              <span className="text-gray-900 dark:text-gray-100">followers</span>
            </div>
            <div className="flex gap-1 items-baseline">
              <span className="font-semibold text-base">{user.following}</span>
              <span className="text-gray-900 dark:text-gray-100">following</span>
            </div>
          </div>

          <div className="space-y-0.5 text-center md:text-left">
            <p className="font-bold text-sm tracking-tight">{user.name}</p>
            <p className="text-sm dark:text-gray-300 leading-relaxed max-w-md">
              {user.bio || "No biography captured yet."}
            </p>
          </div>
        </div>
      </div>

      {/* Stats for mobile */}
      <div className="flex md:hidden justify-around py-3 border-y border-gray-100 dark:border-[#262626] mb-4">
        <div className="text-center">
          <span className="block font-bold">12</span>
          <span className="text-xs text-gray-400">posts</span>
        </div>
        <div className="text-center">
          <span className="block font-bold">{user.followers}</span>
          <span className="text-xs text-gray-400">followers</span>
        </div>
        <div className="text-center">
          <span className="block font-bold">{user.following}</span>
          <span className="text-xs text-gray-400">following</span>
        </div>
      </div>

      <div className="border-t border-gray-100 dark:border-[#262626]">
        <div className="flex justify-center gap-12">
          <button className="py-4 border-t border-black dark:border-white -mt-px flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest text-[#262626] dark:text-white">
            <Grid size={14} /> Posts
          </button>
          <button className="py-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest">
            <MessageSquare size={14} /> Reels
          </button>
          <button className="py-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest">
            <Bookmark size={14} /> Saved
          </button>
          <button className="py-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest">
            <Heart size={14} /> Tagged
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1 md:gap-1 mt-1 pb-20">
          {INITIAL_POSTS.slice(0, 6).map((post, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="aspect-square bg-gray-100 dark:bg-[#121212] relative group cursor-pointer overflow-hidden"
            >
              <img src={post.image || `https://picsum.photos/600/600?random=${i}`} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-8 text-white font-bold">
                <div className="flex items-center gap-2"><Heart size={20} fill="white" /> {post.likes}</div>
                <div className="flex items-center gap-2"><MessageSquare size={20} fill="white" /> {post.comments}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isEditModalOpen && (
          <EditProfileModal 
            user={user} 
            onClose={() => setIsEditModalOpen(false)} 
            onSave={onUserUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
