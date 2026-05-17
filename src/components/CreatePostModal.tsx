import React, { useState } from "react";
import { X, Image as ImageIcon, MapPin, Smile, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { User } from "../types";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export default function CreatePostModal({ isOpen, onClose, user }: CreatePostModalProps) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePost = () => {
    // Logic to save post would go here
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-[800px] bg-white dark:bg-[#262626] rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[500px]"
      >
        {/* Left Side: Image Upload/Preview */}
        <div className="flex-1 bg-gray-50 dark:bg-black flex items-center justify-center relative border-r border-[#dbdbdb] dark:border-[#333]">
          {!image ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gray-100 dark:bg-[#121212] rounded-full flex items-center justify-center">
                <ImageIcon size={40} className="text-gray-400" />
              </div>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-bold active:opacity-70"
                onClick={() => setImage(`https://picsum.photos/800/800?random=${Math.random()}`)}
              >
                Select from computer
              </button>
            </div>
          ) : (
            <img src={image} className="w-full h-full object-cover" alt="Preview" />
          )}
        </div>

        {/* Right Side: Details */}
        <div className="w-full md:w-[340px] flex flex-col bg-white dark:bg-[#262626]">
          <div className="p-4 border-b border-[#dbdbdb] dark:border-[#333] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={user.avatar} className="w-7 h-7 rounded-full" alt="" />
              <span className="text-sm font-bold">{user.username}</span>
            </div>
            <button onClick={onClose} className="text-gray-500"><X size={20} /></button>
          </div>

          <div className="flex-1 p-4">
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write a caption..."
              className="w-full h-full bg-transparent border-none outline-none text-sm resize-none"
            />
          </div>

          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between text-gray-400">
               <Smile size={20} />
               <span className="text-xs">{content.length}/2200</span>
            </div>
            
            <div className="border-t border-[#dbdbdb] dark:border-[#333] pt-3">
              <button className="flex items-center justify-between w-full text-sm">
                <span>Add location</span>
                <MapPin size={18} />
              </button>
            </div>

            <button 
              disabled={!content.trim() && !image}
              onClick={handlePost}
              className="w-full py-2 bg-blue-500 text-white rounded-lg font-bold text-sm disabled:opacity-50"
            >
              Share
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
