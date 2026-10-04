import React, { useState } from 'react';
import { 
  Upload, 
  ChevronRight, 
  Play, 
  Flame, 
  Trophy, 
  ArrowRight,
  Heart,
  Info
} from 'lucide-react';
import { TalentItem, Category, LeaderboardUser } from '../types';
import { TalentCard } from './TalentCard';
import { CategoryIcon } from './CategoryIcon';
import { formatCompactNumber } from '../utils/confetti';
import { useLanguage } from '../context/LanguageContext';

interface FeedViewProps {
  talents: TalentItem[];
  leaderboard: LeaderboardUser[];
  onSelectTalent: (talent: TalentItem) => void;
  onSelectAuthor: (talent: TalentItem) => void;
  onOpenUpload: () => void;
  onSelectCategory: (cat: Category | 'All') => void;
  selectedCategory: Category | 'All';
  onToggleLike: (id: string) => void;
  onToggleVote: (id: string) => void;
  onToggleSave: (id: string) => void;
  onOpenComments: (talent: TalentItem) => void;
  onShare: (talent: TalentItem) => void;
  onNavigateLeaderboard: () => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  talents,
  leaderboard,
  onSelectTalent,
  onSelectAuthor,
  onOpenUpload,
  onSelectCategory,
  selectedCategory,
  onToggleLike,
  onToggleVote,
  onToggleSave,
  onOpenComments,
  onShare,
  onNavigateLeaderboard
}) => {
  const { t, language } = useLanguage();
  const [filterType, setFilterType] = useState<'all' | 'video' | 'audio' | 'text'>('all');

  const categoriesList: { name: Category; label: string }[] = [
    { name: 'Singing', label: t.catSinging },
    { name: 'Dancing', label: t.catDancing },
    { name: 'Art', label: t.catArt },
    { name: 'Poetry', label: t.catPoetry },
    { name: 'Instrumental', label: t.catInstrumental },
    { name: 'Comedy', label: t.catComedy },
    { name: 'Others', label: t.catOthers }
  ];

  const filteredTalents = talents.filter((tItem) => {
    const matchesCategory = selectedCategory === 'All' || tItem.category === selectedCategory;
    const matchesType = filterType === 'all' || tItem.type === filterType;
    return matchesCategory && matchesType;
  });

  const trendingTalents = talents.slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Main Feed Column (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white p-6 sm:p-8 lg:p-10 shadow-lg shadow-indigo-600/15">
            {/* Ambient Lighting */}
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-purple-400/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-3.5 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-indigo-100 text-xs font-bold uppercase tracking-wider border border-white/10">
                  <Trophy className="w-3.5 h-3.5" />
                  {t.heroBadge}
                </div>
                
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                  {t.heroTitle1} <br className="hidden sm:block" />
                  <span className="text-indigo-200">{t.heroTitle2}</span>
                </h1>

                <p className="text-xs sm:text-sm text-indigo-100/90 font-semibold tracking-wide">
                  {t.heroSubtitle}
                </p>

                <div className="pt-2">
                  <button
                    id="hero-upload-now-btn"
                    onClick={onOpenUpload}
                    className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-md shadow-black/10 hover:shadow-lg active:scale-95 transition-all"
                  >
                    <Upload className="w-4 h-4 stroke-[2.5]" />
                    {t.uploadNow}
                  </button>
                </div>
              </div>

              {/* Featured Creator Card */}
              <div className="relative shrink-0">
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden ring-4 ring-white/30 shadow-2xl shadow-black/30 transform hover:rotate-1 transition-transform">
                  <img
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80"
                    alt="Featured Creator"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      {t.featuredCreator}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Categories Horizontal Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                {t.categories}
              </h2>
              <button
                onClick={() => onSelectCategory('All')}
                className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                {selectedCategory === 'All' ? t.viewAll : t.resetFilter}
              </button>
            </div>

            {/* Scrollable / Grid Categories */}
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none sm:grid sm:grid-cols-4 md:grid-cols-7">
              {categoriesList.map((cat) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    id={`cat-btn-${cat.name}`}
                    onClick={() => onSelectCategory(isSelected ? 'All' : cat.name)}
                    className={`shrink-0 flex sm:flex-col items-center justify-center gap-2 sm:gap-1.5 p-2.5 sm:p-3 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20 scale-102'
                        : 'bg-white text-slate-700 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40 shadow-2xs'
                    }`}
                  >
                    <div className={`p-1.5 sm:p-2 rounded-xl transition-colors ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-indigo-600'
                    }`}>
                      <CategoryIcon category={cat.name} className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-xs font-bold whitespace-nowrap truncate max-w-[100px]">
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trending Talents Horizontal Reel */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-500 fill-rose-500" />
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                  {t.trendingTalents}
                </h2>
              </div>
              <button
                onClick={() => setFilterType('all')}
                className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5"
              >
                {t.seeAll} <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-3.5 overflow-x-auto pb-3 scrollbar-none snap-x">
              {trendingTalents.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectTalent(item)}
                  className="shrink-0 w-44 sm:w-48 bg-white rounded-2xl border border-slate-100 p-2.5 shadow-2xs hover:shadow-md hover:border-indigo-200 cursor-pointer snap-start transition-all group"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 mb-2">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 flex items-center justify-center transition-colors">
                      <div className="w-9 h-9 rounded-full bg-white/40 backdrop-blur-xs flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                    {item.type && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[10px] font-bold text-white uppercase">
                        {item.type}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate group-hover:text-indigo-600">
                    {item.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectAuthor(item);
                      }}
                      className="truncate max-w-[90px] hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      {item.authorName}
                    </button>
                    <span className="flex items-center gap-1 text-rose-500 font-bold">
                      <Heart className="w-3 h-3 fill-rose-500" />
                      {formatCompactNumber(item.likes)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Type Filter Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
                {t.format}
              </span>
              <div className="flex items-center gap-1.5">
                {(['all', 'video', 'audio', 'text'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-all ${
                      filterType === type
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {type === 'all' ? t.all : type === 'video' ? t.video : type === 'audio' ? t.audio : t.text}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-xs font-bold text-slate-400">
              {filteredTalents.length} {t.showcases}
            </span>
          </div>

          {/* Feed Talents Stream */}
          <div className="space-y-6">
            {filteredTalents.map((talent) => (
              <TalentCard
                key={talent.id}
                talent={talent}
                onSelectTalent={onSelectTalent}
                onSelectAuthor={onSelectAuthor}
                onToggleLike={onToggleLike}
                onToggleVote={onToggleVote}
                onToggleSave={onToggleSave}
                onOpenComments={onOpenComments}
                onShare={onShare}
              />
            ))}

            {filteredTalents.length === 0 && (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 shadow-2xs">
                <CategoryIcon category={selectedCategory} className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800">{t.noTalentsFound}</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">{t.beFirstToUpload}</p>
                <button
                  onClick={onOpenUpload}
                  className="mt-4 px-6 py-2.5 rounded-full bg-indigo-600 text-white text-xs sm:text-sm font-bold hover:bg-indigo-700 shadow-sm"
                >
                  {t.uploadShowcase}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Sidebar (4 cols on desktop) */}
        <div className="hidden lg:block lg:col-span-4 space-y-6">
          
          {/* Quick Leaderboard Widget */}
          <div className="bg-white rounded-3xl border border-slate-100/90 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-amber-50 text-amber-600">
                  <Trophy className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">{t.topLeaderboard}</h3>
              </div>
              <button
                onClick={onNavigateLeaderboard}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5"
              >
                {t.fullBoard} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {leaderboard.slice(0, 4).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-5 text-xs font-extrabold ${
                      user.rank === 1 ? 'text-amber-500' : user.rank === 2 ? 'text-slate-400' : user.rank === 3 ? 'text-amber-700' : 'text-slate-400'
                    }`}>
                      #{user.rank}
                    </span>
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                        {user.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {user.category}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-extrabold text-indigo-600">
                      {user.score} {t.pts}
                    </span>
                    <div className="text-[10px] text-slate-400">
                      {formatCompactNumber(user.votes)} {t.votes}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Platform Rules / Guidelines */}
          <div className="bg-gradient-to-br from-indigo-50/70 to-purple-50/50 rounded-3xl border border-indigo-100/70 p-5">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-indigo-900 mb-3 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-indigo-600" />
              {t.howItWorks}
            </h4>
            <ul className="space-y-3 text-xs text-slate-600 font-medium">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-200 text-indigo-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                <span>{t.rule1}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-200 text-indigo-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                <span>{t.rule2}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-200 text-indigo-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                <span>{t.rule3}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
