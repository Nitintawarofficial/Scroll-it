import { useState } from "react";
import { MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_USER } from "../constants";
import { Message, Conversation } from "../types";
import { Search, Send, Sparkles, Loader2, ArrowLeft, MoreVertical, Edit3, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function MessagesView() {
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);

  const sendMessage = () => {
    if (!newMessage || !selectedChat) return;
    
    const msg: Message = {
      id: Date.now().toString(),
      senderId: MOCK_USER.id,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), msg]
    }));
    setNewMessage("");
  };

  const handleEnhance = async () => {
    if (!newMessage) return;
    setIsEnhancing(true);
    try {
      const res = await fetch("/api/gemini/enhance-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newMessage }),
      });
      const data = await res.json();
      if (res.status === 429) {
        alert(data.error); // Simple alert for now as it's a direct user interaction
        return;
      }
      if (data.enhancedText) setNewMessage(data.enhancedText);
    } catch (err) {
      console.error("Enhance error:", err);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="flex h-[80vh] bg-white dark:bg-[#1a1a1a] shadow-sm border border-gray-100 dark:border-white/10 rounded-xl overflow-hidden">
      {/* Conversations List */}
      <div className={`w-full md:w-80 border-r border-gray-50 dark:border-white/5 flex flex-col ${selectedChat ? "hidden md:flex" : "flex"}`}>
        <div className="p-4 border-b border-gray-50 dark:border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{MOCK_USER.username}</h2>
            <Edit3 size={20} className="text-gray-900 dark:text-white cursor-pointer" />
          </div>
          <div className="flex items-center bg-gray-50 dark:bg-white/5 rounded-lg px-4 py-2 gap-2">
            <Search size={16} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {MOCK_CONVERSATIONS.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`w-full p-4 flex items-center gap-4 transition-all hover:bg-gray-50 dark:hover:bg-white/5 ${selectedChat?.id === chat.id ? "bg-gray-50 dark:bg-white/5" : ""}`}
            >
              <div className="relative">
                <img src={chat.participant.avatar} alt="" className="w-14 h-14 rounded-full object-cover border border-gray-100 dark:border-white/10" />
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-black" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-sm truncate">{chat.participant.name}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                  <span className="text-[10px] text-gray-400 font-medium ml-2">{chat.lastTimestamp}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`flex-1 flex flex-col ${!selectedChat ? "hidden md:flex items-center justify-center text-center p-8 bg-gray-50 dark:bg-black/20" : "flex"}`}>
        {!selectedChat ? (
          <div className="max-w-xs space-y-4">
            <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto">
              <MessageSquare className="text-gray-400" size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Your Messages</h3>
              <p className="text-sm text-gray-400">Send private photos and messages to a friend or group.</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
              Send Message
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-50 dark:border-white/5 flex items-center justify-between bg-white dark:bg-[#1a1a1a]">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedChat(null)} className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full">
                  <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-3">
                  <img src={selectedChat.participant.avatar} alt="" className="w-8 h-8 rounded-full border border-gray-100 dark:border-white/10" />
                  <div>
                    <p className="font-bold text-sm leading-tight">{selectedChat.participant.name}</p>
                    <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Active now</p>
                  </div>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-400 transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col no-scrollbar">
              {messages[selectedChat.id]?.map((msg) => {
                const isMe = msg.senderId === MOCK_USER.id;
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                      isMe 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-gray-100"
                    }`}>
                      <p className="leading-relaxed">{msg.text}</p>
                      <p className={`text-[10px] mt-1 font-medium ${isMe ? "text-blue-200" : "text-gray-400"}`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-[#1a1a1a]">
              <div className="flex items-center gap-4 border border-gray-100 dark:border-white/10 rounded-full px-4 py-2">
                <div className="flex-1 flex items-center">
                  <textarea 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
                    }}
                    placeholder="Message..."
                    className="w-full bg-transparent border-none outline-none text-sm resize-none h-6 no-scrollbar placeholder:text-gray-400"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleEnhance}
                    disabled={!newMessage || isEnhancing}
                    className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all disabled:opacity-30 group"
                  >
                    {isEnhancing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} className="group-hover:scale-110 transition-transform" />}
                  </button>
                  <button 
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="text-blue-500 font-bold text-sm disabled:opacity-30 transition-all hover:text-blue-600"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
