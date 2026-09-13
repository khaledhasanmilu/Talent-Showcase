import React from 'react';
import { 
  X, 
  Bell, 
  Heart, 
  ThumbsUp, 
  UserPlus, 
  Trophy, 
  CheckCheck, 
  ArrowLeft 
} from 'lucide-react';
import { NotificationItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onNotificationClick: (notif: NotificationItem) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onNotificationClick
}) => {
  const { t, language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        id="notifications-modal"
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]"
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
            <h2 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-600" />
              {t.notifications}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              {t.markAllAsRead}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 divide-y divide-slate-50 space-y-1">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onNotificationClick(notif)}
              className={`p-3 sm:p-3.5 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all ${
                !notif.isRead
                  ? 'bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/80'
                  : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Notification Avatar / Icon */}
                <div className="relative shrink-0">
                  <img
                    src={notif.user.avatar}
                    alt={notif.user.name}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-slate-100"
                  />
                  <span className={`absolute -bottom-1 -right-1 p-1 rounded-full text-white ring-2 ring-white ${
                    notif.type === 'like'
                      ? 'bg-rose-500'
                      : notif.type === 'vote'
                      ? 'bg-indigo-600'
                      : notif.type === 'follow'
                      ? 'bg-blue-500'
                      : 'bg-amber-500'
                  }`}>
                    {notif.type === 'like' && <Heart className="w-2.5 h-2.5 fill-current" />}
                    {notif.type === 'vote' && <ThumbsUp className="w-2.5 h-2.5 fill-current" />}
                    {notif.type === 'follow' && <UserPlus className="w-2.5 h-2.5" />}
                    {notif.type === 'milestone' && <Trophy className="w-2.5 h-2.5 fill-current" />}
                  </span>
                </div>

                {/* Message Content */}
                <div className="space-y-0.5">
                  <p className="text-xs sm:text-sm text-slate-800 leading-snug">
                    <strong className="text-slate-900 font-bold">{notif.user.name}</strong>{' '}
                    {notif.message}{' '}
                    {notif.talentTitle && (
                      <span className="text-indigo-600 font-semibold">"{notif.talentTitle}"</span>
                    )}
                  </p>
                  <span className="text-[10px] sm:text-[11px] text-slate-400 block font-medium">
                    {notif.time}
                  </span>
                </div>
              </div>

              {!notif.isRead && (
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0" />
              )}
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs sm:text-sm font-medium">{t.noNotifications}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
