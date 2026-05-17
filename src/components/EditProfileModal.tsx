import React, { useState } from "react";
import { X, Save, User as UserIcon, AtSign, AlignLeft, Camera } from "lucide-react";
import { User } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

export default function EditProfileModal({ user, onClose, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    bio: user.bio || "",
    avatar: user.avatar
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...user,
      ...formData
    });
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-[#262626] w-full max-w-md rounded-xl overflow-hidden relative shadow-2xl"
      >
        <div className="flex items-center justify-between p-4 border-b border-[#dbdbdb] dark:border-[#333]">
           <button onClick={onClose}><X size={24} /></button>
           <h2 className="text-base font-bold">Edit profile</h2>
           <button 
             onClick={handleSubmit}
             className="text-blue-500 font-bold text-sm"
           >
             Done
           </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer w-20 h-20">
              <img 
                src={formData.avatar} 
                className="w-full h-full rounded-full object-cover transition-opacity group-hover:opacity-50" 
                alt="Avatar"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={20} className="text-white" />
              </div>
            </div>
            <button className="text-blue-500 text-sm font-bold">Change profile photo</button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold">Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-gray-50 dark:bg-[#121212] border border-[#dbdbdb] dark:border-[#333] rounded-lg p-3 text-sm focus:border-gray-400 outline-none transition-all"
              />
              <p className="text-[10px] text-gray-500">Help people discover your account by using the name you're known by: either your full name, nickname, or business name.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold">Username</label>
              <input 
                type="text" 
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full bg-gray-50 dark:bg-[#121212] border border-[#dbdbdb] dark:border-[#333] rounded-lg p-3 text-sm focus:border-gray-400 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold">Bio</label>
              <textarea 
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full bg-gray-50 dark:bg-[#121212] border border-[#dbdbdb] dark:border-[#333] rounded-lg p-3 text-sm focus:border-gray-400 outline-none transition-all resize-none h-24"
                maxLength={150}
              />
              <p className="text-xs text-gray-500 text-right">{formData.bio.length}/150</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
