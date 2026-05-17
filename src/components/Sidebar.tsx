import { Home, Search, Compass, Tv, MessageCircle, Heart, PlusSquare, User, Menu } from "lucide-react";
import { motion } from "motion/react";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { icon: Home, label: "Home", id: "feed" },
  { icon: Search, label: "Search", id: "search" },
  { icon: Compass, label: "Explore", id: "explore" },
  { icon: Tv, label: "Reels", id: "reels" },
  { icon: MessageCircle, label: "Messages", id: "messages" },
  { icon: Heart, label: "Notifications", id: "notifications" },
  { icon: PlusSquare, label: "Create", id: "create" },
  { icon: User, label: "Profile", id: "profile" },
];

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[244px] p-3 hidden lg:flex flex-col justify-between border-r border-[#dbdbdb] dark:border-[#262626] bg-white dark:bg-black z-50">
      <div>
        <div className="pt-8 pb-10 px-3">
          <h1 className="text-xl font-bold font-display italic tracking-tight">Instagram</h1>
        </div>

        <div className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className="w-full flex items-center gap-4 px-3 py-3 rounded-lg transition-all hover:bg-gray-50 dark:hover:bg-white/5 active:opacity-50 group"
            >
              <item.icon 
                size={24} 
                strokeWidth={activeView === item.id ? 2.5 : 2} 
                className={`transition-transform group-hover:scale-105 ${activeView === item.id ? 'scale-110' : ''}`}
              />
              <span className={`text-[15px] ${activeView === item.id ? "font-bold" : "font-normal"}`}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <button className="w-full flex items-center gap-4 px-3 py-3 rounded-lg transition-all hover:bg-gray-50 dark:hover:bg-white/5 active:opacity-50 group mb-2">
        <Menu size={24} />
        <span className="text-[15px] font-normal">More</span>
      </button>
    </aside>
  );
}
