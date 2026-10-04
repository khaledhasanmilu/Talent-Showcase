import React, { useEffect, useState } from 'react';
import {
  mockTalents,
  mockComments,
  mockNotifications,
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
import { buildLeaderboardFromTalents } from './utils/leaderboard';

export default function App() {
  const { t } = useLanguage();
  // Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'leaderboard' | 'inbox' | 'profile' | 'auth'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  // Application Data State
  const [talents, setTalents] = useState<TalentItem[]>(mockTalents);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(() =>
    buildLeaderboardFromTalents(mockTalents)
  );
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>(mockComments);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile>(currentUserProfile);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Modals State
  const [selectedTalent, setSelectedTalent] = useState<TalentItem | null>(null);
  const [viewingAuthor, setViewingAuthor] = useState<UserProfile | null>(null);
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
        if (serverBoard.length > 0) {
          setLeaderboard(serverBoard);
        } else if (serverTalents.length > 0) {
          // No board from server — rank from the posts themselves.
          setLeaderboard(buildLeaderboardFromTalents(serverTalents));
        }
      } catch {
        // Backend offline — keep local ranking built from mock posts.
      }

      if (getToken()) {
        try {
          const [conversations, notifications] = await Promise.all([
            api.getConversations(),
            api.getNotifications(),
          ]);
          if (!cancelled) {
            setChatThreads(conversations);
            setNotifications(notifications);
          }
        } catch {
          // keep mock inbox/notifications as fallback.
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Leaving the author profile when switching tabs.
  useEffect(() => {
    setViewingAuthor(null);
  }, [activeTab]);

  // Handlers for Talent Interaction
  const applyTalentPatch = (talentId: string, patch: (t: TalentItem) => TalentItem) => {
    setTalents((prev) => prev.map((item) => (item.id === talentId ? patch(item) : item)));
    setSelectedTalent((prev) =>
      prev && prev.id === talentId ? { ...prev, ...patch(prev) } : prev
    );
  };

  // Leaderboard is always derived from talent posts — no separate vote.
  // Prefer the server aggregation; fall back to a local build from the
  // loaded feed (same formula) so offline ranking still reflects posts.
  const refreshLeaderboard = (fallbackTalents?: TalentItem[]) => {
    api
      .getLeaderboard(8)
      .then((board) => {
        if (board.length > 0) setLeaderboard(board);
      })
      .catch(() => {
        setLeaderboard((prev) => {
          const source = fallbackTalents ?? talents;
          const rebuilt = buildLeaderboardFromTalents(source);
          return rebuilt.length > 0 ? rebuilt : prev;
        });
      });
  };

  const handleToggleLike = (talentId: string) => {
    if (!getToken()) return;
    applyTalentPatch(talentId, (t) => {
      const next = !t.isLiked;
      return { ...t, isLiked: next, likes: next ? t.likes + 1 : Math.max(0, t.likes - 1) };
    });
    api.toggleTalentInteraction(talentId, 'like')
      .then(({ talent }) => {
        applyTalentPatch(talentId, (t) => ({ ...t, ...talent }));
        refreshLeaderboard();
      })
      .catch(() => {
        // Offline: re-rank from the optimistic local counts.
        setTalents((prev) => {
          refreshLeaderboard(prev);
          return prev;
        });
      });
  };

  const handleToggleVote = (talentId: string) => {
    if (!getToken()) return;
    const wasVoted = talents.find((t) => t.id === talentId)?.isVoted;
    applyTalentPatch(talentId, (t) => {
      const next = !t.isVoted;
      return { ...t, isVoted: next, votes: next ? t.votes + 1 : Math.max(0, t.votes - 1) };
    });
    if (!wasVoted) {
      setCurrentUser((prev) => ({ ...prev, score: prev.score + 5 }));
      addToast('success', 'Vote Recorded!', 'You boosted this talent in the weekly ranking (+5 points).');
    }
    api.toggleTalentInteraction(talentId, 'vote')
      .then(({ talent }) => {
        applyTalentPatch(talentId, (t) => ({ ...t, ...talent }));
        refreshLeaderboard();
      })
      .catch(() => {
        setTalents((prev) => {
          refreshLeaderboard(prev);
          return prev;
        });
      });
  };

  const handleToggleSave = (talentId: string) => {
    if (!getToken()) return;
    const wasSaved = talents.find((t) => t.id === talentId)?.isSaved;
    applyTalentPatch(talentId, (t) => ({ ...t, isSaved: !t.isSaved }));
    addToast(
      'info',
      wasSaved ? 'Removed from Saved' : 'Saved to Collection',
      wasSaved ? undefined : 'You can view this in your Profile.'
    );
    api.toggleTalentInteraction(talentId, 'save')
      .then(({ talent }) => applyTalentPatch(talentId, (t) => ({ ...t, ...talent })))
      .catch(() => addToast('error', 'Could not update save'));
  };

  const handleShare = (talent: TalentItem) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    addToast('success', 'Link Copied to Clipboard!', `Share "${talent.title}" with your friends.`);
  };

  // Clicking the author (avatar / name) opens their profile.
  // Your own author chip goes to your profile tab; anyone else opens
  // their public profile built from the loaded feed + leaderboard.
  const handleSelectAuthor = (talent: TalentItem) => {
    const isOwn =
      talent.authorName === currentUser.name || talent.authorHandle === currentUser.handle;
    setSelectedTalent(null);
    if (isOwn) {
      setViewingAuthor(null);
      setActiveTab('profile');
      return;
    }
    const boardEntry = leaderboard.find(
      (u) => u.handle === talent.authorHandle || u.name === talent.authorName
    );
    const authorTalents = talents.filter(
      (t) => t.authorHandle === talent.authorHandle || t.authorName === talent.authorName
    );
    setViewingAuthor({
      id: boardEntry?.id || `author-${talent.authorHandle}`,
      name: talent.authorName,
      handle: talent.authorHandle,
      avatar: talent.authorAvatar,
      location: talent.authorLocation || '',
      bio: '',
      talentCount: authorTalents.length,
      score: boardEntry?.score || 0,
      rank: boardEntry?.rank || talent.authorRank || 0,
      email: '',
      category: boardEntry?.category,
    });
  };

  // Clicking a leaderboard creator opens their public profile — with all
  // their talent posts underneath, which is exactly what the rank is built from.
  const handleSelectLeaderboardUser = (user: LeaderboardUser) => {
    const isOwn = user.name === currentUser.name || user.handle === currentUser.handle;
    setSelectedTalent(null);
    if (isOwn) {
      setViewingAuthor(null);
      setActiveTab('profile');
      return;
    }
    const authorTalents = talents.filter(
      (t) => t.authorHandle === user.handle || t.authorName === user.name
    );
    const first = authorTalents[0];
    setViewingAuthor({
      id: user.id,
      name: user.name,
      handle: user.handle,
      avatar: first?.authorAvatar || user.avatar,
      location: first?.authorLocation || '',
      bio: '',
      talentCount: authorTalents.length,
      score: user.score,
      rank: user.rank,
      email: '',
      category: user.category,
    });
  };

  // Load comments from the server whenever a talent is opened.
  useEffect(() => {
    if (!selectedTalent) return;
    let cancelled = false;
    api
      .getComments(selectedTalent.id)
      .then((comments) => {
        if (!cancelled) setCommentsMap((prev) => ({ ...prev, [selectedTalent.id]: comments }));
      })
      .catch(() => {
        // fall back to any locally cached comments for this talent.
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTalent?.id]);

  // Comment Handlers
  const bumpTalentComments = (talentId: string) => {
    setTalents((prev) => prev.map((t) => (t.id === talentId ? { ...t, commentsCount: t.commentsCount + 1 } : t)));
    setSelectedTalent((prev) => (prev && prev.id === talentId ? { ...prev, commentsCount: prev.commentsCount + 1 } : prev));
  };

  const handleAddComment = async (talentId: string, text: string) => {
    if (!getToken()) {
      addToast('error', 'Please log in to comment');
      return;
    }
    bumpTalentComments(talentId);
    try {
      const comment = await api.addComment(talentId, text);
      setCommentsMap((prev) => ({ ...prev, [talentId]: [...(prev[talentId] || []), comment] }));
      addToast('success', 'Comment Published');
      refreshLeaderboard();
    } catch {
      addToast('error', 'Could not publish comment');
    }
  };

  const handleToggleLikeComment = (commentId: string) => {
    if (!getToken()) return;
    api
      .toggleCommentLike(commentId)
      .then(({ comment }) => {
        setCommentsMap((prev) => {
          const updated: Record<string, Comment[]> = {};
          Object.keys(prev).forEach((k) => {
            updated[k] = prev[k].map((c) => (c.id === commentId ? { ...c, ...comment } : c));
          });
          return updated;
        });
      })
      .catch(() => addToast('error', 'Could not update comment'));
  };

  // Upload Talent
  const handleUploadSuccess = (newTalent: TalentItem, savedToServer = true, serverUser?: UserProfile) => {
    setTalents((prev) => {
      const next = [newTalent, ...prev];
      refreshLeaderboard(next);
      return next;
    });
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
    if (!getToken()) return;
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

    api
      .sendMessage(threadId, text)
      .then(({ userMessage, lastMessage }) => {
        setChatThreads((prev) =>
          prev.map((t) => {
            if (t.id !== threadId) return t;
            const msgs = [...t.messages];
            const lastIdx = msgs.length - 1;
            if (lastIdx >= 0 && msgs[lastIdx].sender === 'user' && msgs[lastIdx].text === text) {
              msgs[lastIdx] = userMessage;
            }
            return {
              ...t,
              lastMessage,
              timestamp: 'Just now',
              messages: msgs
            };
          })
        );
      })
      .catch(() => addToast('error', 'Could not send message'));
  };

  const handleStartConversation = async (contactId: string): Promise<ChatThread | null> => {
    try {
      const thread = await api.createConversation(contactId);
      setChatThreads((prev) => {
        const idx = prev.findIndex((t) => t.id === thread.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = thread;
          return next;
        }
        return [thread, ...prev];
      });
      return thread;
    } catch {
      addToast('error', 'Could not start conversation');
      return null;
    }
  };

  // Notifications
  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    api.markAllNotificationsRead().catch(() => {});
    addToast('info', 'All Notifications Marked as Read');
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    );
    api.markNotificationRead(notif.id).catch(() => {});
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
    setChatThreads([]);
    setNotifications([]);
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

            // After login the initial mount effect has already run without a token,
            // so fetch the user's inbox + notifications now.
            try {
              const [conversations, notifications] = await Promise.all([
                api.getConversations(),
                api.getNotifications(),
              ]);
              setChatThreads(conversations);
              setNotifications(notifications);
            } catch {
              // keep mock inbox/notifications as fallback.
            }
          }}
          onNavigateHome={async () => {
            setIsLoggedIn(true);
            setActiveTab('home');
            if (getToken()) {
              try {
                const [conversations, notifications] = await Promise.all([
                  api.getConversations(),
                  api.getNotifications(),
                ]);
                if (conversations.length > 0) setChatThreads(conversations);
                if (notifications.length > 0) setNotifications(notifications);
              } catch {
                // keep mock inbox/notifications as fallback.
              }
            }
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
        {viewingAuthor ? (
          <ProfileView
            currentUser={viewingAuthor}
            talents={talents}
            onSelectTalent={(t) => setSelectedTalent(t)}
            onOpenEditProfile={() => {}}
            onShareProfile={() => {
              if (navigator.clipboard) navigator.clipboard.writeText(window.location.href);
              addToast('success', 'Profile URL Copied!');
            }}
            onToggleLike={handleToggleLike}
            onToggleVote={handleToggleVote}
            onToggleSave={handleToggleSave}
            onOpenComments={(t) => setSelectedTalent(t)}
            onShareTalent={handleShare}
            isOwn={false}
            onBack={() => setViewingAuthor(null)}
          />
        ) : (
        <>
        {activeTab === 'home' && (
          <FeedView
            talents={talents}
            leaderboard={leaderboard}
            onSelectTalent={(t) => setSelectedTalent(t)}
            onSelectAuthor={handleSelectAuthor}
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
            onSelectAuthor={handleSelectAuthor}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView
            leaderboard={leaderboard}
            talents={talents}
            onSelectUser={handleSelectLeaderboardUser}
          />
        )}

        {activeTab === 'inbox' && (
          <InboxView
            threads={chatThreads}
            onSendMessage={handleSendMessage}
            onStartConversation={handleStartConversation}
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
              if (getToken()) {
                api.getConversations().then((conversations) => {
                  setChatThreads(conversations);
                }).catch(() => {});
              }
            }}
            onNavigateHome={() => setActiveTab('home')}
          />
        )}
        </>
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
        onSelectAuthor={handleSelectAuthor}
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
          if (getToken()) {
            api.getConversations().then((conversations) => {
              setChatThreads(conversations);
            }).catch(() => {});
          }
        }}
      />

      {/* 5. Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        currentUser={currentUser}
        onSaveProfile={(updated) => {
          setCurrentUser((prev) => ({ ...prev, ...updated }));
          api.updateProfile(updated).then((user) => setCurrentUser(user)).catch(() => {
            addToast('error', 'Profile update failed');
          });
          addToast('success', 'Profile Updated Successfully');
        }}
      />

      {/* Global Toast Alerts */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
