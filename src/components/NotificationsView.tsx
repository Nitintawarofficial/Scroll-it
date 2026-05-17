import React from "react";
import { Heart, UserPlus, MessageCircle } from "lucide-react";
import { MOCK_USER } from "../constants";

import { User } from "../types";

interface NotificationsViewProps {
  onUserClick?: (user: User) => void;
  onToggleFollow?: (userId: string) => void;
  followedIds?: Set<string>;
}

const NOTIFICATIONS = [
  { id: 'n1', type: 'like', user: { id: 'u11', name: 'Kaelen Moss', username: 'kmoss', avatar: 'https://i.pravatar.cc/150?u=1' }, time: '2h', preview: 'https://picsum.photos/50/50?random=1' },
  { id: 'n2', type: 'follow', user: { id: 'u12', name: 'Iris West', username: 'irisw', avatar: 'https://i.pravatar.cc/150?u=2' }, time: '4h' },
  { id: 'n3', type: 'mention', user: { id: 'u13', name: 'Sarah J.', username: 'sarah.j', avatar: 'https://i.pravatar.cc/150?u=3' }, time: '1d', text: 'mentioned you in a comment' },
  { id: 'n4', type: 'like', user: { id: 'u14', name: 'John Doe', username: 'johnd', avatar: 'https://i.pravatar.cc/150?u=4' }, time: '2d', preview: 'https://picsum.photos/50/50?random=2' },
] as const;

export default function NotificationsView({ onUserClick, onToggleFollow, followedIds }: NotificationsViewProps) {
  return (
    <div className="w-full max-w-[600px] mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-8">Notifications</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-bold mb-4">This Month</h3>
          <div className="space-y-4">
            {NOTIFICATIONS.map(notif => (
              <div key={notif.id} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={notif.user.avatar} 
                    className="w-11 h-11 rounded-full object-cover cursor-pointer hover:opacity-80" 
                    alt="" 
                    onClick={() => onUserClick?.(notif.user as unknown as User)}
                  />
                  <div className="text-sm">
                    <span 
                      className="font-bold cursor-pointer hover:opacity-60"
                      onClick={() => onUserClick?.(notif.user as unknown as User)}
                    >
                      {notif.user.username}
                    </span>{' '}
                    {notif.type === 'like' && 'liked your post.'}
                    {notif.type === 'follow' && 'started following you.'}
                    {notif.type === 'mention' && (notif.text || 'mentioned you.')}
                    <span className="text-gray-400 ml-1">{notif.time}</span>
                  </div>
                </div>
                {(notif as any).preview && (
                  <img src={(notif as any).preview} className="w-11 h-11 object-cover rounded-sm" alt="" />
                )}
                {notif.type === 'follow' && (
                  <button 
                    onClick={() => onToggleFollow?.(notif.user.id)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                      followedIds?.has(notif.user.id) 
                        ? 'bg-gray-100 dark:bg-[#363636] text-gray-900 dark:text-white' 
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    {followedIds?.has(notif.user.id) ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
