import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  Music, 
  Video, 
  Type, 
  Send, 
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { TalentType, Category, TalentItem, UserProfile } from '../types';
import { fireSuccessConfetti } from '../utils/confetti';
import { captureVideoThumbnail } from '../utils/videoThumbnail';
import { getMediaDuration } from '../utils/mediaDuration';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../api/client';

interface UploadTalentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newTalent: TalentItem, savedToServer?: boolean, serverUser?: UserProfile) => void;
  currentUserName: string;
  currentUserAvatar: string;
}

export const UploadTalentModal: React.FC<UploadTalentModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
  currentUserName,
  currentUserAvatar
}) => {
  const { t, language } = useLanguage();
  const [selectedType, setSelectedType] = useState<TalentType>('video');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Singing');
  const [description, setDescription] = useState('');
  const [poemContent, setPoemContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [capturedThumb, setCapturedThumb] = useState<string | null>(null);
  const [capturedDuration, setCapturedDuration] = useState<string | null>(null);
  const [isCapturingThumb, setIsCapturingThumb] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const categoriesList: { name: Category; label: string }[] = [
    { name: 'Singing', label: t.catSinging },
    { name: 'Dancing', label: t.catDancing },
    { name: 'Art', label: t.catArt },
    { name: 'Poetry', label: t.catPoetry },
    { name: 'Instrumental', label: t.catInstrumental },
    { name: 'Comedy', label: t.catComedy },
    { name: 'Others', label: t.catOthers }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Grab a real frame from the video so the post thumbnail is the
      // user's own content, not a stock placeholder. Never blocks upload.
      if (selectedType === 'video') {
        setCapturedThumb(null);
        setCapturedDuration(null);
        setIsCapturingThumb(true);
        captureVideoThumbnail(file)
          .then((thumb) => setCapturedThumb(thumb))
          .finally(() => setIsCapturingThumb(false));
      } else if (selectedType === 'audio') {
        setCapturedThumb(null);
        setCapturedDuration(null);
        // Read the real duration instead of showing a hardcoded '3:30'.
        getMediaDuration(file).then((d) => setCapturedDuration(d));
      } else {
        setCapturedThumb(null);
        setCapturedDuration(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে প্রতিভার একটি শিরোনাম দিন' : 'Please provide a talent title');
      return;
    }
    if (!description.trim()) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে একটি সংক্ষিপ্ত বিবরণ লিখুন' : 'Please write a brief description');
      return;
    }
    if (selectedType === 'text' && !poemContent.trim()) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে আপনার কবিতা বা গল্পের লেখা লিখুন' : 'Please enter your written poetry or story content');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const poemLines = selectedType === 'text' ? poemContent.split('\n') : undefined;
    // In-memory preview of the user's own file for this session.
    const localPreviewUrl =
      selectedFile && selectedType !== 'text' ? URL.createObjectURL(selectedFile) : undefined;

    try {
      // 1. Upload the real file first so the post survives reload.
      // (Blob URLs die on refresh; the server rejects them for contentUrl.)
      let uploadedUrl: string | undefined;
      if (selectedFile && selectedType !== 'text') {
        const up = await api.uploadFile(selectedFile);
        uploadedUrl = up.url;
      }
      // 2. Save to MySQL via the backend (author is taken from the JWT).
      const { talent, user } = await api.createTalent({
        title: title.trim(),
        type: selectedType,
        category,
        description: description.trim(),
        poemText: poemLines,
        tags: [category, 'CommunityShowcase'],
        createdLabel: language === 'bn' ? 'এইমাত্র' : 'Just now',
        thumbnail:
          selectedType === 'video' && capturedThumb ? capturedThumb : undefined,
        contentUrl: uploadedUrl,
        audioDuration:
          selectedType === 'audio' && capturedDuration ? capturedDuration : undefined,
      });

      onUploadSuccess(
        {
          ...talent,
          // Prefer the frame grabbed from the user's own file so the feed
          // shows it immediately even before a refetch.
          thumbnail:
            selectedType === 'video' && capturedThumb
              ? capturedThumb
              : talent.thumbnail,
          // Server-persisted file URL first (reload-safe); local blob only
          // as a fallback when the server returned nothing playable.
          contentUrl: talent.contentUrl || localPreviewUrl,
          audioDuration:
            selectedType === 'audio'
              ? capturedDuration || talent.audioDuration
              : talent.audioDuration,
          audioWaveform:
            selectedType === 'audio'
              ? [30, 50, 80, 95, 60, 40, 70, 90, 80, 60, 40, 75, 90, 65, 45, 30]
              : talent.audioWaveform
        },
        true,
        user
      );
    } catch {
      // Backend unreachable — fall back to a local-only mock post.
      const newTalent: TalentItem = {
        id: `talent-${Date.now()}`,
        title: title.trim(),
        type: selectedType,
        category: category,
        authorName: currentUserName,
        authorHandle: `@${currentUserName.toLowerCase().replace(/\s+/g, '')}`,
        authorAvatar: currentUserAvatar,
        authorLocation: 'Dhaka, Bangladesh',
        authorRank: 4,
        isVerified: true,
        createdAt: language === 'bn' ? 'এইমাত্র' : 'Just Now',
        likes: 0,
        views: 0,
        commentsCount: 0,
        votes: 0,
        description: description.trim(),
        thumbnail:
          selectedType === 'video' && capturedThumb
            ? capturedThumb
            : selectedType === 'text'
            ? 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80'
            : selectedType === 'audio'
            ? 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
        contentUrl:
          localPreviewUrl ||
          (selectedType === 'video'
            ? 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4'
            : undefined),
        poemText: poemLines,
        audioDuration: selectedType === 'audio' ? capturedDuration || undefined : undefined,
        audioWaveform: selectedType === 'audio' ? [30, 50, 80, 95, 60, 40, 70, 90, 80, 60, 40, 75, 90, 65, 45, 30] : undefined,
        isLiked: false,
        isVoted: false,
        isSaved: false,
        tags: [category, 'CommunityShowcase']
      };

      onUploadSuccess(newTalent, false);
    }

    fireSuccessConfetti();
    setIsSubmitting(false);
    // Reset the form so the next post starts fresh
    setTitle('');
    setDescription('');
    setPoemContent('');
    setSelectedFile(null);
    setCapturedThumb(null);
    setCapturedDuration(null);
    setSelectedType('video');
    setCategory('Singing');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        id="upload-talent-modal"
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[94vh]"
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="font-extrabold text-base sm:text-lg text-slate-900">
              {t.uploadModalTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Select Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              {t.selectType}
            </label>
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {/* Audio Card */}
              <button
                type="button"
                onClick={() => setSelectedType('audio')}
                className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedType === 'audio'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-2xs shadow-indigo-600/10'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className={`p-2 rounded-xl mb-1.5 ${
                  selectedType === 'audio' ? 'bg-indigo-600 text-white' : 'bg-rose-50 text-rose-500'
                }`}>
                  <Music className="w-5 h-5" />
                </div>
                <span className="font-bold text-xs sm:text-sm">{t.audio}</span>
              </button>

              {/* Video Card */}
              <button
                type="button"
                onClick={() => setSelectedType('video')}
                className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedType === 'video'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-2xs shadow-indigo-600/10'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className={`p-2 rounded-xl mb-1.5 ${
                  selectedType === 'video' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'
                }`}>
                  <Video className="w-5 h-5" />
                </div>
                <span className="font-bold text-xs sm:text-sm">{t.video}</span>
              </button>

              {/* Text Card */}
              <button
                type="button"
                onClick={() => setSelectedType('text')}
                className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedType === 'text'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-2xs shadow-indigo-600/10'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className={`p-2 rounded-xl mb-1.5 ${
                  selectedType === 'text' ? 'bg-indigo-600 text-white' : 'bg-purple-50 text-purple-600'
                }`}>
                  <Type className="w-5 h-5" />
                </div>
                <span className="font-bold text-xs sm:text-sm">{t.text}</span>
              </button>
            </div>
          </div>

          {/* 2. Talent Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              {t.talentTitleLabel}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.talentTitlePlaceholder}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* 3. Category Select */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              {t.categoryLabel}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all cursor-pointer"
            >
              {categoriesList.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              {t.descriptionLabel}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.descriptionPlaceholder}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* 5. Media Upload Dropzone / Poem Editor */}
          {selectedType === 'text' ? (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                {t.poemContentLabel}
              </label>
              <textarea
                rows={5}
                value={poemContent}
                onChange={(e) => setPoemContent(e.target.value)}
                placeholder={t.poemContentPlaceholder}
                className="w-full bg-stone-50/70 border border-stone-200 rounded-xl p-4 text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none leading-relaxed transition-all placeholder:text-slate-400"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                {selectedType === 'video' ? t.uploadVideoLabel : t.uploadAudioLabel}
              </label>
              <label className="relative flex flex-col items-center justify-center p-6 sm:p-8 border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl bg-slate-50/70 hover:bg-indigo-50/20 cursor-pointer transition-all group">
                <input
                  type="file"
                  accept={selectedType === 'video' ? 'video/mp4,video/webm,video/quicktime' : 'audio/mp3,audio/wav,audio/ogg,audio/mp4,audio/x-m4a'}
                  onChange={handleFileChange}
                  className="sr-only"
                />
                <div className="p-3 rounded-full bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform mb-2">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  {selectedFile ? selectedFile.name : (selectedType === 'video' ? t.uploadVideoLabel : t.uploadAudioLabel)}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  {t.mediaFormatHint}
                </span>
              </label>
              {/* Auto-captured video frame preview */}
              {selectedType === 'audio' && capturedDuration && (
                <div className="mt-2.5 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                  <span className="text-[11px] font-semibold text-slate-500">
                    {language === 'bn' ? `অডিওর দৈর্ঘ্য: ${capturedDuration}` : `Audio length: ${capturedDuration}`}
                  </span>
                </div>
              )}
              {selectedType === 'video' && (isCapturingThumb || capturedThumb) && (
                <div className="mt-2.5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2.5">
                  {isCapturingThumb ? (
                    <>
                      <div className="w-16 h-10 shrink-0 rounded-lg bg-slate-100 animate-pulse" />
                      <span className="text-[11px] font-semibold text-slate-500">
                        {language === 'bn' ? 'ভিডিও থেকে থাম্বনেইল তৈরি হচ্ছে…' : 'Grabbing a thumbnail from your video…'}
                      </span>
                    </>
                  ) : (
                    capturedThumb && (
                      <>
                        <img
                          src={capturedThumb}
                          alt="Video thumbnail preview"
                          className="w-16 h-10 shrink-0 rounded-lg object-cover ring-1 ring-slate-200"
                        />
                        <span className="text-[11px] font-semibold text-slate-500">
                          {language === 'bn' ? 'আপনার ভিডিও থেকে থাম্বনেইল' : 'Thumbnail captured from your video'}
                        </span>
                      </>
                    )
                  )}
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 sm:py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-sm sm:text-base shadow-xs shadow-indigo-600/30 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Publishing Showcase...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{t.submitBtn}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
