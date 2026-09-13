import React, { useEffect, useState } from 'react';
import { 
  mockTalents, 
  mockLeaderboard, 
  mockComments, 
  mockNotifications, 
  mockChatThreads, 
  currentUserProfile 
} from './data/mockData';
import { 
  TalentItem, 
  Category, 
  LeaderboardUser, 
  Comment, 
  NotificationItem, 
  ChatThread, 
  UserProfile 
} from './types';
import { Navbar } from './components/Navbar';
import { FeedView } from './components/FeedView';
import { ExploreView } from './components/ExploreView';
import { LeaderboardView } from './components/LeaderboardView';
import { InboxView } from './components/InboxView';
import { ProfileView } from './components/ProfileView';
import { TalentDetailModal } from './components/TalentDetailModal';
import { UploadTalentModal } from './components/UploadTalentModal';
import { NotificationsModal } from './components/NotificationsModal';
import { AuthModal } from './components/AuthModal';
import { EditProfileModal } from './components/EditProfileModal';
import { AuthPage } from './components/AuthPage';
import { SignUpPage } from './components/SignUpPage';
import { Toast, ToastMessage } from './components/Toast';
import { 
  Home, 
  Compass, 
  Plus, 
  MessageSquare, 
  User} from 'lucide-react';
import { useLanguage } from './context/LanguageContext';
import { api, getToken } from './api/client';

