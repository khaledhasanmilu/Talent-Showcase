import React, { useState } from 'react';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  BadgeCheck, 
  Users, 
  Mic, 
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { fireSuccessConfetti } from '../utils/confetti';
import { useLanguage } from '../context/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (name: string, email: string) => void;
  initialMode?: 'splash' | 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const { t, language } = useLanguage();
  const [accountType, setAccountType] = useState<'creator' | 'audience'>('creator');
  
  // Register form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError(language === 'bn' ? 'অনুগ্রহ করে আপনার পুরো নাম লিখুন' : 'Please enter your full name');
      return;
    }
    if (!registerEmail.trim()) {
      setError(language === 'bn' ? 'অনুগ্রহ করে আপনার ইমেইল বা ব্যবহারকারী নাম লিখুন' : 'Please enter your email or username');
      return;
    }
    if (registerPassword.length < 6) {
      setError(language === 'bn' ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' : 'Password must be at least 6 characters');
      return;
    }
    if (registerPassword !== confirmPassword) {
      setError(language === 'bn' ? 'পাসওয়ার্ড দুটি মিলছে না' : 'Passwords do not match');
      return;
    }

    fireSuccessConfetti();
    onLoginSuccess(`${firstName} ${lastName}`.trim(), registerEmail);
    onClose();
  };

  const handleSocialSignUp = (provider: 'Google' | 'Facebook') => {
    fireSuccessConfetti();
    onLoginSuccess(
      provider === 'Google' ? 'Sadia Rahman' : 'Tanvir Hasan',
      `creator.${provider.toLowerCase()}@talentshowcase.app`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        id="auth-signup-modal"
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="text-center space-y-1 pt-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold mb-1">
              <BadgeCheck className="w-3.5 h-3.5" />
              <span>{t.authBadge || 'Creator Community'}</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
              {t.createAccount}
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500">
              {t.toShowcaseTalent}
            </p>
          </div>

          {/* Account Type Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {t.accountType || 'Select Account Type'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAccountType('creator')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  accountType === 'creator'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-100'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold flex items-center gap-1"><Mic className="w-3.5 h-3.5 text-indigo-600" /> {language === 'bn' ? 'শিল্পী / ক্রিয়েটর' : 'Creator'}</span>
                  {accountType === 'creator' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                </div>
                <p className="text-[10px] text-slate-500 leading-snug">
                  {language === 'bn' ? 'প্রতিভা প্রকাশ ও শেয়ার করতে' : 'Share audio, video & poems'}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setAccountType('audience')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  accountType === 'audience'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-100'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold flex items-center gap-1"><Users className="w-3.5 h-3.5 text-indigo-600" /> {language === 'bn' ? 'দর্শক ও বিচারক' : 'Audience'}</span>
                  {accountType === 'audience' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                </div>
                <p className="text-[10px] text-slate-500 leading-snug">
                  {language === 'bn' ? 'উপভোগ ও ভোট প্রদান করতে' : 'Watch, vote & support'}
                </p>
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  {t.firstName}
                </label>
                <input
                  type="text"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={language === 'bn' ? 'নামের প্রথম অংশ' : 'First name'}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  {t.lastName}
                </label>
                <input
                  type="text"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={language === 'bn' ? 'নামের শেষ অংশ' : 'Last name'}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                {t.emailOrUsername}
              </label>
              <div className="relative">
                <input
                  type="text"
                  autoComplete="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                  required
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  {t.password}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3.5 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  {t.confirmPassword}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3.5 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                    required
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="agree-terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="agree-terms" className="text-xs text-slate-600 font-medium cursor-pointer">
                {language === 'bn' 
                  ? 'আমি প্ল্যাটফর্মের নিয়মাবলী ও শর্তাবলীতে সম্মত' 
                  : 'I agree to the Community Guidelines and Terms'}
              </label>
            </div>

            {/* Register Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm sm:text-base shadow-md shadow-indigo-600/25 active:scale-98 transition-all mt-2 cursor-pointer flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>{t.register || t.signUp}</span>
            </button>
          </form>

          {/* Social Sign Up Options */}
          <div className="relative flex items-center justify-center pt-1">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase">
              {t.orContinueWith || 'or'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleSocialSignUp('Google')}
              className="py-2.5 px-3 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialSignUp('Facebook')}
              className="py-2.5 px-3 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
            >
              <div className="w-3.5 h-3.5 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-[9px] font-black shrink-0">
                f
              </div>
              <span>Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
