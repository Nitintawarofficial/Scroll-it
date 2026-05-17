import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Volume2, VolumeX, MoreHorizontal, Heart, RotateCcw, Music } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Story, User } from "../types";

interface StoryModalProps {
  stories: Story[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onUserClick?: (user: User) => void;
}

export default function StoryModal({ stories, initialIndex, isOpen, onClose, onUserClick }: StoryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setProgress(0);
    }
  }, [isOpen, initialIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 1;
      });
    }, 50); // 5 seconds total (100 * 50ms)

    return () => clearInterval(timer);
  }, [isOpen, currentIndex]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  const handleReplay = () => {
    setProgress(0);
  };

  if (!isOpen) return null;

  const currentStory = stories[currentIndex];

  const handleProfileClick = () => {
    onUserClick?.(currentStory.user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center">
      <button onClick={onClose} className="absolute top-4 right-4 text-white z-50 p-2">
        <X size={32} />
      </button>

      <div className="relative w-full max-w-[450px] h-[90vh] bg-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl mx-4">
        {/* Progress Bars */}
        <div className="absolute top-4 left-4 right-4 flex gap-1.5 z-50">
          {stories.map((_, i) => (
            <div key={i} className="flex-1 h-0.5 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{ 
                  width: i === currentIndex ? `${progress}%` : i < currentIndex ? '100%' : '0%' 
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-50 text-white">
          <div className="flex flex-col gap-1">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleProfileClick}
            >
              <img src={currentStory.user.avatar} className="w-8 h-8 rounded-full border border-white" alt="" />
              <span className="font-bold text-sm tracking-tight">{currentStory.user.username}</span>
              <span className="text-white/60 text-xs">4h</span>
            </div>
            
            {currentStory.songName && (
              <div className="flex items-center gap-2 overflow-hidden max-w-[200px]">
                <Music size={12} className="flex-shrink-0 animate-pulse" />
                <div className="flex gap-2 whitespace-nowrap overflow-hidden">
                  <span className="text-xs font-medium truncate">{currentStory.songName} — {currentStory.artistName}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={handleReplay} className="hover:scale-110 transition-transform active:opacity-70">
              <RotateCcw size={20} />
            </button>
            <button onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <MoreHorizontal size={20} />
          </div>
        </div>

        {/* Navigation Buttons */}
        <button 
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white z-50 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white z-50 transition-colors"
        >
          <ChevronRight size={24} />
        </button>

        {/* Content */}
        <img src={currentStory.image} className="w-full h-full object-cover" alt="story" />

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-4">
           <input 
             type="text" 
             placeholder={`Reply to ${currentStory.user.username}...`}
             className="flex-1 bg-transparent border border-white/30 rounded-full px-4 py-2 text-sm text-white outline-none focus:border-white transition-all placeholder:text-white/60"
           />
           <Heart size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
}
