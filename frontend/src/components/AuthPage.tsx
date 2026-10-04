import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  BadgeCheck, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Trophy,
  Mic,
  Video,
  FileText,
  ShieldCheck,
  Globe,
  Palette
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { fireSuccessConfetti } from '../utils/confetti';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
  onAuthSuccess: (name: string, email: string) => void;
  onNavigateHome: () => void;
}

const demoAvatars = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
];

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onAuthSuccess,
  onNavigateHome
}) => {
  const { t, language, toggleLanguage } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Role selection
  const [role, setRole] = useState<'creator' | 'audience'>('creator');
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('khaled.hasan@uiu.ac.bd');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  
  // Register fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(demoAvatars[0]);
  const [agreeTerms, setAgreeTerms] = useState(true);
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setError(language === 'bn' ? 'দয়া করে আপনার ইমেইল বা ব্যবহারকারী নাম লিখুন' : 'Please enter your email or username');
      return;
    }
    if (!loginPassword.trim()) {
      setError(language === 'bn' ? 'দয়া করে আপনার পাসওয়ার্ড দিন' : 'Please enter your password');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      fireSuccessConfetti();
      const derivedName = loginEmail.includes('@')
        ? loginEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())
        : loginEmail;
      onAuthSuccess(derivedName, loginEmail);
    }, 600);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError(language === 'bn' ? 'অনুগ্রহ করে আপনার পুরো নাম প্রদান করুন' : 'Please provide your full name');
      return;
    }
    if (!registerEmail.trim()) {
      setError(language === 'bn' ? 'অনুগ্রহ করে সঠিক ইমেইল প্রদান করুন' : 'Please provide a valid email address');
      return;
    }
    if (registerPassword.length < 6) {
      setError(language === 'bn' ? 'পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে' : 'Password must be at least 6 characters long');
      return;
    }
    if (registerPassword !== confirmPassword) {
      setError(language === 'bn' ? 'উভয় পাসওয়ার্ড মেলেনি' : 'Passwords do not match');
      return;
    }
    if (!agreeTerms) {
      setError(language === 'bn' ? 'সেবা শর্তাবলীতে সম্মতি প্রদান করুন' : 'Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      fireSuccessConfetti();
      onAuthSuccess(`${firstName} ${lastName}`, registerEmail);
    }, 700);
  };

  const handleSocial = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      fireSuccessConfetti();
      onAuthSuccess('Khaled Hasan Milu', 'khaled.hasan@uiu.ac.bd');
    }, 400);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-linear-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Side: Brand & Showcase Showcase Banner (5 cols on Desktop) */}
        <div className="lg:col-span-5 bg-linear-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Ambient Backing */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-purple-400/20 blur-3xl pointer-events-none" />

          {/* Top Bar on Banner */}
          <div className="relative z-10 flex items-center justify-between">
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-xs px-3 py-1.5 rounded-full transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.backToHome}
            </button>

            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1 text-xs font-bold bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full transition-all text-white"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
            </button>
          </div>

          {/* Banner Middle Content */}
          <div className="relative z-10 py-10 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-indigo-100 text-xs font-bold uppercase tracking-wider border border-white/10">
              <BadgeCheck className="w-3.5 h-3.5" />
              {t.authBadge}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {t.authHeroTitle1} <br />
              <span className="text-indigo-200">{t.authHeroTitle2}</span>
            </h1>

            <p className="text-sm text-indigo-100/90 leading-relaxed font-medium">
              {t.authHeroSubtitle}
            </p>

            {/* Feature Badges */}
            <div className="grid grid-cols-3 gap-2.5 pt-4">
              <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-2xl p-3 text-center">
                <Mic className="w-5 h-5 mx-auto mb-1 text-indigo-200" />
                <span className="text-[11px] font-bold block">{t.audio}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-2xl p-3 text-center">
                <Video className="w-5 h-5 mx-auto mb-1 text-indigo-200" />
                <span className="text-[11px] font-bold block">{t.video}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-2xl p-3 text-center">
                <FileText className="w-5 h-5 mx-auto mb-1 text-indigo-200" />
                <span className="text-[11px] font-bold block">{t.text}</span>
              </div>
            </div>
          </div>

          {/* Banner Footer stats */}
          <div className="relative z-10 pt-6 border-t border-white/15 flex items-center justify-between text-xs text-indigo-100">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Weekly Leaderboard Prizes</span>
            </div>
            <div className="flex items-center gap-1 font-bold text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>100% Verified</span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Forms (7 cols on Desktop) */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          {/* Form Header Tabs */}
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {mode === 'login' ? t.welcomeBack : t.createAccount}
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-indigo-600 mt-1">
                {mode === 'login' ? t.loginToContinue : t.toShowcaseTalent}
              </p>
            </div>

            {/* Switch Tabs Pill */}
            <div className="flex bg-gray-100 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => { setError(''); setMode('login'); }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  mode === 'login'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t.login}
              </button>
              <button
                type="button"
                onClick={() => { setError(''); setMode('register'); }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  mode === 'register'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t.register}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  {t.emailOrUsername}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    autoComplete="username"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. artist@showcase.com"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  {t.password}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-xs font-medium text-gray-600">{t.rememberMe}</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setForgotPasswordSent(true);
                    setTimeout(() => setForgotPasswordSent(false), 4000);
                  }}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                >
                  {t.forgotPassword}
                </button>
              </div>

              {forgotPasswordSent && (
                <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold rounded-xl">
                  Password reset link has been dispatched to {loginEmail}!
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-base shadow-md shadow-indigo-600/30 active:scale-98 transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{t.login}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* 2. Registration Form */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  {t.accountType}
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRole('creator')}
                    className={`p-3 rounded-2xl border-2 text-left transition-all ${
                      role === 'creator'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-bold text-xs sm:text-sm flex items-center gap-1.5"><Palette className="w-3.5 h-3.5 text-indigo-600" /> Creator</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{language === 'bn' ? 'প্রতিভা আপলোড ও শেয়ার করব' : 'Upload and showcase talent'}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('audience')}
                    className={`p-3 rounded-2xl border-2 text-left transition-all ${
                      role === 'audience'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-bold text-xs sm:text-sm flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-indigo-600" /> Audience</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{language === 'bn' ? 'উপভোগ করব ও ভোট দেব' : 'Watch, rate & boost artists'}</div>
                  </button>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                    {t.firstName}
                  </label>
                  <input
                    type="text"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Khaled"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                    {t.lastName}
                  </label>
                  <input
                    type="text"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Hasan"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                  {t.emailOrUsername}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    autoComplete="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="khaled@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                    {t.password}
                  </label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                    {t.confirmPassword}
                  </label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  {language === 'bn' ? 'প্রোফাইল অবতার নির্বাচন করুন' : 'Select Profile Avatar'}
                </label>
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {demoAvatars.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAvatar(av)}
                      className={`relative rounded-full p-0.5 transition-transform ${
                        selectedAvatar === av
                          ? 'ring-3 ring-indigo-600 scale-110'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={av}
                        alt="Avatar Option"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {selectedAvatar === av && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 bg-white rounded-full absolute -top-1 -right-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-xs text-gray-600">
                    {language === 'bn' ? 'আমি প্ল্যাটফর্মের নিয়মাবলী ও শর্তাবলীতে সম্মত' : 'I agree to the Community Guidelines and Terms of Service'}
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-base shadow-md shadow-indigo-600/30 active:scale-98 transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{t.register}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Social Logins Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="border-t border-gray-200 w-full" />
            <span className="bg-white px-4 text-xs font-bold text-gray-400 uppercase">
              {t.orContinueWith}
            </span>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocial('Google')}
              className="py-2.5 px-4 border border-gray-200 hover:border-indigo-200 rounded-2xl text-xs sm:text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2.5 transition-all shadow-2xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocial('Facebook')}
              className="py-2.5 px-4 border border-gray-200 hover:border-indigo-200 rounded-2xl text-xs sm:text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2.5 transition-all shadow-2xs"
            >
              <div className="w-4 h-4 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-[10px] font-black">
                f
              </div>
              <span>Facebook</span>
            </button>
          </div>

          {/* Mode Switch Helper */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500 font-medium">
              {mode === 'login' ? t.dontHaveAccount : t.alreadyHaveAccount}{' '}
              <button
                type="button"
                onClick={() => { setError(''); setMode(mode === 'login' ? 'register' : 'login'); }}
                className="font-bold text-indigo-600 hover:text-indigo-700 ml-1 underline decoration-indigo-200 underline-offset-4"
              >
                {mode === 'login' ? t.registerNow : t.loginNow}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
