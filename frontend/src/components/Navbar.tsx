import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Bell, 
  MessageSquare, 
  Trophy, 
  Compass, 
  Home, 
  User, 
  Menu, 
  X, 
  Award,
  Globe,
  LogIn,
  UserPlus,
  LogOut,
  ChevronDown,
  Edit3
} from 'lucide-react';
import { UserProfile, NotificationItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  activeTab: 'home' | 'explore' | 'leaderboard' | 'inbox' | 'profile' | 'auth';
  setActiveTab: (tab: 'home' | 'explore' | 'leaderboard' | 'inbox' | 'profile' | 'auth') => void;
  currentUser: UserProfile;
  notifications: NotificationItem[];
  unreadMessagesCount: number;
  onOpenUpload: () => void;
  onOpenNotifications: () => void;
  onOpenSignUp: () => void;
  onLogout?: () => void;
  onOpenEditProfile?: () => void;
  isLoggedIn?: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  notifications,
  unreadMessagesCount,
  onOpenUpload,
  onOpenNotifications,
  onOpenSignUp,
  onLogout,
  onOpenEditProfile,
  searchQuery,
  setSearchQuery
}) => {
  const { t, language, toggleLanguage, setLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Left: Brand Logo & Title */}
          <div className="flex items-center gap-4 lg:gap-6">
            <button 
              id="nav-logo-btn"
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none shrink-0"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <div className="leading-none">
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">{t.appName}</span>
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-indigo-600">{t.appTagline}</span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-semibold hidden sm:block mt-0.5">
                  {language === 'bn' ? 'অডিও · ভিডিও · সাহিত্য' : 'Audio · Video · Text'}
                </p>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              <button
                id="nav-home-tab"
                onClick={() => setActiveTab('home')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all ${
                  activeTab === 'home' 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Home className="w-4 h-4" />
                {t.home}
              </button>

              <button
                id="nav-explore-tab"
                onClick={() => setActiveTab('explore')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all ${
                  activeTab === 'explore' 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Compass className="w-4 h-4" />
                {t.explore}
              </button>

              <button
                id="nav-leaderboard-tab"
                onClick={() => setActiveTab('leaderboard')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all ${
                  activeTab === 'leaderboard' 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Trophy className="w-4 h-4" />
                {t.leaderboard}
              </button>

              <button
                id="nav-inbox-tab"
                onClick={() => setActiveTab('inbox')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all relative ${
                  activeTab === 'inbox' 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                {t.inbox}
                {unreadMessagesCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white"></span>
                )}
              </button>
            </nav>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden 2xl:flex flex-1 max-w-xs mx-2">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="global-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'explore' && e.target.value.trim().length > 0) {
                    setActiveTab('explore');
                  }
                }}
                placeholder={t.searchPlaceholder}
                className="w-full bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-slate-900 text-xs sm:text-sm rounded-full pl-10 pr-8 py-2 border border-transparent focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200/80 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Right Section: Language Toggle, Upload Button, Notifications, User/Auth */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Language Switcher Button (Desktop & Tablet) */}
            <div className="relative shrink-0">
              <button
                id="nav-lang-toggle-btn"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold text-slate-700 hover:text-indigo-600 bg-slate-100/80 hover:bg-indigo-50/70 border border-slate-200/80 transition-all cursor-pointer"
                title="Change Language / ভাষা পরিবর্তন"
              >
                <Globe className="w-4 h-4 text-indigo-600" />
                <span>{language === 'bn' ? 'বাংলা' : 'EN'}</span>
              </button>

              {langDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setLangDropdownOpen(false)}
                >
                  <button
                    onClick={() => { setLanguage('en'); setLangDropdownOpen(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                      language === 'en' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>English</span>
                    {language === 'en' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                  </button>
                  <button
                    onClick={() => { setLanguage('bn'); setLangDropdownOpen(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold font-bangla transition-colors ${
                      language === 'bn' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>বাংলা</span>
                    {language === 'bn' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                  </button>
                </div>
              )}
            </div>

            {/* Prominent Upload Talent Button */}
            <button
              id="nav-upload-btn"
              onClick={onOpenUpload}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-md shadow-indigo-600/25 active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              <span className="whitespace-nowrap">{t.uploadTalent}</span>
            </button>

            {/* Notifications Button */}
            <button
              id="nav-notifications-btn"
              onClick={onOpenNotifications}
              className="relative p-2 rounded-full text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/70 transition-colors shrink-0"
              title={t.notifications}
            >
              <Bell className="w-5 h-5" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* User Profile Button & Dropdown */}
            <div className="relative">
              <button
                id="nav-profile-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className={`flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border transition-all cursor-pointer shrink-0 ${
                  activeTab === 'profile' || userDropdownOpen
                    ? 'border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-100'
                    : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-indigo-400"
                />
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[100px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-indigo-600 font-semibold leading-tight">
                    {currentUser.score} {t.pts}
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs font-extrabold text-slate-900 truncate">{currentUser.name}</p>
                    <p className="text-[11px] font-semibold text-indigo-600 truncate">{currentUser.handle}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 font-bold">
                      <span>{t.scoreLabel}: {currentUser.score} {t.pts}</span>
                      <span>{currentUser.talentCount} {t.tabTalent}</span>
                    </div>
                  </div>

                  <button
                    id="dropdown-profile-btn"
                    onClick={() => {
                      setActiveTab('profile');
                      setUserDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                      activeTab === 'profile' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <User className="w-4 h-4 text-indigo-500" />
                    <span>{t.profile}</span>
                  </button>

                  {onOpenEditProfile && (
                    <button
                      id="dropdown-edit-profile-btn"
                      onClick={() => {
                        onOpenEditProfile();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Edit3 className="w-4 h-4 text-slate-400" />
                      <span>{t.editProfile}</span>
                    </button>
                  )}

                  {onLogout && (
                    <button
                      id="dropdown-logout-btn"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors mt-1 border-t border-slate-100/80 pt-2"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>{t.signOut}</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              id="mobile-nav-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-150">
          
          {/* Mobile Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'explore') setActiveTab('explore');
              }}
              placeholder={t.searchPlaceholder}
              className="w-full bg-slate-100 text-slate-900 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pb-2">
            <button
              onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold ${
                activeTab === 'home' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Home className="w-4 h-4" />
              {t.home}
            </button>

            <button
              onClick={() => { setActiveTab('explore'); setMobileMenuOpen(false); }}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold ${
                activeTab === 'explore' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4" />
              {t.explore}
            </button>

            <button
              onClick={() => { setActiveTab('leaderboard'); setMobileMenuOpen(false); }}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold ${
                activeTab === 'leaderboard' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Trophy className="w-4 h-4" />
              {t.leaderboard}
            </button>

            <button
              onClick={() => { setActiveTab('inbox'); setMobileMenuOpen(false); }}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold ${
                activeTab === 'inbox' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                {t.inbox}
              </div>
              {unreadMessagesCount > 0 && (
                <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {unreadMessagesCount}
                </span>
              )}
            </button>
          </div>

          {/* User / Sign Up / Logout Options in Mobile Drawer */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => { setActiveTab('profile'); setMobileMenuOpen(false); }}
                className="flex items-center gap-2 text-xs font-bold text-slate-800"
              >
                <img src={currentUser.avatar} alt={currentUser.name} className="w-7 h-7 rounded-full object-cover" />
                <span className="truncate max-w-[140px]">{currentUser.name}</span>
                <span className="text-[10px] text-indigo-600">({currentUser.score} pts)</span>
              </button>

              {/* Mobile Language switch */}
              <button
                onClick={toggleLanguage}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1 shrink-0"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                id="mobile-nav-signup-btn"
                onClick={() => { onOpenSignUp(); setMobileMenuOpen(false); }}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-center text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{t.signUp}</span>
              </button>

              {onLogout && (
                <button
                  id="mobile-nav-logout-btn"
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/70 rounded-xl transition-colors shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t.signOut}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