export default function App() {
  const { t } = useLanguage();
  // Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'leaderboard' | 'inbox' | 'profile' | 'auth'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  // Application Data State
  const [talents, setTalents] = useState<TalentItem[]>(mockTalents);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(mockLeaderboard);
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>(mockComments);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(mockChatThreads);
  const [currentUser, setCurrentUser] = useState<UserProfile>(currentUserProfile);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Modals State
  const [selectedTalent, setSelectedTalent] = useState<TalentItem | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'splash' | 'login' | 'register'>('login');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'info' | 'error', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (getToken()) {
        try {
          const user = await api.me();
          if (!cancelled) {
            setCurrentUser(user);
            setIsLoggedIn(true);
          }
        } catch {
          api.logout();
        }
      }

      try {
        const [serverTalents, serverBoard] = await Promise.all([
          api.getTalents(),
          api.getLeaderboard(8),
        ]);
        if (cancelled) return;
        if (serverTalents.length > 0) setTalents(serverTalents);
        if (serverBoard.length > 0) setLeaderboard(serverBoard);
      } catch {
        // Backend offline — keep mock data so the UI still renders.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Handlers for Talent Interaction
  const handleToggleLike = (talentId: string) => {
    setTalents((prev) =>
      prev.map((item) => {
        if (item.id === talentId) {
          const nextLiked = !item.isLiked;
          return {
            ...item,
            isLiked: nextLiked,
            likes: nextLiked ? item.likes + 1 : Math.max(0, item.likes - 1)
          };
        }
        return item;
      })
    );

    if (selectedTalent && selectedTalent.id === talentId) {
      setSelectedTalent((prev) =>
        prev
          ? {
              ...prev,
              isLiked: !prev.isLiked,
              likes: !prev.isLiked ? prev.likes + 1 : Math.max(0, prev.likes - 1)
            }
          : null
      );
    }
  };

  const handleToggleVote = (talentId: string) => {
    setTalents((prev) =>
      prev.map((item) => {
        if (item.id === talentId) {
          const nextVoted = !item.isVoted;
          const nextVotes = nextVoted ? item.votes + 1 : Math.max(0, item.votes - 1);
          return {
            ...item,
            isVoted: nextVoted,
            votes: nextVotes
          };
        }
        return item;
      })
    );

    if (selectedTalent && selectedTalent.id === talentId) {
      setSelectedTalent((prev) =>
        prev
          ? {
              ...prev,
              isVoted: !prev.isVoted,
              votes: !prev.isVoted ? prev.votes + 1 : Math.max(0, prev.votes - 1)
            }
          : null
      );
    }

    // Update user score
    setCurrentUser((prev) => ({
      ...prev,
      score: prev.score + 5
    }));

    addToast('success', 'Vote Recorded!', 'You boosted this talent in the weekly ranking (+5 points).');
  };

  const handleToggleSave = (talentId: string) => {
    setTalents((prev) =>
      prev.map((item) => {
        if (item.id === talentId) {
          const nextSaved = !item.isSaved;
          addToast(
            'info',
            nextSaved ? 'Saved to Collection' : 'Removed from Saved',
            nextSaved ? 'You can view this talent in your Profile → Saved tab.' : undefined
          );
          return {
            ...item,
            isSaved: nextSaved
          };
        }
        return item;
      })
    );

    if (selectedTalent && selectedTalent.id === talentId) {
      setSelectedTalent((prev) => (prev ? { ...prev, isSaved: !prev.isSaved } : null));
    }
  };

  const handleShare = (talent: TalentItem) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    addToast('success', 'Link Copied to Clipboard!', `Share "${talent.title}" with your friends.`);
  };

  const handleVoteLeaderboardUser = (userId: string) => {
    setLeaderboard((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            votes: u.votes + 1,
            score: u.score + 10
          };
        }
        return u;
      })
    );
    addToast('success', 'Creator Boosted!', 'You cast an official vote for this creator.');
  };

  // Comment Handlers
  const handleAddComment = (talentId: string, text: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      talentId,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      text,
      createdAt: 'Just now',
      likes: 0,
      isLiked: false
    };

    setCommentsMap((prev) => ({
      ...prev,
      [talentId]: [newComment, ...(prev[talentId] || [])]
    }));

    setTalents((prev) =>
      prev.map((t) =>
        t.id === talentId ? { ...t, commentsCount: t.commentsCount + 1 } : t
      )
    );

    if (selectedTalent && selectedTalent.id === talentId) {
      setSelectedTalent((prev) =>
        prev ? { ...prev, commentsCount: prev.commentsCount + 1 } : null
      );
    }

    addToast('success', 'Comment Published');
  };

  const handleToggleLikeComment = (commentId: string) => {
    setCommentsMap((prev) => {
      const updated: Record<string, Comment[]> = {};
      Object.keys(prev).forEach((k) => {
        updated[k] = prev[k].map((c) => {
          if (c.id === commentId) {
            const nextLiked = !c.isLiked;
            return {
              ...c,
              isLiked: nextLiked,
              likes: nextLiked ? c.likes + 1 : Math.max(0, c.likes - 1)
            };
          }
          return c;
        });
      });
      return updated;
    });
  };

  // Upload Talent
  const handleUploadSuccess = (newTalent: TalentItem, savedToServer = true, serverUser?: UserProfile) => {
    setTalents((prev) => [newTalent, ...prev]);
    if (serverUser) {
      // Counts (+1 talent, +50 score) already applied by the backend.
      setCurrentUser(serverUser);
    } else {
      setCurrentUser((prev) => ({
        ...prev,
        talentCount: prev.talentCount + 1,
        score: prev.score + 50
      }));
    }
    if (savedToServer) {
      addToast('success', 'Talent Showcase Published!', 'Your work is now live for community voting (+50 pts).');
    } else {
      addToast('info', 'Post Saved On This Device', 'Backend is offline — it will not appear after reload.');
    }
    setActiveTab('home');
  };


  const handleSendMessage = (threadId: string, text: string) => {
    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user' as const,
      text,
      timestamp: 'Just now'
    };

    setChatThreads((prev) =>
      prev.map((t) => {
        if (t.id === threadId) {
          return {
            ...t,
            lastMessage: text,
            timestamp: 'Just now',
            messages: [...t.messages, userMsg]
          };
        }
        return t;
      })
    );

    // Simulate smart contact response after 1.2s
    setTimeout(() => {
      const autoResponses = [
        'Awesome! Keep up the brilliant work!',
        'Loved that performance, voted for you today!',
        'Let’s collaborate on a showcase soon 🔥',
        'Thanks for reaching out brother! Have a wonderful day.'
      ];
      const randomReply = autoResponses[Math.floor(Math.random() * autoResponses.length)];

      const contactMsg = {
        id: `msg-reply-${Date.now()}`,
        sender: 'contact' as const,
        text: randomReply,
        timestamp: 'Just now'
      };

      setChatThreads((prev) =>
        prev.map((t) => {
          if (t.id === threadId) {
            return {
              ...t,
              lastMessage: randomReply,
              timestamp: 'Just now',
              messages: [...t.messages, contactMsg]
            };
          }
          return t;
        })
      );
    }, 1200);
  };

  // Notifications
  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    addToast('info', 'All Notifications Marked as Read');
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    );
    if (notif.targetTalentId) {
      const found = talents.find((t) => t.id === notif.targetTalentId);
      if (found) {
        setSelectedTalent(found);
        setIsNotificationsOpen(false);
      }
    }
  };

  const unreadMessagesCount = chatThreads.reduce((acc, t) => acc + t.unreadCount, 0);

  const handleLogout = () => {
    api.logout();
    setIsLoggedIn(false);
    setCurrentUser({
      ...currentUserProfile,
      name: 'Guest User',
      handle: '@guest',
      bio: 'Discovering original talents and creators.',
      talentCount: 0,
      score: 0
    });
    addToast('info', t.signOut, 'You have been logged out successfully.');
    setActiveTab('home');
  };

  // If user is not logged in, show the dedicated Sign Up front page first
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
        <SignUpPage
          onSignUpSuccess={async (name, email, avatar, role, mode) => {
            setCurrentUser((prev) => ({
              ...prev,
              name,
              email,
              avatar: avatar || prev.avatar,
              handle: `@${name.toLowerCase().replace(/\s+/g, '')}`
            }));

            setIsLoggedIn(true);
            setActiveTab('home');

            if (mode === 'login') {
              addToast('success', `Welcome back, ${name}!`, 'You have logged in successfully.');
            } else {
              addToast('success', `Account Created Successfully! Welcome, ${name}!`, `Your ${role === 'creator' ? 'Creator' : 'Audience'} profile is ready.`);
            }
      
            try {
              const user = await api.me();
              setCurrentUser(user);
            } catch {
              // Social/guest path has no token — keep the local profile.
            }
          }}
          onNavigateHome={() => {
            setIsLoggedIn(true);
            setActiveTab('home');
          }}
          initialMode="signup"
        />

        {/* Global Toast Alerts for feedback */}
        <Toast toasts={toasts} onDismiss={removeToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col font-sans pb-16 md:pb-0">
      {/* Top Desktop Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        notifications={notifications}
        unreadMessagesCount={unreadMessagesCount}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSignUp={() => setIsLoggedIn(false)}
        onLogout={handleLogout}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Views Container */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <FeedView
            talents={talents}
            leaderboard={leaderboard}
            onSelectTalent={(t) => setSelectedTalent(t)}
            onOpenUpload={() => setIsUploadOpen(true)}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            selectedCategory={selectedCategory}
            onToggleLike={handleToggleLike}
            onToggleVote={handleToggleVote}
            onToggleSave={handleToggleSave}
            onOpenComments={(t) => setSelectedTalent(t)}
            onShare={handleShare}
            onNavigateLeaderboard={() => setActiveTab('leaderboard')}
          />
        )}

        {activeTab === 'explore' && (
          <ExploreView
            talents={talents}
            onSelectTalent={(t) => setSelectedTalent(t)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView
            leaderboard={leaderboard}
            onVoteUser={handleVoteLeaderboardUser}
            onSelectCreator={(name) => {
              setSearchQuery(name);
              setActiveTab('explore');
            }}
          />
        )}

        {activeTab === 'inbox' && (
          <InboxView
            threads={chatThreads}
            onSendMessage={handleSendMessage}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            talents={talents}
            onSelectTalent={(t) => setSelectedTalent(t)}
            onOpenEditProfile={() => setIsEditProfileOpen(true)}
            onShareProfile={() => {
              if (navigator.clipboard) navigator.clipboard.writeText(window.location.href);
              addToast('success', 'Profile URL Copied!');
            }}
            onToggleLike={handleToggleLike}
            onToggleVote={handleToggleVote}
            onToggleSave={handleToggleSave}
            onOpenComments={(t) => setSelectedTalent(t)}
            onShareTalent={handleShare}
            onOpenUpload={() => setIsUploadOpen(true)}
          />
        )}

        {activeTab === 'auth' && (
          <AuthPage
            initialMode={authInitialMode === 'splash' ? 'login' : authInitialMode}
            onAuthSuccess={(name, email) => {
              setCurrentUser((prev) => ({
                ...prev,
                name,
                email,
                handle: `@${name.toLowerCase().replace(/\s+/g, '')}`
              }));
              setIsLoggedIn(true);
              setActiveTab('home');
              addToast('success', `Welcome, ${name}!`);
            }}
            onNavigateHome={() => setActiveTab('home')}
          />
        )}
      </main>

      {/* Bottom Mobile Navigation Dock (Matching Figma Mobile Bottom Bar) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 p-1 rounded-xl transition-colors ${
            activeTab === 'home' ? 'text-indigo-600 font-bold' : 'text-gray-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">{t.home}</span>
        </button>

        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center gap-1 p-1 rounded-xl transition-colors ${
            activeTab === 'explore' ? 'text-indigo-600 font-bold' : 'text-gray-500'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">{t.explore}</span>
        </button>

        {/* Center Prominent Create / Plus Button */}
        <button
          onClick={() => setIsUploadOpen(true)}
          className="w-12 h-12 -mt-5 rounded-full bg-linear-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          onClick={() => setActiveTab('inbox')}
          className={`flex flex-col items-center gap-1 p-1 rounded-xl transition-colors relative ${
            activeTab === 'inbox' ? 'text-indigo-600 font-bold' : 'text-gray-500'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px]">{t.inbox}</span>
          {unreadMessagesCount > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-indigo-600" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 p-1 rounded-xl transition-colors ${
            activeTab === 'profile' ? 'text-indigo-600 font-bold' : 'text-gray-500'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">{t.profile}</span>
        </button>
      </div>

      {/* Global Modals */}
      {/* 1. Talent Detail Modal */}
      <TalentDetailModal
        talent={selectedTalent}
        onClose={() => setSelectedTalent(null)}
        comments={selectedTalent ? commentsMap[selectedTalent.id] || [] : []}
        onAddComment={handleAddComment}
        onToggleLikeComment={handleToggleLikeComment}
        onToggleLikeTalent={handleToggleLike}
        onToggleVoteTalent={handleToggleVote}
        onToggleSaveTalent={handleToggleSave}
        onShare={handleShare}
      />

      {/* 2. Upload Talent Modal */}
      <UploadTalentModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        currentUserName={currentUser.name}
        currentUserAvatar={currentUser.avatar}
      />

      {/* 3. Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onNotificationClick={handleNotificationClick}
      />

      {/* 4. Auth Modal (Splash / Login / Register) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authInitialMode}
        onLoginSuccess={(name, email) => {
          setCurrentUser((prev) => ({
            ...prev,
            name,
            email,
            handle: `@${name.toLowerCase().replace(/\s+/g, '')}`
          }));
          setIsLoggedIn(true);
          addToast('success', `Welcome back, ${name}!`);
        }}
      />

      {/* 5. Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        currentUser={currentUser}
        onSaveProfile={(updated) => {
          setCurrentUser((prev) => ({ ...prev, ...updated }));
          addToast('success', 'Profile Updated Successfully');
        }}
      />

      {/* Global Toast Alerts */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
