import { Post, User, Conversation, Message, AuraNotification, Story } from "./types";

export const MOCK_USER: User = {
  id: "u1",
  name: "Nitin Tawar",
  username: "nitin_tawar",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200",
  bio: "Entrepreneur & Developer. Building the future of social apps. 🇮🇳",
  followers: 450,
  following: 320,
};

export const MOCK_STORIES: Story[] = [
  { id: "s1", user: MOCK_USER, image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&h=600", isSeen: false },
  { 
    id: "s2", 
    user: { id: "u2", name: "Virat Kohli", username: "virat.kohli", avatar: "https://images.unsplash.com/photo-1628157588553-9ee700a10366?auto=format&fit=crop&w=200&h=200", followers: 260000000, following: 280 }, 
    image: "https://images.unsplash.com/photo-1540747913346-19e3adca174f?auto=format&fit=crop&w=400&h=600", 
    isSeen: false 
  },
  { 
    id: "s3", 
    user: { id: "u3", name: "Alia Bhatt", username: "aliaabhatt", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200", followers: 80000000, following: 500 }, 
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&h=600", 
    isSeen: false 
  },
  { id: "s4", user: { id: "u4", name: "MS Dhoni", username: "mahi7781", avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=200&h=200", followers: 45000000, following: 4 }, image: "https://images.unsplash.com/photo-1533713619386-d470659cb510?auto=format&fit=crop&w=400&h=600", isSeen: true }
];

export const MOCK_NOTIFICATIONS: AuraNotification[] = [
  {
    id: "n1",
    type: "like",
    user: { id: "u2", name: "Virat Kohli", username: "virat.kohli", avatar: "https://images.unsplash.com/photo-1628157588553-9ee700a10366?auto=format&fit=crop&w=200&h=200", followers: 0, following: 0 },
    timestamp: "2m ago",
    isRead: false
  },
  {
    id: "n2",
    type: "follow",
    user: { id: "u3", name: "Alia Bhatt", username: "aliaabhatt", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200", followers: 0, following: 0 },
    timestamp: "1h ago",
    isRead: true
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: "p1",
    author: {
      id: "u2",
      name: "Virat Kohli",
      username: "virat.kohli",
      avatar: "https://images.unsplash.com/photo-1628157588553-9ee700a10366?auto=format&fit=crop&w=200&h=200",
      followers: 260000000,
      following: 280,
    },
    content: "Nothing beats the focus on the field. Grateful for the continuous love and support! 🇮🇳🏏",
    image: "https://images.unsplash.com/photo-1540747913346-19e3adca174f?auto=format&fit=crop&w=1200&q=80",
    likes: 2450123,
    comments: 45200,
    timestamp: "2h ago",
    isLiked: false,
  },
  {
    id: "p2",
    author: {
      id: "u10",
      name: "Narendra Modi",
      username: "narendramodi",
      avatar: "https://images.unsplash.com/photo-1610444552487-7589d97034bf?auto=format&fit=crop&w=200&h=200",
      followers: 90000000,
      following: 0,
    },
    content: "Witnessing the transformative power of Digital India. We continue to strive for a developed and self-reliant nation. #AmritKaal #ModiInKashmir",
    image: "https://images.unsplash.com/photo-1508213780696-91104ef98a2d?auto=format&fit=crop&w=1200&q=80",
    likes: 1890456,
    comments: 12000,
    timestamp: "4h ago",
    isLiked: false,
  },
  {
    id: "p3",
    author: {
      id: "u3",
      name: "Alia Bhatt",
      username: "aliaabhatt",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200",
      followers: 82000000,
      following: 500,
    },
    content: "Just another day in paradise with my favourite people. ✨💖 #HomeBound",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
    likes: 1204000,
    comments: 8900,
    timestamp: "8h ago",
    isLiked: false,
  },
  {
    id: "p4",
    author: {
      id: "u11",
      name: "CarryMinati",
      username: "carryminati",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=200&h=200",
      followers: 20000000,
      following: 400,
    },
    content: "Naya video aagaya hai! Jaake dekho warna main kuch nahi bolunga. Link in bio! 😂🔥",
    image: "https://images.unsplash.com/photo-1533713619386-d470659cb510?auto=format&fit=crop&w=1200&q=80",
    likes: 560000,
    comments: 15400,
    timestamp: "12h ago",
    isLiked: true,
  },
  {
    id: "p5",
    author: {
      id: "u12",
      name: "Shraddha Kapoor",
      username: "shraddhakapoor",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&h=200",
      followers: 85000000,
      following: 600,
    },
    content: "Chai and rains. The perfect combination for a Sunday morning. ☕️🌧️",
    image: "https://images.unsplash.com/photo-1515412641149-7e6bd93531fb?auto=format&fit=crop&w=1200&q=80",
    likes: 1450000,
    comments: 21000,
    timestamp: "1h ago",
    isLiked: false,
  },
  {
    id: "p6",
    author: {
      id: "u13",
      name: "Deepika Padukone",
      username: "deepikapadukone",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200",
      followers: 78000000,
      following: 150,
    },
    content: "Embracing the journey, one step at a time. #SelfLove #Gratitude",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
    likes: 2100456,
    comments: 11000,
    timestamp: "15h ago",
    isLiked: false,
  },
  {
    id: "p7",
    author: {
      id: "u14",
      name: "Akshay Kumar",
      username: "akshaykumar",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&h=200",
      followers: 65000000,
      following: 5,
    },
    content: "Disciplined life, happy life. Surround yourself with positivity and keep hustling! 💪🇮🇳",
    image: "https://images.unsplash.com/photo-1444491741275-3747c53c99b4?auto=format&fit=crop&w=1200&q=80",
    likes: 890000,
    comments: 12000,
    timestamp: "1d ago",
    isLiked: false,
  },
  {
    id: "p8",
    author: {
      id: "u15",
      name: "Priyanka Chopra Jonas",
      username: "priyankachopra",
      avatar: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=200&h=200",
      followers: 90000000,
      following: 700,
    },
    content: "Representing India on the global stage. 🌍🇮🇳 #GlobalCitizen",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
    likes: 1500456,
    comments: 5000,
    timestamp: "2d ago",
    isLiked: false,
  }
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    participant: {
      id: "u2",
      name: "Virat Kohli",
      username: "virat.kohli",
      avatar: "https://images.unsplash.com/photo-1628157588553-9ee700a10366?auto=format&fit=crop&w=200&h=200",
      followers: 260000000,
      following: 280,
    },
    lastMessage: "Amazing work on the new project!",
    lastTimestamp: "10m ago",
    unreadCount: 2,
  },
  {
    id: "c2",
    participant: {
      id: "u3",
      name: "Alia Bhatt",
      username: "aliaabhatt",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200",
      followers: 82000000,
      following: 500,
    },
    lastMessage: "Let's catch up soon! ✨",
    lastTimestamp: "2h ago",
    unreadCount: 0,
  }
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  "c1": [
    { id: "m1", senderId: "u2", text: "Hey Nitin! Just saw your latest post.", timestamp: "12:30 PM" },
    { id: "m2", senderId: "u1", text: "Thanks Virat! I've been working on it all night.", timestamp: "12:32 PM" },
    { id: "m3", senderId: "u2", text: "Amazing work on the new project!", timestamp: "12:35 PM" },
  ],
  "c2": [
    { id: "m4", senderId: "u3", text: "Check your email for the files.", timestamp: "10:00 AM" },
    { id: "m5", senderId: "u3", text: "Let's catch up soon! ✨", timestamp: "10:05 AM" },
  ]
};
