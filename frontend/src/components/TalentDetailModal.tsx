import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Heart, 
  Eye, 
  MessageCircle, 
  ThumbsUp, 
  Share2, 
  Send, 
  Bookmark, 
  Clock, 
  ArrowLeft
} from 'lucide-react';
import { TalentItem, Comment } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { AudioWaveformCard } from './AudioWaveformCard';
import { formatCompactNumber, fireVoteConfetti } from '../utils/confetti';
import { resolveMediaUrl } from '../api/client';
import { useLanguage } from '../context/LanguageContext';

interface TalentDetailModalProps {
  talent: TalentItem | null;
  onClose: () => void;
  comments: Comment[];
  onAddComment: (talentId: string, text: string) => void;
  onToggleLikeComment: (commentId: string) => void;
  onToggleLikeTalent: (talentId: string) => void;
  onToggleVoteTalent: (talentId: string) => void;
  onToggleSaveTalent: (talentId: string) => void;
  onShare: (talent: TalentItem) => void;
  onSelectAuthor: (talent: TalentItem) => void;
}

export const TalentDetailModal: React.FC<TalentDetailModalProps> = ({
  talent,
  onClose,
  comments,
  onAddComment,
  onToggleLikeComment,
  onToggleLikeTalent,
  onToggleVoteTalent,
  onToggleSaveTalent,
  onShare,
  onSelectAuthor
}) => {
  const { t, language } = useLanguage();
  const [commentInput, setCommentInput] = useState('');

  if (!talent) return null;

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(talent.id, commentInput.trim());
    setCommentInput('');
  };

  const handleVote = () => {
    onToggleVoteTalent(talent.id);
    if (!talent.isVoted) {
      fireVoteConfetti();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div 
        id="talent-detail-modal"
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Top Bar */}
        <div className="px-4 sm:px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h2 className="font-extrabold text-sm sm:text-base text-slate-900 truncate max-w-xs sm:max-w-md">
                {talent.title}
              </h2>
              <p className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
                <CategoryIcon category={talent.category} className="w-3 h-3" />
                {talent.category} • {talent.type.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onToggleSaveTalent(talent.id)}
              className={`p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition-colors ${
                talent.isSaved ? 'text-indigo-600 fill-indigo-600' : ''
              }`}
              title={talent.isSaved ? t.saved : t.save}
            >
              <Bookmark className={`w-5 h-5 ${talent.isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* 1. Media Presentation Area */}
          {talent.type === 'video' && (
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
              <video
                src={resolveMediaUrl(talent.contentUrl)}
                poster={talent.thumbnail}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {talent.type === 'audio' && (
            <div className="w-full">
              <AudioWaveformCard
                trackId={talent.id}
                durationStr={talent.audioDuration || '4:47'}
                bars={talent.audioWaveform}
                variant="detail"
                src={resolveMediaUrl(talent.contentUrl)}
              />
            </div>
          )}

          {talent.type === 'text' && talent.poemText && (
            <div className="w-full bg-stone-50/90 border border-stone-200/90 rounded-2xl p-5 sm:p-8 shadow-inner">
              <div className="max-w-xl mx-auto text-center space-y-3">
                <h3 className="font-bangla text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                  {talent.title}
                </h3>
                <div className="font-bangla text-base sm:text-lg text-slate-800 leading-relaxed italic space-y-2">
                  {talent.poemText.map((line, idx) => (
                    <p key={idx} className={line === '' ? 'h-3' : ''}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. Title, Rank Badge, and Creator Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900">
                  {talent.title}
                </h1>
                {talent.authorRank && (
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-extrabold text-xs shadow-2xs">
                    #{talent.authorRank}
                  </span>
                )}
              </div>

              {/* Creator Info */}
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 mt-1">
                <span className="text-slate-400 font-medium">By</span>
                <button
                  onClick={() => onSelectAuthor(talent)}
                  className="font-bold text-slate-900 hover:text-indigo-600 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {talent.authorName}
                  {talent.isVerified && <CheckCircle2 className="w-4 h-4 text-indigo-600 fill-indigo-100" />}
                </button>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  {talent.createdAt}
                </span>
              </div>
            </div>

            {/* Live Stats Row */}
            <div className="flex items-center gap-4 text-xs sm:text-sm font-bold text-slate-700 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-rose-600">
                <Heart className={`w-4 h-4 ${talent.isLiked ? 'fill-current' : ''}`} />
                <span>{formatCompactNumber(talent.likes)}</span>
                <span className="text-xs text-slate-400 font-normal">{t.like}</span>
              </div>
              <div className="w-px h-4 bg-slate-200" />
              <div className="flex items-center gap-1.5 text-indigo-600">
                <Eye className="w-4 h-4" />
                <span>{formatCompactNumber(talent.views)}</span>
                <span className="text-xs text-slate-400 font-normal">{t.views}</span>
              </div>
              <div className="w-px h-4 bg-slate-200" />
              <div className="flex items-center gap-1.5 text-slate-600">
                <MessageCircle className="w-4 h-4" />
                <span>{formatCompactNumber(talent.commentsCount)}</span>
                <span className="text-xs text-slate-400 font-normal">{t.comments}</span>
              </div>
            </div>
          </div>

          {/* 3. Description */}
          <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-100">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              {talent.description}
            </p>
            {talent.tags && talent.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {talent.tags.map((tag) => (
                  <span key={tag} className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 4. Action Buttons */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <button
              onClick={handleVote}
              className={`flex items-center justify-center gap-2 py-3 sm:py-3.5 rounded-2xl font-extrabold text-xs sm:text-sm shadow-xs transition-all active:scale-98 cursor-pointer ${
                talent.isVoted
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-600/20'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 sm:w-5 sm:h-5 ${talent.isVoted ? 'fill-current' : ''}`} />
              {talent.isVoted ? `${t.voted} (${formatCompactNumber(talent.votes)})` : `${t.vote} (${formatCompactNumber(talent.votes)})`}
            </button>

            <button
              onClick={() => onShare(talent)}
              className="flex items-center justify-center gap-2 py-3 sm:py-3.5 rounded-2xl font-bold text-xs sm:text-sm bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
              {t.share}
            </button>
          </div>

          {/* 5. Comments Section */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                {t.comments} ({comments.length || formatCompactNumber(talent.commentsCount)})
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                {language === 'bn' ? 'কমিউনিটি প্রতিক্রিয়া' : 'Community Discussions'}
              </span>
            </div>

            {/* Comments List */}
            <div className="space-y-3">
              {comments.map((comment) => (
                <div 
                  key={comment.id}
                  className="bg-slate-50/80 rounded-2xl p-3.5 sm:p-4 border border-slate-100 space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={comment.authorAvatar}
                        alt={comment.authorName}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-slate-900">
                          {comment.authorName}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-2">
                          {comment.createdAt}
                        </span>
                      </div>
                    </div>

                    {/* Comment Like */}
                    <button
                      onClick={() => onToggleLikeComment(comment.id)}
                      className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full transition-colors ${
                        comment.isLiked ? 'text-rose-600 bg-rose-50' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${comment.isLiked ? 'fill-current' : ''}`} />
                      <span>{comment.likes}</span>
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-800 pl-10 leading-relaxed font-normal">
                    {comment.text}
                  </p>
                </div>
              ))}

              {comments.length === 0 && (
                <div className="text-center py-6 text-xs text-slate-400">
                  {language === 'bn' ? 'এখনো কোনো মন্তব্য নেই। প্রথম মন্তব্যটি আপনি করুন!' : 'No comments yet. Be the first to share your thoughts!'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Comment Input Box */}
        <form onSubmit={handleSendComment} className="p-3 sm:p-4 bg-white border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder={t.writeCommentPlaceholder}
            className="flex-1 bg-slate-100 text-slate-900 text-xs sm:text-sm rounded-full px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!commentInput.trim()}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white flex items-center justify-center shrink-0 shadow-xs shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
          >
            <Send className="w-4 h-4 fill-current ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
