import React, { useState, useEffect } from "react";
import { Search, X, Loader2, UserPlus, Users, Heart } from "lucide-react";
import { INITIAL_POSTS } from "../constants";
import { motion, AnimatePresence } from "motion/react";
import { User } from "../types";

interface SearchViewProps {
  onUserClick?: (user: User) => void;
}

export default function SearchView({ onUserClick }: SearchViewProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"top" | "accounts" | "posts">("top");
  const [results, setResults] = useState<{
    users: User[];
    posts: any[];
    hashtags: string[];
  }>({
    users: [],
    posts: [],
    hashtags: []
  });

  useEffect(() => {
    if (query.trim().length > 1) {
      const timer = setTimeout(() => {
        handleSearch(query);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setResults({ users: [], posts: [], hashtags: [] });
      setIsLoading(false);
    }
  }, [query]);

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/gemini/search-global", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchTerm }),
      });
      const data = await res.json();
      setResults({
        users: data.users || [],
        posts: data.posts || [],
        hashtags: data.hashtags || []
      });
    } catch (err) {
      console.error("Global search failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(query);
    }
  };

  return (
    <div className="w-full max-w-[600px] mx-auto py-8 px-4">
      <div className="relative mb-8">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {isLoading ? <Loader2 size={18} className="animate-spin text-blue-500" /> : <Search size={18} />}
        </div>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for accounts, posts, or trends..."
          className="w-full bg-gray-100 dark:bg-[#262626] border-none rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-1 focus:ring-blue-500/50 outline-none transition-all"
        />
        {query && (
          <button 
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {query && (
        <div className="flex border-b border-gray-100 dark:border-white/10 mb-6">
          {(["top", "accounts", "posts"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-bold capitalize border-b-2 transition-colors ${
                activeTab === tab 
                  ? "border-black dark:border-white text-black dark:text-white" 
                  : "border-transparent text-gray-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {!query ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">Recommended</h3>
            <button className="text-blue-500 text-xs font-bold">See All</button>
          </div>
          <div className="space-y-4">
             {INITIAL_POSTS.slice(0, 5).map((post) => (
                <div 
                  key={post.id} 
                  className="flex items-center justify-between group cursor-pointer"
                  onClick={() => onUserClick?.(post.author)}
                >
                  <div className="flex items-center gap-3">
                    <img src={post.author.avatar} className="w-12 h-12 rounded-full object-cover" alt="" />
                    <div>
                      <h4 className="text-sm font-bold">{post.author.username}</h4>
                      <p className="text-xs text-gray-500">{post.author.name}</p>
                    </div>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">
                    Follow
                  </button>
                </div>
             ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <AnimatePresence mode="popLayout">
            {activeTab === "top" && results.hashtags.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-2"
              >
                {results.hashtags.map((tag) => (
                  <span key={tag} className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer hover:bg-blue-100 transition-colors">
                    #{tag}
                  </span>
                ))}
              </motion.div>
            )}

            {(activeTab === "accounts" || activeTab === "top") && results.users.length > 0 && (
              <div className="space-y-4">
                {activeTab === "top" && <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Top Accounts</h4>}
                {results.users.map((user, idx) => (
                  <motion.div 
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-[#121212] rounded-xl cursor-pointer transition-colors"
                    onClick={() => onUserClick?.(user)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={user.avatar} className="w-14 h-14 rounded-full object-cover border border-gray-100 dark:border-white/10" alt="" />
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border-2 border-white dark:border-black">
                          <Users size={10} />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold flex items-center gap-1">
                          {user.username}
                          <span className="text-[10px] bg-blue-100 text-blue-600 px-1 rounded uppercase font-black">Official</span>
                        </h4>
                        <p className="text-xs text-gray-500">{user.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{user.followers.toLocaleString()} followers</p>
                      </div>
                    </div>
                    <button className="text-blue-500 text-xs font-bold px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors">
                      View
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {(activeTab === "posts" || activeTab === "top") && results.posts.length > 0 && (
              <div className="space-y-4">
                {activeTab === "top" && <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Related Posts</h4>}
                <div className="grid grid-cols-3 gap-1">
                  {results.posts.map((post, idx) => (
                    <motion.div 
                      key={post.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="aspect-square bg-gray-100 dark:bg-[#121212] relative group cursor-pointer overflow-hidden rounded-md"
                    >
                      <img src={post.image || `https://images.unsplash.com/photo-${post.id}?w=300&h=300&fit=crop`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-2">
                        <Heart size={14} fill="currentColor" /> {post.likes?.toLocaleString() || "1.2k"}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {results.users.length === 0 && results.posts.length === 0 && !isLoading && query && (
              <div className="text-center py-20">
                <p className="text-sm text-gray-500">No results found for "{query}". Try searching for Indian celebrities or content.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
