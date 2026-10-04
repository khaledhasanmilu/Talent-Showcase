import React, { useEffect, useMemo, useState } from 'react';
import {
  Trophy,
  Crown,
  ThumbsUp,
  Heart,
  MessageCircle,
  Flame,
} from 'lucide-react';
import { LeaderboardUser, TalentItem } from '../types';
import { formatCompactNumber } from '../utils/confetti';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../api/client';
import { buildLeaderboardFromTalents, LeaderboardRange } from '../utils/leaderboard';

interface LeaderboardViewProps {
  leaderboard: LeaderboardUser[];
  talents?: TalentItem[];
  onSelectCreator?: (userName: string) => void;
  onSelectUser?: (user: LeaderboardUser) => void;
}

/** Compact engagement breakdown: votes (weighted most) • likes • comments. */
const EngagementBreakdown: React.FC<{ user: LeaderboardUser; light?: boolean }> = ({ user, light }) => (
  <div className={`flex items-center justify-center gap-2 text-[10px] sm:text-[11px] font-bold ${light ? 'text-amber-100/90' : 'text-slate-500'}`}>
    <span className="flex items-center gap-0.5" title="Votes (×10 pts)">
      <ThumbsUp className="w-3 h-3 text-indigo-500 fill-indigo-100" />
      {formatCompactNumber(user.votes)}
    </span>
    <span className="flex items-center gap-0.5" title="Likes (×2 pts)">
      <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
      {formatCompactNumber(user.likes)}
    </span>
    <span className="flex items-center gap-0.5" title="Comments (×5 pts)">
      <MessageCircle className="w-3 h-3 text-emerald-500" />
      {formatCompactNumber(user.comments ?? 0)}
    </span>
  </div>
);

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  leaderboard,
  talents = [],
  onSelectUser
}) => {
  const { t, language } = useLanguage();
  const [timeRange, setTimeRange] = useState<LeaderboardRange>('week');
  const [rangedBoard, setRangedBoard] = useState<LeaderboardUser[] | null>(null);
  const [loadingRange, setLoadingRange] = useState(false);

  // Time tabs actually re-rank: ask the server for that window, and fall
  // back to a local rebuild from the loaded feed when offline.
  useEffect(() => {
    if (timeRange === 'all') {
      setRangedBoard(null);
      return;
    }
    let cancelled = false;
    setLoadingRange(true);
    api
      .getLeaderboard(8, timeRange)
      .then((board) => {
        if (!cancelled) {
          setRangedBoard(board.length > 0 ? board : buildLeaderboardFromTalents(talents, timeRange));
        }
      })
      .catch(() => {
        if (!cancelled) setRangedBoard(buildLeaderboardFromTalents(talents, timeRange));
      })
      .finally(() => {
        if (!cancelled) setLoadingRange(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  // Keep the ranged board in sync when new talents arrive while offline-filtered.
  const visibleBoard = useMemo(() => {
    if (timeRange === 'all' || rangedBoard === null) {
      return timeRange === 'all' ? leaderboard : buildLeaderboardFromTalents(talents, timeRange);
    }
    return rangedBoard;
  }, [leaderboard, rangedBoard, talents, timeRange]);

  const top1 = visibleBoard.find((u) => u.rank === 1) || visibleBoard[0];
  const top2 = visibleBoard.find((u) => u.rank === 2) || visibleBoard[1];
  const top3 = visibleBoard.find((u) => u.rank === 3) || visibleBoard[2];
  const restList = visibleBoard.filter((u) => u.rank > 3);

  const tallyLabel =
    timeRange === 'week'
      ? language === 'bn'
        ? 'লাইভ সাপ্তাহিক গণনা'
        : 'Live Weekly Tally'
      : timeRange === 'month'
        ? language === 'bn'
          ? 'লাইভ মাসিক গণনা'
          : 'Live Monthly Tally'
        : language === 'bn'
          ? 'সর্বকালের গণনা'
          : 'All-Time Tally';

  const viewLabel = language === 'bn' ? 'প্রোফাইল দেখুন' : 'View Profile';

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header & Tabs */}
      <div className="text-center space-y-3 sm:space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold uppercase tracking-wider">
          <Trophy className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          {language === 'bn' ? 'হল অব ফেম' : 'Hall of Fame'}
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t.leaderboardTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          {t.leaderboardSubtitle}
        </p>
        {/* Scoring formula — rank comes from engagement on your own posts */}
        <p className="text-[11px] sm:text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full inline-block px-4 py-1.5">
          {language === 'bn'
            ? 'ভোট ×১০ + কমেন্ট ×৫ + লাইক ×২ = স্কোর'
            : 'Votes ×10 + Comments ×5 + Likes ×2 = Score'}
        </p>

        {/* Timeframe Navigation Tabs */}
        <div className="inline-flex p-1.5 bg-slate-200/70 rounded-2xl shadow-inner mt-2">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              timeRange === 'week'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.thisWeek}
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              timeRange === 'month'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.thisMonth}
          </button>
          <button
            onClick={() => setTimeRange('all')}
            className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              timeRange === 'all'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.allTime}
          </button>
        </div>
      </div>

      {/* Top 3 Podium (Direct translation from Figma mockup, optimized for mobile) */}
      <div className="bg-gradient-to-b from-indigo-50/80 via-white to-white rounded-3xl border border-indigo-100/80 p-4 sm:p-8 shadow-2xs">
        <div className="flex items-end justify-center gap-1.5 sm:gap-6 pt-4 pb-2">
          
          {/* Rank 2 (Silver) */}
          {top2 && (
            <div className="flex-1 flex flex-col items-center max-w-[140px] sm:max-w-[170px] group">
              <div className="relative mb-2">
                <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400 fill-slate-400 absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2 drop-shadow-xs" />
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden ring-3 sm:ring-4 ring-slate-300 shadow-md group-hover:scale-105 transition-transform">
                  <img
                    src={top2.avatar}
                    alt={top2.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-slate-500 text-white text-[10px] sm:text-xs font-black px-2 py-0.2 rounded-full ring-2 ring-white shadow-xs">
                  #2
                </span>
              </div>
              <div className="text-center mt-1 sm:mt-2 w-full">
                <button
                  onClick={() => onSelectUser?.(top2)}
                  className="font-bold text-xs sm:text-sm text-slate-900 truncate hover:text-indigo-600 transition-colors cursor-pointer max-w-full"
                >
                  {top2.name}
                </button>
                <div className="flex items-center justify-center gap-1 text-[11px] sm:text-xs text-slate-700 font-extrabold mt-0.5">
                  <Flame className="w-3 h-3 text-slate-400" />
                  {formatCompactNumber(top2.score)} {t.pts}
                </div>
                <EngagementBreakdown user={top2} />
                <button
                  onClick={() => onSelectUser?.(top2)}
                  className="mt-2 text-[10px] sm:text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 sm:px-3 py-1 rounded-full w-full transition-colors"
                >
                  {viewLabel}
                </button>
              </div>
            </div>
          )}

          {/* Rank 1 (Gold - Rahat Ahmed - Centered & Tallest) */}
          {top1 && (
            <div className="flex-1 flex flex-col items-center max-w-[160px] sm:max-w-[190px] -mt-6 group">
              <div className="relative mb-2">
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center justify-center animate-bounce">
                  <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500 fill-amber-400 drop-shadow-md" />
                </div>
                <div className="w-18 h-18 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-4 ring-amber-400 shadow-xl group-hover:scale-105 transition-transform">
                  <img
                    src={top1.avatar}
                    alt={top1.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[11px] sm:text-xs font-black px-2.5 py-0.5 rounded-full ring-2 ring-white shadow-md">
                  #1
                </span>
              </div>
              <div className="text-center mt-1 sm:mt-2 w-full">
                <button
                  onClick={() => onSelectUser?.(top1)}
                  className="font-extrabold text-xs sm:text-base text-slate-900 truncate hover:text-indigo-600 transition-colors cursor-pointer max-w-full"
                >
                  {top1.name}
                </button>
                <div className="flex items-center justify-center gap-1 text-xs sm:text-sm text-amber-600 font-extrabold mt-0.5">
                  <Flame className="w-3.5 h-3.5 fill-amber-500" />
                  {formatCompactNumber(top1.score)} {t.pts}
                </div>
                <EngagementBreakdown user={top1} />
                <button
                  onClick={() => onSelectUser?.(top1)}
                  className="mt-2 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 px-3 sm:px-4 py-1.5 rounded-full w-full shadow-xs shadow-indigo-600/30 active:scale-95 transition-all"
                >
                  {viewLabel}
                </button>
              </div>
            </div>
          )}

          {/* Rank 3 (Bronze) */}
          {top3 && (
            <div className="flex-1 flex flex-col items-center max-w-[140px] sm:max-w-[170px] group">
              <div className="relative mb-2">
                <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-amber-700 fill-amber-700 absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2 drop-shadow-xs" />
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden ring-3 sm:ring-4 ring-amber-600/70 shadow-md group-hover:scale-105 transition-transform">
                  <img
                    src={top3.avatar}
                    alt={top3.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-amber-700 text-white text-[10px] sm:text-xs font-black px-2 py-0.2 rounded-full ring-2 ring-white shadow-xs">
                  #3
                </span>
              </div>
              <div className="text-center mt-1 sm:mt-2 w-full">
                <button
                  onClick={() => onSelectUser?.(top3)}
                  className="font-bold text-xs sm:text-sm text-slate-900 truncate hover:text-indigo-600 transition-colors cursor-pointer max-w-full"
                >
                  {top3.name}
                </button>
                <div className="flex items-center justify-center gap-1 text-[11px] sm:text-xs text-slate-700 font-extrabold mt-0.5">
                  <Flame className="w-3 h-3 text-amber-600" />
                  {formatCompactNumber(top3.score)} {t.pts}
                </div>
                <EngagementBreakdown user={top3} />
                <button
                  onClick={() => onSelectUser?.(top3)}
                  className="mt-2 text-[10px] sm:text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 sm:px-3 py-1 rounded-full w-full transition-colors"
                >
                  {viewLabel}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ranks 4+ List Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900">
            {language === 'bn' ? 'র‌্যাঙ্কিং তালিকা (#৪ - #৮)' : 'Rankings List (#4 - #8)'}
          </h3>
          <span className="text-xs font-bold text-slate-400">
            {loadingRange ? (language === 'bn' ? 'লোড হচ্ছে…' : 'Loading…') : tallyLabel}
          </span>
        </div>

        <div className="divide-y divide-slate-50">
          {restList.map((user) => (
            <div
              key={user.id}
              className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-indigo-50/30 transition-colors"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="w-6 text-center font-extrabold text-sm sm:text-base text-slate-400">
                  {user.rank}
                </span>

                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
                />

                <div>
                  <button
                    onClick={() => onSelectUser?.(user)}
                    className="font-bold text-xs sm:text-sm text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer text-left"
                  >
                    {user.name}
                  </button>
                  <div className="text-[11px] sm:text-xs text-slate-400">
                    {user.category} • {user.talentCount} {t.showcases}
                  </div>
                  <EngagementBreakdown user={user} />
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-indigo-600">
                  <Flame className="w-3.5 h-3.5 fill-indigo-100" />
                  {formatCompactNumber(user.score)} {t.pts}
                </div>

                <button
                  onClick={() => onSelectUser?.(user)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  {viewLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
