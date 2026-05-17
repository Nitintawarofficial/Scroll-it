import React, { useState, useRef, useEffect } from "react";
import { Heart, MessageCircle, Share2, MoreHorizontal, Edit, Check, X, Sparkles, Loader2, Send, Bookmark } from "lucide-react";
import { Post, Comment, User } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { MOCK_USER } from "../constants";

interface PostCardProps {
  post: Post;
  isFollowing?: boolean;
  onToggleFollow?: (userId: string) => void;
  onUserClick?: (user: User) => void;
  key?: React.Key;
}

export default function PostCard({ post, isFollowing, onToggleFollow, onUserClick }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likes, setLikes] = useState(post.likes);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(post.content);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [mockComments, setMockComments] = useState<Comment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      textareaRef.current.focus();
    }
  }, [isEditing, content]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setIsEditing(false);
      menuTriggerRef.current?.focus();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setContent(post.content);
      menuTriggerRef.current?.focus();
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    menuTriggerRef.current?.focus();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setContent(post.content);
    menuTriggerRef.current?.focus();
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      author: MOCK_USER,
      content: commentText,
      timestamp: "Just now"
    };
    setMockComments([...mockComments, newComment]);
    setCommentText("");
  };

  const handleEnhance = async () => {
    if (!content) return;
    setIsEnhancing(true);
    try {
      const res = await fetch("/api/gemini/enhance-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: content }),
      });
      const data = await res.json();
      if (res.status === 429) {
        alert(data.error);
        return;
      }
      if (data.enhancedText) setContent(data.enhancedText);
    } catch (err) {
      console.error("Enhance error:", err);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <motion.article 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="classic-card mb-8 overflow-hidden"
    >
      {/* Header */}
      <div className="p-3 md:p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={post.author.avatar} 
            alt="" 
            className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-100 dark:ring-[#262626] cursor-pointer"
            onClick={() => onUserClick?.(post.author)}
          />
          <div className="flex items-center gap-1.5">
            <h4 
              className="text-sm font-bold hover:opacity-60 cursor-pointer"
              onClick={() => onUserClick?.(post.author)}
            >
              {post.author.username}
            </h4>
            {post.author.id !== MOCK_USER.id && onToggleFollow && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                <button 
                  onClick={() => onToggleFollow(post.author.id)}
                  className={`text-sm font-bold transition-colors ${isFollowing ? 'text-gray-400' : 'text-blue-500 hover:text-blue-600'}`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </>
            )}
            <span className="w-1 h-1 rounded-full bg-gray-400"></span>
            <p className="text-xs text-gray-400 font-medium">{post.timestamp}</p>
          </div>
        </div>
        
        <div className="relative">
          <button 
            ref={menuTriggerRef}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <MoreHorizontal size={20} />
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 mt-1 w-44 bg-white dark:bg-[#262626] border border-gray-100 dark:border-white/10 rounded-xl overflow-hidden z-20 shadow-xl"
                >
                  <button 
                    onClick={() => { setIsEditing(true); setIsMenuOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2"
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2">
                    <X size={14} /> Delete
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content / Image */}
      {post.image && !isEditing && (
        <div className="aspect-square w-full bg-black">
          <img 
            src={post.image} 
            alt="View" 
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {/* Actions and Body */}
      <div className="p-3 md:p-4 pb-2">
        {!isEditing && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={toggleLike}
                  className={`transition-all active:scale-125 ${isLiked ? 'text-[#ff3040]' : 'text-gray-900 dark:text-white hover:opacity-70'}`}
                >
                  <Heart size={26} fill={isLiked ? "currentColor" : "none"} strokeWidth={isLiked ? 0 : 2} />
                </button>
                <button 
                  onClick={() => setShowComments(!showComments)}
                  className="text-gray-900 dark:text-white hover:opacity-70 transition-all"
                >
                  <MessageCircle size={26} />
                </button>
                <button className="text-gray-900 dark:text-white hover:opacity-70 transition-all -rotate-12">
                  <Share2 size={26} />
                </button>
              </div>
              <button className="text-gray-900 dark:text-white hover:opacity-70 transition-all">
                <Bookmark size={26} />
              </button>
            </div>
            
            <div className="space-y-1.5">
              <p className="text-sm font-bold">{likes.toLocaleString()} likes</p>
              <p className="text-sm leading-tight">
                <span 
                  className="font-bold mr-2 hover:opacity-60 cursor-pointer"
                  onClick={() => onUserClick?.(post.author)}
                >
                  {post.author.username}
                </span>
                <span className="text-gray-900 dark:text-gray-100">{content}</span>
              </p>
              <button 
                onClick={() => setShowComments(!showComments)}
                className="text-sm text-gray-500 font-medium hover:opacity-70"
              >
                View all {post.comments + mockComments.length} comments
              </button>
              <p className="text-[10px] text-gray-500 uppercase font-medium">Added 2 hours ago</p>
            </div>
          </div>
        )}

        {isEditing && (
          <div className="space-y-3">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-gray-50 dark:bg-[#121212] border border-[#dbdbdb] dark:border-[#262626] rounded-md p-3 text-sm outline-none focus:border-blue-500/50 transition-all resize-none min-h-[100px] overflow-hidden"
                placeholder="Write a caption..."
              />
              <button 
                onClick={handleEnhance}
                disabled={!content || isEnhancing}
                className="absolute right-3 bottom-3 p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all disabled:opacity-30 group"
              >
                {isEnhancing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} className="group-hover:scale-110 transition-transform" />}
              </button>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleCancel}
                className="flex-1 py-1.5 text-xs font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex-[2] py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Check size={14} /> Save Changes
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-gray-100 dark:border-white/5"
          >
            <div className="p-4 space-y-4">
              {mockComments.map(comment => (
                <div key={comment.id} className="flex gap-3">
                  <img src={comment.author.avatar} alt="" className="w-7 h-7 rounded-full object-cover border border-gray-100 dark:border-white/10" />
                  <div className="flex-1">
                    <p className="text-xs">
                      <span className="font-bold mr-2">{comment.author.username}</span>
                      <span className="text-gray-700 dark:text-gray-300">{comment.content}</span>
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-semibold">{comment.timestamp}</p>
                  </div>
                </div>
              ))}
              
              <form onSubmit={handleAddComment} className="flex gap-3 pt-2">
                <input 
                  type="text" 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
                />
                <button 
                  type="submit"
                  disabled={!commentText.trim()}
                  className="text-blue-500 font-bold text-sm disabled:opacity-30 transition-all hover:text-blue-600"
                >
                  Post
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
