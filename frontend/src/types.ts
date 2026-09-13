export type TalentType = 'audio' | 'video' | 'text';

export type Category = 
  | 'Singing'
  | 'Dancing'
  | 'Art'
  | 'Poetry'
  | 'Instrumental'
  | 'Comedy'
  | 'Others';

export interface CommentReply {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
  likes: number;
}

export interface Comment {
  id: string;
  talentId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  replies?: CommentReply[];
}

export interface TalentItem {
  id: string;
  title: string;
  type: TalentType;
  category: Category;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorLocation?: string;
  authorRank?: number;
  isVerified?: boolean;
  createdAt: string;
  likes: number;
  views: number;
  commentsCount: number;
  votes: number;
  description: string;
  thumbnail: string;
  contentUrl?: string;
  poemText?: string[];
  audioDuration?: string;
  isLiked?: boolean;
  isVoted?: boolean;
  isSaved?: boolean;
  tags?: string[];
  audioWaveform?: number[];
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'vote' | 'follow' | 'milestone' | 'comment';
  user: {
    name: string;
    avatar: string;
  };
  message: string;
  talentTitle?: string;
  time: string;
  isRead: boolean;
  targetTalentId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'contact';
  text: string;
  timestamp: string;
}

export interface ChatThread {
  id: string;
  contact: {
    id: string;
    name: string;
    avatar: string;
    handle?: string;
    online?: boolean;
    location?: string;
  };
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  location: string;
  bio: string;
  talentCount: number;
  score: number;
  rank: number;
  email: string;
  role?: 'creator' | 'audience';
  category?: string;
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  handle: string;
  avatar: string;
  category: string;
  score: number;
  likes: number;
  votes: number;
  talentCount: number;
  isTop3?: boolean;
}
