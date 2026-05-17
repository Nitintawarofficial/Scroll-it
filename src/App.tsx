import { useState } from "react";
import { Home, Search, PlusSquare, Compass, Heart, Mail, User as UserIcon, Tv, Bookmark } from "lucide-react";
import Sidebar from "./components/Sidebar";
import PostCard from "./components/PostCard";
import InsightsPanel from "./components/InsightsPanel";
import MessagesView from "./components/MessagesView";
import UserProfile from "./components/UserProfile";
import Stories from "./components/Stories";
import ExploreGrid from "./components/ExploreGrid";
import ReelsView from "./components/ReelsView";
import NotificationsView from "./components/NotificationsView";
import SearchView from "./components/SearchView";
import CreatePostModal from "./components/CreatePostModal";
import CreateStoryModal from "./components/CreateStoryModal";
import StoryModal from "./components/StoryModal";
import { MOCK_USER, INITIAL_POSTS, MOCK_STORIES } from "./constants";
import { motion, AnimatePresence } from "motion/react";
import { User } from "./types";

export default function App() {
  const [view, setView] = useState("feed");
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USER);
  const [targetProfileUser, setTargetProfileUser] = useState<User | null>(null);
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
  const [stories, setStories] = useState(MOCK_STORIES);
  const [storyState, setStoryState] = useState<{isOpen: boolean, index: number}>({isOpen: false, index: 0});

  const handleViewChange = (newView: string) => {
    if (newView === 'create') {
      setIsCreateModalOpen(true);
    } else if (newView === 'profile') {
      setTargetProfileUser(currentUser);
      setView(newView);
    } else {
      setView(newView);
    }
  };

  const handleViewProfile = (user: User) => {
    setTargetProfileUser(user);
    setView('profile');
  };

  const toggleFollow = (userId: string) => {
    setFollowedIds(prev => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const handleAddStory = (image: string, songName?: string, artistName?: string) => {
    const newStory = {
      id: `story-${Date.now()}`,
      user: currentUser,
      image: image,
      isSeen: false,
      songName,
      artistName
    };
    setStories([newStory, ...stories]);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <CreatePostModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        user={currentUser} 
      />

      <CreateStoryModal 
        isOpen={isCreateStoryOpen}
        onClose={() => setIsCreateStoryOpen(false)}
        onAddStory={handleAddStory}
      />

      <StoryModal 
        stories={stories}
        initialIndex={storyState.index}
        isOpen={storyState.isOpen}
        onClose={() => setStoryState({isOpen: false, index: 0})}
        onUserClick={handleViewProfile}
      />

      {/* Mobile Top Bar */}
      <div className="lg:hidden sticky top-0 z-50 bg-white dark:bg-black border-b border-[#dbdbdb] dark:border-[#262626] px-4 py-2 flex items-center justify-between">
        <h1 className="text-xl font-bold font-display italic tracking-tight">Instagram</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => handleViewChange('notifications')}>
             <Heart size={24} className={view === 'notifications' ? 'text-black dark:text-white' : 'text-gray-900 dark:text-white'} />
          </button>
          <button onClick={() => handleViewChange('messages')}>
             <Mail size={24} className={view === 'messages' ? 'text-black dark:text-white' : 'text-gray-900 dark:text-white'} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row relative">
        {/* Navigation Sidebar (Desktop) */}
        <Sidebar activeView={view} onViewChange={handleViewChange} />

        {/* Main Content Area */}
        <main className={`flex-1 ${view === 'messages' || view === 'profile' || view === 'explore' || view === 'reels' ? 'lg:ml-64' : 'lg:ml-64 xl:mr-[380px]'} px-0 sm:px-4 py-0 lg:py-8 pb-32 lg:pb-8`}>
          <div className={`${view === 'messages' || view === 'profile' || view === 'explore' || view === 'reels' ? 'w-full' : 'max-w-[470px] mx-auto'}`}>
            <AnimatePresence mode="wait">
              {view === "feed" && (
                <motion.div
                  key="feed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <Stories 
                    stories={stories} 
                    onStoryClick={(index) => setStoryState({isOpen: true, index})}
                    onAddStoryClick={() => setIsCreateStoryOpen(true)}
                  />
                  
                  <div className="space-y-4">
                    {INITIAL_POSTS.map((post) => (
                      <PostCard 
                        key={post.id} 
                        post={post} 
                        onUserClick={handleViewProfile}
                        onToggleFollow={toggleFollow}
                        isFollowing={followedIds.has(post.author.id)}
                      />
                    ))}
                  </div>
                  
                  <div className="text-center py-20">
                    <p className="text-gray-400 text-sm font-medium">You've seen all new posts.</p>
                  </div>
                </motion.div>
              )}

              {view === "explore" && (
                <motion.div
                  key="explore"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <ExploreGrid onUserClick={handleViewProfile} />
                </motion.div>
              )}

              {view === "reels" && (
                <motion.div
                  key="reels"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <ReelsView />
                </motion.div>
              )}

              {view === "messages" && (
                <motion.div
                  key="messages"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <MessagesView />
                </motion.div>
              )}

              {view === "notifications" && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <NotificationsView 
                    onUserClick={handleViewProfile}
                    onToggleFollow={toggleFollow}
                    followedIds={followedIds}
                  />
                </motion.div>
              )}

              {view === "search" && (
                <motion.div
                  key="search"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <SearchView onUserClick={handleViewProfile} />
                </motion.div>
              )}

              {view === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                >
                  <UserProfile 
                    user={targetProfileUser || currentUser} 
                    onUserUpdate={setCurrentUser} 
                    isCurrentUser={targetProfileUser?.id === currentUser.id}
                    isFollowing={targetProfileUser ? followedIds.has(targetProfileUser.id) : false}
                    onToggleFollow={toggleFollow}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* AI Insights Sidebar - hidden in certain views */}
        {(view === "feed" || view === "notifications" || view === "search") && <InsightsPanel />}
      </div>

      {/* Mobile Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-12 bg-white dark:bg-black border-t border-[#dbdbdb] dark:border-[#262626] flex justify-around items-center z-50 px-2 pb-safe">
         <button 
           onClick={() => handleViewChange('feed')}
           className={`p-2 transition-colors ${view === 'feed' ? 'text-black dark:text-white' : 'text-gray-400'}`}
         >
           <Home size={26} />
         </button>
         <button 
           onClick={() => handleViewChange('search')}
           className={`p-2 transition-colors ${view === 'search' ? 'text-black dark:text-white' : 'text-gray-400'}`}
         >
           <Search size={26} />
         </button>
         <button 
           onClick={() => handleViewChange('create')}
           className="p-2 text-gray-400"
         >
           <PlusSquare size={26} />
         </button>
         <button 
           onClick={() => handleViewChange('reels')}
           className={`p-2 transition-colors ${view === 'reels' ? 'text-black dark:text-white' : 'text-gray-400'}`}
         >
           <Tv size={26} />
         </button>
         <button 
           onClick={() => handleViewChange('profile')}
           className={`p-2 transition-colors ${view === 'profile' ? 'text-black dark:text-white' : 'text-gray-400'}`}
         >
           <UserIcon size={26} />
         </button>
      </div>
    </div>
  );
}
