import React, { useState } from 'react';
import { 
  Search, 
  Send, 
  MoreVertical, 
  Phone, 
  Video as VideoIcon, 
  ArrowLeft,
  CheckCheck,
  MessageSquare,
  Plus,
  X,
  Loader
} from 'lucide-react';
import { ChatThread, UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../api/client';

interface InboxViewProps {
  threads: ChatThread[];
  onSendMessage: (threadId: string, text: string) => void;
  onStartConversation: (contactId: string) => Promise<ChatThread | null>;
}

export const InboxView: React.FC<InboxViewProps> = ({ threads, onSendMessage, onStartConversation }) => {
  const { t, language } = useLanguage();
  const [activeThreadId, setActiveThreadId] = useState<string>(threads[0]?.id || '');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [newMessageOpen, setNewMessageOpen] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userResults, setUserResults] = useState<UserProfile[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [startingConv, setStartingConv] = useState(false);

  const activeThread = threads.find((tItem) => tItem.id === activeThreadId) || threads[0];

  const filteredThreads = threads.filter((tItem) =>
    tItem.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tItem.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectThread = (id: string) => {
    setActiveThreadId(id);
    setShowMobileChat(true);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThread) return;
    onSendMessage(activeThread.id, inputText.trim());
    setInputText('');
  };

  const openNewMessage = () => {
    setNewMessageOpen(true);
    setUserSearch('');
    setUserResults([]);
    setSearchingUsers(true);
    api.getUsers()
      .then((users) => setUserResults(users))
      .catch(() => setUserResults([]))
      .finally(() => setSearchingUsers(false));
  };

  const runUserSearch = (q: string) => {
    setUserSearch(q);
    setSearchingUsers(true);
    api.getUsers(q.trim())
      .then((users) => setUserResults(users))
      .catch(() => setUserResults([]))
      .finally(() => setSearchingUsers(false));
  };

  const pickUser = async (contactId: string) => {
    if (startingConv) return;
    setStartingConv(true);
    const thread = await onStartConversation(contactId);
    setStartingConv(false);
    if (thread) {
      setActiveThreadId(thread.id);
      setNewMessageOpen(false);
      setShowMobileChat(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs overflow-hidden h-[80vh] flex flex-col md:flex-row">
        
        {/* Left Side: Threads List */}
        <div className={`w-full md:w-80 lg:w-96 border-r border-slate-100 flex flex-col shrink-0 ${
          showMobileChat ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              {t.inboxTitle}
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={openNewMessage}
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-full transition-colors cursor-pointer"
                aria-label={t.newMessage}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">{t.newMessage}</span>
              </button>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                {threads.reduce((acc, th) => acc + th.unreadCount, 0)} {t.newMessages}
              </span>
            </div>
          </div>

          {/* Search Box */}
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-slate-100 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Threads Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {filteredThreads.map((thread) => {
              const isActive = thread.id === activeThreadId;
              return (
                <button
                  key={thread.id}
                  onClick={() => handleSelectThread(thread.id)}
                  className={`w-full p-3.5 sm:p-4 flex items-center gap-3 text-left transition-colors cursor-pointer ${
                    isActive ? 'bg-indigo-50/70 border-l-4 border-indigo-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={thread.contact.avatar}
                      alt={thread.contact.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100"
                    />
                    {thread.contact.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs sm:text-sm font-bold truncate ${isActive ? 'text-indigo-900' : 'text-slate-900'}`}>
                        {thread.contact.name}
                      </h4>
                      <span className="text-[10px] sm:text-[11px] text-slate-400 shrink-0">
                        {thread.timestamp}
                      </span>
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${
                      thread.unreadCount > 0 ? 'text-slate-900 font-bold' : 'text-slate-500'
                    }`}>
                      {thread.lastMessage}
                    </p>
                  </div>

                  {thread.unreadCount > 0 && (
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Chat Box */}
        {activeThread ? (
          <div className={`flex-1 flex flex-col bg-slate-50/50 ${
            !showMobileChat ? 'hidden md:flex' : 'flex'
          }`}>
            {/* Chat Top Bar */}
            <div className="p-3.5 sm:p-4 border-b border-slate-100 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Mobile Back Button */}
                <button
                  onClick={() => setShowMobileChat(false)}
                  className="md:hidden p-1.5 rounded-xl hover:bg-slate-100 text-slate-600"
                  aria-label="Back to threads"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="relative">
                  <img
                    src={activeThread.contact.avatar}
                    alt={activeThread.contact.name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  {activeThread.contact.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                    {activeThread.contact.name}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {activeThread.contact.online ? t.activeNow : t.offline} • {activeThread.contact.location || 'Bangladesh'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-slate-500">
                <button className="p-2 rounded-full hover:bg-slate-100 hover:text-indigo-600 transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-full hover:bg-slate-100 hover:text-indigo-600 transition-colors">
                  <VideoIcon className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className="text-center">
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 bg-white/90 px-3 py-1 rounded-full border border-slate-100">
                  {t.today}
                </span>
              </div>

              {activeThread.messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <img
                        src={activeThread.contact.avatar}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover shrink-0 mb-1"
                      />
                    )}
                    <div
                      className={`max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                        isUser
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-white text-slate-900 border border-slate-100 rounded-bl-none'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <div
                        className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${
                          isUser ? 'text-indigo-200' : 'text-slate-400'
                        }`}
                      >
                        <span>{msg.timestamp}</span>
                        {isUser && <CheckCheck className="w-3 h-3 text-indigo-200" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t.typeMessage}
                className="flex-1 bg-slate-100 text-xs sm:text-sm text-slate-900 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white flex items-center justify-center shrink-0 shadow-xs shadow-indigo-600/30 active:scale-95 transition-all"
              >
                <Send className="w-4 h-4 fill-current ml-0.5" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400">
            <MessageSquare className="w-12 h-12 text-slate-300 mb-2" />
            <p className="text-xs sm:text-sm font-medium">{t.selectConversation}</p>
          </div>
        )}
      </div>

      {/* New Message Modal */}
      {newMessageOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md flex flex-col max-h-[85vh] overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                {t.newMessage}
              </h3>
              <button
                onClick={() => setNewMessageOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={userSearch}
                  onChange={(e) => runUserSearch(e.target.value)}
                  placeholder={t.searchPeople}
                  className="w-full bg-slate-100 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
              {searchingUsers && (
                <div className="flex items-center justify-center py-10 text-slate-400">
                  <Loader className="w-5 h-5 animate-spin" />
                </div>
              )}
              {!searchingUsers && userResults.length === 0 && (
                <div className="py-10 text-center text-xs sm:text-sm text-slate-400 font-medium">
                  {t.noUsersFound}
                </div>
              )}
              {!searchingUsers &&
                userResults.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => pickUser(user.id)}
                    disabled={startingConv}
                    className="w-full p-3 flex items-center gap-3 text-left hover:bg-indigo-50/60 transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{user.name}</h4>
                      <p className="text-[11px] text-slate-400 truncate">
                        {user.handle} {user.location ? `• ${user.location}` : ''}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full shrink-0">
                      {t.startConversation}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
