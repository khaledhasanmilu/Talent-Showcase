import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Share2,
  Edit3,
  Play,
  Volume2,
  Heart,
  Grid,
  Upload,
  LayoutGrid,
  Zap
} from 'lucide-react';
import { UserProfile, TalentItem } from '../types';
import { formatCompactNumber } from '../utils/confetti';
import { useLanguage } from '../context/LanguageContext';

interface ProfileViewProps {
  currentUser: UserProfile;
  talents: TalentItem[];
  onSelectTalent: (talent: TalentItem) => void;
  onOpenEditProfile: () => void;
  onShareProfile: () => void;
  onToggleLike: (id: string) => void;
  onToggleVote: (id: string) => void;
  onToggleSave: (id: string) => void;
  onOpenComments: (talent: TalentItem) => void;
  onShareTalent: (talent: TalentItem) => void;
  onOpenUpload?: () => void;
  /** false when viewing another author's public profile (hides edit + Liked/Saved tabs). */
  isOwn?: boolean;
  /** Back navigation shown when viewing another author's profile. */
  onBack?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  talents,
  onSelectTalent,
  onOpenEditProfile,
  onShareProfile,
  onToggleLike,
  onToggleVote,
  onToggleSave,
  onOpenComments,
  onShareTalent,
  onOpenUpload,
  isOwn = true,
  onBack
}) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'Talent' | 'Liked' | 'Saved'>('Talent');

  // Only the logged-in user's own posts
  // (matched by author name or handle, so fresh uploads appear here too).
  const userTalents = talents.filter(
    (item) => item.authorName === currentUser.name || item.authorHandle === currentUser.handle
  );
  const likedTalents = talents.filter((item) => item.isLiked);
  const savedTalents = talents.filter((item) => item.isSaved);

  const displayList = activeTab === 'Talent' ? userTalents : activeTab === 'Liked' ? likedTalents : savedTalents;
  const totalLikes = userTalents.reduce((sum, item) => sum + item.likes, 0);

  const tabs = [
    { key: 'Talent' as const, label: t.tabTalent, count: userTalents.length },
    // Liked/Saved are the viewer's own collections — only on your own profile.
    ...(isOwn
      ? [
          { key: 'Liked' as const, label: t.tabLiked, count: likedTalents.length },
          { key: 'Saved' as const, label: t.tabSaved, count: savedTalents.length },
        ]
      : []),
  ];

  const stats = [
    {
      icon: <LayoutGrid className="w-3.5 h-3.5" />,
      value: `${currentUser.talentCount}`,
      label: language === 'bn' ? 'শোকেস' : 'Showcases'
    },
    {
      icon: <Heart className="w-3.5 h-3.5" />,
      value: formatCompactNumber(totalLikes),
      label: language === 'bn' ? 'লাইক' : 'Likes'
    },
    {
      icon: <Zap className="w-3.5 h-3.5" />,
      value: `${currentUser.score}`,
      label: t.scoreLabel
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Back navigation — only when viewing another author's profile */}
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {language === 'bn' ? 'পেছনে' : 'Back'}
        </button>
      )}
      {/* Profile Hero — same theme as the homepage hero banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white p-6 sm:p-8 shadow-lg shadow-indigo-600/15">
        {/* Ambient Lighting */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-purple-400/20 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar */}
          <div className="shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-white/30 shadow-xl"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight truncate">
              {currentUser.name}
            </h1>
            <p className="text-sm font-semibold text-indigo-200">
              {currentUser.handle}
            </p>
            {currentUser.location && (
              <p className="text-xs text-indigo-100/90 flex items-center justify-center sm:justify-start gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5" />
                {currentUser.location}
              </p>
            )}
            {currentUser.bio && (
              <p className="text-xs sm:text-sm text-indigo-100/90 whitespace-pre-line leading-relaxed mt-2 font-medium">
                {currentUser.bio}
              </p>
            )}

            {/* Stats + Actions */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4">
              {stats.map((s) => (
                <span
                  key={s.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-xs border border-white/10 text-xs font-bold"
                >
                  {s.icon}
                  {s.value}
                  <span className="text-indigo-200 font-semibold">{s.label}</span>
                </span>
              ))}

              <span className="hidden sm:inline w-px h-6 bg-white/20 mx-1" />

              {isOwn && (
                <button
                  id="edit-profile-btn"
                  onClick={onOpenEditProfile}
                  className="inline-flex items-center gap-1.5 bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs px-4 py-2 rounded-full shadow-md shadow-black/10 active:scale-95 transition-all cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  {t.editProfile}
                </button>
              )}
              <button
                onClick={onShareProfile}
                className="p-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/10 text-white transition-colors cursor-pointer"
                title={t.shareProfile}
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 p-1.5 bg-slate-200/70 rounded-2xl max-w-sm mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === tab.key
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
            <span className={`ml-1.5 text-[11px] ${activeTab === tab.key ? 'text-indigo-200' : 'text-slate-400'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {displayList.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectTalent(item)}
            className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-2xs hover:shadow-md hover:border-indigo-200 cursor-pointer transition-all group"
          >
            <div className="relative aspect-video sm:aspect-4/3 bg-slate-900">
              {item.type === 'text' && item.poemText ? (
                /* Text / poem preview — no play button */
                <div className="w-full h-full bg-linear-to-br from-amber-50 via-stone-50 to-indigo-50/40 p-3 flex items-center justify-center overflow-hidden">
                  <div className="font-bangla text-xs sm:text-sm text-slate-800 leading-relaxed italic text-center line-clamp-4">
                    {item.poemText
                      .filter((line) => line.trim() !== '')
                      .slice(0, 3)
                      .map((line, idx) => (
                        <p key={idx}>{line}</p>
                      ))}
                  </div>
                </div>
              ) : (
                <>
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-xs flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      {item.type === 'audio' ? (
                        <Volume2 className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      )}
                    </div>
                  </div>
                </>
              )}
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white uppercase">
                {item.type}
              </span>
            </div>

            <div className="p-3 space-y-1">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate group-hover:text-indigo-600">
                {item.title}
              </h4>
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                <span>{item.category}</span>
                <span className="flex items-center gap-1 text-rose-500 font-bold">
                  <Heart className="w-3 h-3 fill-rose-500" />
                  {formatCompactNumber(item.likes)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {displayList.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 shadow-2xs">
          <Grid className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-700">{t.noItemsYet}</h3>
          {activeTab === 'Talent' && isOwn && onOpenUpload && (
            <button
              onClick={onOpenUpload}
              className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/25 active:scale-95 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              {t.uploadShowcase}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
