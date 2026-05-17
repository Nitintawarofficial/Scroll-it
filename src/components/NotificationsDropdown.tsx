import { AuraNotification } from "../types";
import { Heart, MessageSquare, UserPlus, AtSign, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NotificationsDropdownProps {
  notifications: AuraNotification[];
  onClose: () => void;
}

const getIcon = (type: AuraNotification['type']) => {
  switch (type) {
    case 'like': return <Heart size={14} className="text-pink-500" fill="currentColor" />;
    case 'comment': return <MessageSquare size={14} className="text-blue-400" fill="currentColor" />;
    case 'follow': return <UserPlus size={14} className="text-purple-400" />;
    case 'mention': return <AtSign size={14} className="text-green-400" />;
  }
};

const getMessage = (type: AuraNotification['type']) => {
  switch (type) {
    case 'like': return "resonated with your atom";
    case 'comment': return "reflected on your atom";
    case 'follow': return "is now following your aura";
    case 'mention': return "mentioned you in a ripple";
  }
};

export default function NotificationsDropdown({ notifications, onClose }: NotificationsDropdownProps) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 shadow-2xl z-50 overflow-hidden rounded-xl"
      >
        <div className="p-4 border-b border-gray-50 dark:border-white/5 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Notifications</h3>
          <button className="text-[10px] text-blue-500 font-bold hover:text-blue-600 transition-colors uppercase">Clear</button>
        </div>
        
        <div className="max-h-[400px] overflow-y-auto no-scrollbar">
          {notifications.length === 0 ? (
            <div className="p-12 text-center text-gray-300 dark:text-white/20">
              <p className="text-xs font-medium">No alerts yet.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-4 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer border-b border-gray-50 dark:border-white/[0.02] last:border-0 ${!notif.isRead ? 'bg-blue-500/[0.03]' : ''}`}
              >
                <div className="relative">
                  <img src={notif.user.avatar} className="w-10 h-10 rounded-full object-cover" alt="" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-black border border-gray-100 dark:border-white/10 flex items-center justify-center">
                    {getIcon(notif.type)}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs leading-relaxed text-gray-800 dark:text-gray-200">
                    <span className="font-bold text-black dark:text-white">{notif.user.name}</span>{" "}
                    <span className="opacity-80">{getMessage(notif.type)}</span>
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase font-semibold">{notif.timestamp}</p>
                </div>
                {!notif.isRead && (
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                )}
              </div>
            ))
          )}
        </div>

        <button className="w-full p-3 bg-gray-50 dark:bg-white/5 text-[10px] uppercase font-bold tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors border-t border-gray-100 dark:border-white/5">
          View All
        </button>
      </motion.div>
    </>
  );
}
