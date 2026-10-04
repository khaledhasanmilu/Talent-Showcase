import React, { useEffect, useRef, useState } from 'react';
import { X, Camera, UploadCloud } from 'lucide-react';
import { UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { api, resolveMediaUrl } from '../api/client';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSaveProfile: (updated: Partial<UserProfile>) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile
}) => {
  const { t, language } = useLanguage();
  const [name, setName] = useState(currentUser.name);
  const [handle, setHandle] = useState(currentUser.handle);
  const [location, setLocation] = useState(currentUser.location);
  const [bio, setBio] = useState(currentUser.bio);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Refresh fields every time the modal opens (state persists while closed).
  useEffect(() => {
    if (isOpen) {
      setName(currentUser.name);
      setHandle(currentUser.handle);
      setLocation(currentUser.location);
      setBio(currentUser.bio);
      setAvatar(currentUser.avatar);
      setPreview(null);
      setAvatarError('');
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'
  ];

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setAvatarError('');
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const up = await api.uploadFile(file);
      setAvatar(up.url);
      setPreview(null);
    } catch {
      setPreview(null);
      setAvatarError(
        language === 'bn' ? 'ছবি আপলোড হয়নি, আবার চেষ্টা করুন' : 'Photo upload failed, try again'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      name,
      handle,
      location,
      bio,
      avatar
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-extrabold text-base sm:text-lg text-slate-900">{t.editProfile}</h2>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="relative">
              <img
                src={preview || resolveMediaUrl(avatar) || avatar}
                alt="Avatar preview"
                className="w-20 h-20 rounded-full object-cover ring-4 ring-indigo-50 shadow-md"
              />
              <button
                type="button"
                onClick={() => {
                  const currentIdx = presetAvatars.indexOf(avatar);
                  const next = presetAvatars[(currentIdx + 1) % presetAvatars.length];
                  setAvatar(next);
                }}
                className="absolute bottom-0 right-0 p-1.5 rounded-full bg-indigo-600 text-white shadow-xs hover:bg-indigo-700 cursor-pointer"
                title={language === 'bn' ? 'রেডিমেড ছবি বদলান' : 'Cycle preset avatars'}
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleAvatarFile}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              {uploading
                ? language === 'bn'
                  ? 'আপলোড হচ্ছে…'
                  : 'Uploading…'
                : language === 'bn'
                  ? 'নিজের ছবি আপলোড করুন'
                  : 'Upload your own photo'}
            </button>
            {avatarError && (
              <span className="text-[11px] font-semibold text-rose-600">{avatarError}</span>
            )}
            <span className="text-[11px] text-slate-400">
              {language === 'bn' ? 'ক্যামেরায় চাপলে রেডিমেড ছবি বদলাবে' : 'Camera cycles presets • Upload uses your photo'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              {t.fullName}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              {t.usernameHandle}
            </label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              {t.location}
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              {t.bio}
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs shadow-indigo-600/20 cursor-pointer"
            >
              {t.saveChanges}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
