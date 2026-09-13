import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Play, 
  Heart, 
  Eye, 
  CheckCircle2, 
  Video, 
  Volume2, 
  FileText 
} from 'lucide-react';
import { TalentItem, Category } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { formatCompactNumber } from '../utils/confetti';
import { useLanguage } from '../context/LanguageContext';

interface ExploreViewProps {
  talents: TalentItem[];
  onSelectTalent: (talent: TalentItem) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  talents,
  onSelectTalent,
  searchQuery,
  setSearchQuery
}) => {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [activeTab, setActiveTab] = useState<'Popular' | 'Recent' | 'Most Liked'>('Popular');
  const [typeFilter, setTypeFilter] = useState<'all' | 'video' | 'audio' | 'text'>('all');

  const categoriesList: { name: Category; label: string }[] = [
    { name: 'Singing', label: t.catSinging },
    { name: 'Dancing', label: t.catDancing },
    { name: 'Art', label: t.catArt },
    { name: 'Poetry', label: t.catPoetry },
    { name: 'Instrumental', label: t.catInstrumental },
    { name: 'Comedy', label: t.catComedy },
    { name: 'Others', label: t.catOthers }
  ];

  const filteredTalents = useMemo(() => {
    let result = [...talents];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.authorName.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter((item) => item.type === typeFilter);
    }

    // Sorting tab
    if (activeTab === 'Popular') {
      result.sort((a, b) => b.views - a.views);
    } else if (activeTab === 'Most Liked') {
      result.sort((a, b) => b.likes - a.likes);
    } else if (activeTab === 'Recent') {
      result.sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [talents, searchQuery, selectedCategory, activeTab, typeFilter]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6">
      {/* Search Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-2xs">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.exploreTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {t.exploreSubtitle}
          </p>

          {/* Search Input Bar */}
          <div className="relative mt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 text-xs sm:text-sm md:text-base rounded-2xl pl-12 pr-10 py-3.5 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all shadow-inner placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Categories Row */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900">{t.categories}</h2>
          <button
            onClick={() => setSelectedCategory('All')}
            className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            {selectedCategory === 'All' ? t.viewAll : t.resetFilter}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
          {categoriesList.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            const count = talents.filter((item) => item.category === cat.name).length;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(isSelected ? 'All' : cat.name)}
                className={`flex items-center gap-2.5 p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                    : 'bg-white text-slate-700 border-slate-100 hover:border-indigo-300 hover:bg-indigo-50/40 shadow-2xs'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
                }`}>
                  <CategoryIcon category={cat.name} className="w-4 h-4" />
                </div>
                <div className="text-left overflow-hidden min-w-0">
                  <div className="font-bold text-xs sm:text-sm truncate">{cat.label}</div>
                  <div className={`text-[10px] ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {count} {t.showcases}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs & Format Pills */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
        {/* Sort Tabs */}
        <div className="inline-flex p-1 bg-slate-200/70 rounded-xl">
          <button
            onClick={() => setActiveTab('Popular')}
            className={`px-3.5 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'Popular'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.popular}
          </button>
          <button
            onClick={() => setActiveTab('Recent')}
            className={`px-3.5 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'Recent'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.recent}
          </button>
          <button
            onClick={() => setActiveTab('Most Liked')}
            className={`px-3.5 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'Most Liked'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.mostLiked}
          </button>
        </div>

        {/* Media Format Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
            {t.format}
          </span>
          {(['all', 'video', 'audio', 'text'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setTypeFilter(fmt)}
              className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-all ${
                typeFilter === fmt
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {fmt === 'all' ? t.all : fmt === 'video' ? t.video : fmt === 'audio' ? t.audio : t.text}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTalents.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectTalent(item)}
            className="bg-white rounded-2xl border border-slate-100 p-3 sm:p-4 shadow-2xs hover:shadow-md hover:border-indigo-200 cursor-pointer transition-all flex items-center gap-3 sm:gap-4 group"
          >
            {/* Thumbnail */}
            <div className="relative w-28 sm:w-36 aspect-4/3 rounded-xl overflow-hidden bg-slate-900 shrink-0">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-white/40 backdrop-blur-xs flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </div>
              <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] font-bold text-white uppercase">
                {item.type}
              </span>
            </div>

            {/* Content Details */}
            <div className="flex-1 min-w-0 space-y-1">
              <h3 className="font-bold text-xs sm:text-base text-slate-900 truncate group-hover:text-indigo-600">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium truncate flex items-center gap-1">
                {item.authorName}
                {item.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 inline shrink-0" />}
              </p>
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <CategoryIcon category={item.category} className="w-3 h-3 text-indigo-500" />
                <span>{item.category}</span>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-3 text-xs font-bold text-slate-600 pt-1">
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  {formatCompactNumber(item.likes)}
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Eye className="w-3.5 h-3.5 text-indigo-500" />
                  {formatCompactNumber(item.views)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTalents.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-2xs">
          <Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-800">{t.noTalentsFound}</h3>
          <p className="text-xs text-slate-500 mt-1">Try clearing your filters or searching for something else.</p>
        </div>
      )}
    </div>
  );
};
