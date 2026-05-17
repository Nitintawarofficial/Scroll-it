import { useState } from "react";
import { Image as ImageIcon, Send, Sparkles, Loader2 } from "lucide-react";
import { MOCK_USER } from "../constants";
import { motion, AnimatePresence } from "motion/react";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);

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
    <div className="classic-card p-4 mb-8">
      <div className="flex gap-4">
        <img src={MOCK_USER.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-white/10" />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full bg-transparent border-none outline-none resize-none text-gray-900 dark:text-white placeholder:text-gray-400 min-h-[80px] text-sm md:text-base"
          />
          <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-white/5">
            <div className="flex items-center gap-1">
              <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-gray-50 dark:hover:bg-white/5 rounded-full transition-all">
                <ImageIcon size={20} />
              </button>
              <button 
                onClick={handleEnhance}
                disabled={!content || isEnhancing}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all disabled:opacity-30 group"
              >
                {isEnhancing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} className="group-hover:scale-110 transition-transform" />}
                AI Assist
              </button>
            </div>
            <button 
              className="px-6 py-1.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              disabled={!content.trim()}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
