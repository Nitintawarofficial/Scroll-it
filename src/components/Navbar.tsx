import { useState } from "react";
import { Search, Bell, Mail, Compass } from "lucide-react";
import { User } from "../types";
import { MOCK_NOTIFICATIONS } from "../constants";
import NotificationsDropdown from "./NotificationsDropdown";
import { AnimatePresence } from "motion/react";

export default function Navbar({ user }: { user: User }) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.isRead).length;

  return (
    <nav className="classic-nav sticky top-0 z-50 px-4 md:px-8 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4 md:gap-8">
        <h1 className="text-xl md:text-2xl font-bold font-display tracking-tight cursor-pointer">
          Classic
        </h1>
        <div className="hidden md:flex items-center bg-gray-100 dark:bg-white/5 border border-transparent dark:border-white/10 rounded-lg px-4 py-1.5 gap-2 w-80">
          <Search size={16} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400 dark:placeholder:text-white/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-6 text-gray-400 dark:text-white/60">
          <button className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"><Compass size={22} /></button>
          <div className="relative">
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className={`hover:text-black dark:hover:text-white transition-colors cursor-pointer relative ${isNotifOpen ? 'text-black dark:text-white' : ''}`}
            >
              <Bell size={22} />
              {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-black"></span>}
            </button>
            <AnimatePresence>
              {isNotifOpen && (
                <NotificationsDropdown 
                  notifications={MOCK_NOTIFICATIONS} 
                  onClose={() => setIsNotifOpen(false)} 
                />
              )}
            </AnimatePresence>
          </div>
          <button className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"><Mail size={22} /></button>
        </div>
        <div className="flex items-center gap-3 pl-6 border-l border-gray-100 dark:border-white/10">
          <img 
            src={user.avatar} 
            alt="User" 
            className="w-9 h-9 rounded-full object-cover border border-gray-100 dark:border-white/10 shadow-sm"
          />
        </div>
      </div>
    </nav>
  );
}
