import { useState, useEffect } from "react";
import { Zap, Loader2 } from "lucide-react";
import { INITIAL_POSTS, MOCK_USER } from "../constants";
import { motion, AnimatePresence } from "motion/react";

export default function InsightsPanel() {
  const [insights, setInsights] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchInsights() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/gemini/feed-insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ posts: INITIAL_POSTS }),
        });
        const data = await res.json();
        if (data.insights) setInsights(data.insights);
      } catch (err) {
        console.error("Insights fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchInsights();
  }, []);

  return (
    <div className="hidden xl:block w-[320px] fixed right-0 top-0 bottom-0 p-4 pt-12 overflow-y-auto bg-white dark:bg-black space-y-6">
      {/* Current User */}
      <div className="flex items-center justify-between px-2 mb-6 mt-4">
        <div className="flex items-center gap-3">
          <img src={MOCK_USER.avatar} alt="" className="w-11 h-11 rounded-full object-cover border border-gray-100 dark:border-[#262626]" />
          <div>
            <p className="text-sm font-bold">{MOCK_USER.username}</p>
            <p className="text-sm text-gray-500 font-normal">{MOCK_USER.name}</p>
          </div>
        </div>
        <button className="text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors">Switch</button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-bold text-gray-500">Suggested for you</h3>
          <button className="text-xs font-bold text-gray-900 dark:text-white hover:opacity-70 transition-opacity">See All</button>
        </div>
        
        <div className="space-y-4 px-2">
          {[
            { name: "Priyanka Chopra", handle: "priyankachopra", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150", sub: "Followed by virat.kohli + 12 more" },
            { name: "Shraddha Kapoor", handle: "shraddhakapoor", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150", sub: "Suggested for you" },
            { name: "MS Dhoni", handle: "mahi7781", avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=150&h=150", sub: "New to Instagram" },
          ].map((user) => (
            <div key={user.handle} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={user.avatar} alt="" className="w-8 h-8 rounded-full border border-gray-100 dark:border-[#262626]" />
                <div className="max-w-[160px]">
                  <p className="text-sm font-bold truncate hover:opacity-70 cursor-pointer">{user.handle}</p>
                  <p className="text-[12px] text-gray-500 font-normal truncate">{user.sub}</p>
                </div>
              </div>
              <button className="text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors">Follow</button>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights Card (Styled as a small info box) */}
      <div className="px-2 pt-4">
        <div className="p-3 rounded-lg border border-blue-100 dark:border-blue-900/20 bg-blue-50/30 dark:bg-blue-500/5">
          <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
            <Zap size={14} fill="currentColor" />
            <span className="text-[10px] font-bold uppercase tracking-wider">AI Vibe Check</span>
          </div>
          <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-tight">
            "{insights || "The community is currently quiet. Start a conversation to shift the aura."}"
          </p>
        </div>
      </div>

      {/* Footer Links */}
      <div className="px-2 pt-8 space-y-4">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {['About', 'Help', 'Press', 'API', 'Jobs', 'Privacy', 'Terms', 'Locations', 'Language', 'Meta Verified'].map(link => (
            <a key={link} href="#" className="text-[12px] font-normal text-gray-300 dark:text-white/20 hover:underline">{link}</a>
          ))}
        </div>
        <p className="text-[12px] font-normal text-gray-300 dark:text-white/20 uppercase tracking-tight">© 2026 INSTAGRAM FROM AI STUDIO</p>
      </div>
    </div>
  );
}
