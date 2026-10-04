import React, { useState } from 'react';
import { 
  Heart, 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Play, 
  CheckCircle2, 
  Volume2,
  Video,
  FileText,
  Clock
} from 'lucide-react';
import { TalentItem } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { AudioWaveformCard } from './AudioWaveformCard';
import { formatCompactNumber, fireVoteConfetti } from '../utils/confetti';
import { resolveMediaUrl } from '../api/client';
import { useLanguage } from '../context/LanguageContext';

interface TalentCardProps {
  talent: TalentItem;
  onSelectTalent: (talent: TalentItem) => void;
  onSelectAuthor: (talent: TalentItem) => void;
  onToggleLike: (id: string) => void;
  onToggleVote: (id: string) => void;
  onToggleSave: (id: string) => void;
  onOpenComments: (talent: TalentItem) => void;
  onShare: (talent: TalentItem) => void;
}

export const TalentCard: React.FC<TalentCardProps> = ({
  talent,
  onSelectTalent,
  onSelectAuthor,
  onToggleLike,
  onToggleVote,
  onToggleSave,
  onOpenComments,
  onShare
}) => {
  const { t, language } = useLanguage();

  const handleVote = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleVote(talent.id);
    if (!talent.isVoted) {
      fireVoteConfetti();
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleLike(talent.id);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSave(talent.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare(talent);
  };

  const handleComments = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenComments(talent);
  };

  return (
    <article 
      id={`talent-card-${talent.id}`}
      className="bg-white rounded-3xl border border-slate-100/90 shadow-2xs hover:shadow-md hover:border-indigo-100 transition-all duration-200 overflow-hidden flex flex-col"
    >
      {/* Card Header: Creator Info */}
      <div className="p-4 sm:p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onSelectAuthor(talent)}
            className="relative group focus:outline-none shrink-0"
          >
            <img
              src={talent.authorAvatar}
              alt={talent.authorName}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-indigo-50 group-hover:ring-indigo-300 transition-all"
            />
            {talent.authorRank && (
              <span className="absolute -bottom-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full ring-2 ring-white">
                #{talent.authorRank}
              </span>
            )}
          </button>

          <div>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => onSelectAuthor(talent)}
                className="font-bold text-sm sm:text-base text-slate-900 hover:text-indigo-600 transition-colors text-left"
              >
                {talent.authorName}
              </button>
              {talent.isVerified && (
                <CheckCircle2 className="w-4 h-4 text-indigo-600 fill-indigo-100 shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {talent.createdAt}
              </span>
              <span>•</span>
              <span className="font-semibold text-indigo-600 flex items-center gap-1">
                <CategoryIcon category={talent.category} className="w-3 h-3" />
                {talent.category}
              </span>
            </div>
          </div>
        </div>

        {/* Talent Type Pill & Save */}
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
            talent.type === 'video'
              ? 'bg-rose-50 text-rose-600 border border-rose-100'
              : talent.type === 'audio'
              ? 'bg-purple-50 text-purple-600 border border-purple-100'
              : 'bg-amber-50 text-amber-700 border border-amber-100'
          }`}>
            {talent.type === 'video' && <Video className="w-3 h-3" />}
            {talent.type === 'audio' && <Volume2 className="w-3 h-3" />}
            {talent.type === 'text' && <FileText className="w-3 h-3" />}
            {talent.type === 'video' ? t.video : talent.type === 'audio' ? t.audio : t.text}
          </span>
          <button 
            onClick={handleSave}
            className={`p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-colors ${
              talent.isSaved ? 'text-indigo-600' : ''
            }`}
            title={talent.isSaved ? t.saved : t.save}
          >
            <Bookmark className={`w-4 h-4 ${talent.isSaved ? 'fill-indigo-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Talent Title & Snippet */}
      <div className="px-4 sm:px-5 pb-3">
        <h3 
          onClick={() => onSelectTalent(talent)}
          className="font-extrabold text-base sm:text-lg text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors leading-snug"
        >
          {talent.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-2 leading-relaxed font-normal">
          {talent.description}
        </p>
      </div>

      {/* Media Content Preview */}
      <div className="px-4 sm:px-5 pb-3">
        {talent.type === 'video' && (
          <div 
            onClick={() => onSelectTalent(talent)}
            className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 group cursor-pointer shadow-inner"
          >
            <img
              src={talent.thumbnail}
              alt={talent.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-center justify-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/30 backdrop-blur-md border border-white/60 flex items-center justify-center text-white shadow-xl group-hover:scale-110 group-hover:bg-indigo-600/90 group-hover:border-indigo-400 transition-all duration-300">
                <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current ml-0.5" />
              </div>
            </div>
            
            {/* Video overlay bar */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] sm:text-xs font-bold drop-shadow-md">
              <span className="bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                {t.watchFullVideo}
              </span>
              <span className="bg-indigo-600/85 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                {formatCompactNumber(talent.views)} {t.views}
              </span>
            </div>
          </div>
        )}

        {talent.type === 'audio' && (
          <div className="w-full">
            <AudioWaveformCard
              trackId={talent.id}
              durationStr={talent.audioDuration || '4:47'}
              bars={talent.audioWaveform}
              variant="feed"
              src={resolveMediaUrl(talent.contentUrl)}
            />
          </div>
        )}

        {talent.type === 'text' && talent.poemText && (
          <div 
            onClick={() => onSelectTalent(talent)}
            className="w-full bg-gradient-to-br from-amber-50/40 via-stone-50 to-indigo-50/25 border border-stone-200/80 rounded-2xl p-5 sm:p-6 cursor-pointer hover:border-indigo-200 transition-colors"
          >
            <div className="font-bangla text-base sm:text-lg text-slate-800 space-y-1.5 leading-relaxed italic text-center max-w-lg mx-auto py-2">
              {talent.poemText.slice(0, 4).map((line, idx) => (
                <p key={idx} className={line === '' ? 'h-2' : ''}>
                  {line}
                </p>
              ))}
              {talent.poemText.length > 4 && (
                <p className="text-xs text-indigo-600 font-sans not-italic font-bold pt-2">
                  ... {t.readPoem} ({talent.poemText.length} {t.lines})
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Bar (Likes, Votes, Comments, Share) */}
      <div className="px-4 sm:px-5 py-3 mt-auto border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-600">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              talent.isLiked
                ? 'text-rose-600 bg-rose-50'
                : 'hover:text-rose-600 hover:bg-slate-100'
            }`}
            title={t.like}
          >
            <Heart className={`w-4 h-4 ${talent.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{formatCompactNumber(talent.likes)}</span>
          </button>

          {/* Vote Button */}
          <button
            onClick={handleVote}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all ${
              talent.isVoted
                ? 'text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-2xs'
                : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
            }`}
            title={t.vote}
          >
            <ThumbsUp className={`w-4 h-4 ${talent.isVoted ? 'fill-current' : ''}`} />
            <span>{talent.isVoted ? t.voted : t.vote} ({formatCompactNumber(talent.votes)})</span>
          </button>

          {/* Comments Button */}
          <button
            onClick={handleComments}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:text-indigo-600 hover:bg-slate-100 transition-colors"
            title={t.comments}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{formatCompactNumber(talent.commentsCount)}</span>
          </button>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
          title={t.share}
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">{t.share}</span>
        </button>
      </div>
    </article>
  );
};
