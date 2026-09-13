import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Mail, 
  BadgeCheck, 
  Users, 
  Footprints, 
  PenLine, 
  Guitar, 
  Drama, 
  Shapes, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Trophy,
  Mic,
  Video,
  FileText,
  Globe,
  Check,
  Award,
  Palette} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { fireSuccessConfetti } from '../utils/confetti';
import { Category } from '../types';
import type { LucideIcon } from 'lucide-react';
import { ApiError, api } from '../api/client';

interface SignUpPageProps {
  onSignUpSuccess: (name: string, email: string, avatar: string, role: string, mode: 'signup' | 'login') => void;
  onNavigateHome: () => void;
  initialMode?: 'signup' | 'login';
}

const presetAvatars = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'
];

const categoriesList: { key: Category; labelEn: string; labelBn: string; icon: LucideIcon }[] = [
  { key: 'Singing', labelEn: 'Singing', labelBn: 'গান ও সঙ্গীত', icon: Mic },
  { key: 'Dancing', labelEn: 'Dancing', labelBn: 'নৃত্য ও নাচ', icon: Footprints },
  { key: 'Art', labelEn: 'Art & Drawing', labelBn: 'চিত্রকর্ম ও শিল্পকলা', icon: Palette },
  { key: 'Poetry', labelEn: 'Poetry & Story', labelBn: 'কবিতা ও সাহিত্য', icon: PenLine },
  { key: 'Instrumental', labelEn: 'Instrumental', labelBn: 'যন্ত্রসংগীত', icon: Guitar },
  { key: 'Comedy', labelEn: 'Comedy & Acting', labelBn: 'কৌতুক ও অভিনয়', icon: Drama },
  { key: 'Others', labelEn: 'Others', labelBn: 'অন্যান্য প্রতিভা', icon: Shapes },
];

export const SignUpPage: React.FC<SignUpPageProps> = ({
  onSignUpSuccess,
  onNavigateHome,
  initialMode = 'signup'
}) => {
  const { t, language, toggleLanguage } = useLanguage();

  // Mode: 'signup' or 'login'
  const [authMode, setAuthMode] = useState<'signup' | 'login'>(initialMode);

  // Form State
  const [role, setRole] = useState<'creator' | 'audience'>('creator');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [primaryCategory, setPrimaryCategory] = useState<Category>('Singing');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(presetAvatars[0]);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const passwordStrength = getPasswordStrength(password);

  const getStrengthLabel = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 2) return language === 'bn' ? 'সাধারণ পাসওয়ার্ড' : 'Weak';
    if (passwordStrength === 3) return language === 'bn' ? 'ভালো পাসওয়ার্ড' : 'Good';
    return language === 'bn' ? 'শক্তিশালী পাসওয়ার্ড' : 'Strong';
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-rose-500';
    if (passwordStrength === 3) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const toDisplayError = (err: unknown) => {
    if (err instanceof ApiError) return err.message;
    return language === 'bn'
      ? 'সার্ভারের সাথে সংযোগ করা যাচ্ছে না। ।'
      : 'Cannot reach the server.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authMode === 'signup') {
      if (!firstName.trim()) {
        setError(language === 'bn' ? 'অনুগ্রহ করে আপনার নামের প্রথম অংশ প্রদান করুন' : 'Please enter your first name');
        return;
      }
      if (!lastName.trim()) {
        setError(language === 'bn' ? 'অনুগ্রহ করে আপনার পদবি / শেষ নাম প্রদান করুন' : 'Please enter your last name');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError(language === 'bn' ? 'অনুগ্রহ করে সঠিক ইমেইল ঠিকানা প্রদান করুন' : 'Please enter a valid email address');
        return;
      }
      if (password.length < 6) {
        setError(language === 'bn' ? 'পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে' : 'Password must be at least 6 characters long');
        return;
      }
      if (password !== confirmPassword) {
        setError(language === 'bn' ? 'পাসওয়ার্ড দুটি মেলেনি' : 'Passwords do not match');
        return;
      }
      if (!agreeTerms) {
        setError(language === 'bn' ? 'প্ল্যাটফর্মের শর্তাবলীতে সম্মতি প্রদান করুন' : 'Please accept the Terms and Community Guidelines');
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        const { user } = await api.register({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password,
          avatar: selectedAvatar,
          role,
          category: primaryCategory,
        });
        setIsLoading(false);
        fireSuccessConfetti();
        onSignUpSuccess(user.name, user.email, user.avatar || selectedAvatar, user.role || role, 'signup');
      } catch (err) {
        setIsLoading(false);
        setError(toDisplayError(err));
      }
    } else {
      // Login Mode
      if (!email.trim()) {
        setError(language === 'bn' ? 'অনুগ্রহ করে ইমেইল প্রদান করুন' : 'Please enter your email or username');
        return;
      }
      if (!password) {
        setError(language === 'bn' ? 'অনুগ্রহ করে পাসওয়ার্ড প্রদান করুন' : 'Please enter your password');
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        const { user } = await api.login(email.trim(), password);
        setIsLoading(false);
        fireSuccessConfetti();
        onSignUpSuccess(user.name, user.email, user.avatar || selectedAvatar, user.role || 'creator', 'login');
      } catch (err) {
        setIsLoading(false);
        setError(toDisplayError(err));
      }
    }
  };

  const handleSocialAuth = (provider: string) => {
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      fireSuccessConfetti();
      onSignUpSuccess('Khaled Hasan Milu', 'khaled.hasan@uiu.ac.bd', selectedAvatar, role, authMode);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 py-6 sm:py-12 px-3 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* Left Side: Brand Value & Benefits Banner (5 cols on Desktop) */}
        <div className="lg:col-span-5 bg-linear-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Ambient Backdrops */}
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-purple-400/20 blur-3xl pointer-events-none" />

          {/* Top Bar on Banner */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white text-indigo-700 flex items-center justify-center shadow-sm">
                <Award className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">TalentShowcase</span>
            </div>

            <button
              id="signup-lang-btn"
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1 text-xs font-bold bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full transition-all text-white cursor-pointer"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
            </button>
          </div>

          {/* Banner Middle Content */}
          <div className="relative z-10 py-6 sm:py-8 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-indigo-100 text-xs font-extrabold uppercase tracking-wider border border-white/15 shadow-2xs">
              <BadgeCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.authBadge}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {authMode === 'signup' ? t.createAccount : t.signIn} <br />
              <span className="text-indigo-200">
                {language === 'bn' ? 'আপনার সৃজনশীল যাত্রায় স্বাগতম' : 'Show Your Talent To The World'}
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed font-medium">
              {language === 'bn' 
                ? 'অডিও, ভিডিও বা কবিতার মাধ্যমে নিজের মৌলিক প্রতিভা প্রকাশ করুন এবং কমিউনিটি ভোটে জিতে নিন সম্মান ও পুরস্কার।' 
                : 'Join thousands of creators sharing original audio, video, and poetry performances with instant community voting and feedback.'}
            </p>

            {/* Feature Perks Badges */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-3 text-center">
                <Mic className="w-5 h-5 mx-auto mb-1 text-indigo-200" />
                <span className="text-[11px] font-bold block">{t.audio}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-3 text-center">
                <Video className="w-5 h-5 mx-auto mb-1 text-indigo-200" />
                <span className="text-[11px] font-bold block">{t.video}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-3 text-center">
                <FileText className="w-5 h-5 mx-auto mb-1 text-indigo-200" />
                <span className="text-[11px] font-bold block">{t.text}</span>
              </div>
            </div>

            {/* Testimonial / Community Stat */}
            <div className="bg-white/10 border border-white/15 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="flex -space-x-2 shrink-0">
                {presetAvatars.slice(0, 3).map((av, idx) => (
                  <img key={idx} src={av} alt="Member" className="w-7 h-7 rounded-full border-2 border-indigo-700 object-cover" />
                ))}
              </div>
              <div className="text-[11px] text-indigo-100">
                <span className="font-bold text-white">5,000+ Creators</span> already showcased their talents this month!
              </div>
            </div>
          </div>

          {/* Banner Footer */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-indigo-100">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Weekly Leaderboard & Prizes</span>
            </div>
            <button
              onClick={onNavigateHome}
              className="hover:underline flex items-center gap-1 font-bold text-indigo-200 hover:text-white"
            >
              <span>{language === 'bn' ? 'অতিথি হিসেবে দেখুন' : 'Explore as Guest'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Side: Dedicated Sign Up / Sign In Form (7 cols on Desktop) */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          
          {/* Top Auth Mode Switcher */}
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {authMode === 'signup' ? t.createAccount : t.signIn}
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                {authMode === 'signup' ? t.toShowcaseTalent : (language === 'bn' ? 'আপনার অ্যাকাউন্টে লগইন করে হোমপেজে প্রবেশ করুন' : 'Sign in to access your dashboard and talent feed')}
              </p>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-2xl shrink-0">
              <button
                type="button"
                id="toggle-signup-tab"
                onClick={() => { setAuthMode('signup'); setError(''); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.signUp}
              </button>
              <button
                type="button"
                id="toggle-login-tab"
                onClick={() => { setAuthMode('login'); setError(''); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.signIn}
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Sign Up Specific Fields: Role Selector */}
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  {t.accountType}
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    id="role-creator-btn"
                    onClick={() => setRole('creator')}
                    className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      role === 'creator'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-xs ring-2 ring-indigo-200/50'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs sm:text-sm flex items-center gap-1.5"><Palette className="w-3.5 h-3.5 text-indigo-600" /> Creator Account</span>
                      {role === 'creator' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {language === 'bn' ? 'গান, নাচ, আবৃত্তি বা শিল্প আপলোড করব' : 'Upload & showcase audio, video, poetry'}
                    </div>
                  </button>

                  <button
                    type="button"
                    id="role-audience-btn"
                    onClick={() => setRole('audience')}
                    className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      role === 'audience'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-xs ring-2 ring-indigo-200/50'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs sm:text-sm flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-indigo-600" /> Audience / Fan</span>
                      {role === 'audience' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {language === 'bn' ? 'প্রতিভা উপভোগ করব, ভোট দেব ও শেয়ার করব' : 'Discover artists, vote & chat with creators'}
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Name Fields (Only in Sign Up) */}
            {authMode === 'signup' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    {t.firstName} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="signup-firstname"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Khaled"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    {t.lastName} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="signup-lastname"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Hasan"
                    className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                {t.emailOrUsername} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="auth-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="artist@showcase.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Category of Talent (Sign Up only) */}
            {authMode === 'signup' && role === 'creator' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  {language === 'bn' ? 'প্রধান প্রতিভার বিভাগ' : 'Primary Talent Category'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {categoriesList.slice(0, 4).map((c) => (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => setPrimaryCategory(c.key)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border text-left cursor-pointer ${
                        primaryCategory === c.key
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <c.icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{language === 'bn' ? c.labelBn : c.labelEn}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Password Field */}
            <div className={authMode === 'signup' ? "grid grid-cols-1 sm:grid-cols-2 gap-3" : "space-y-3"}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  {t.password} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="auth-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Password strength meter (Sign up only) */}
                {authMode === 'signup' && password && (
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden flex gap-0.5">
                      <div className={`h-full ${passwordStrength >= 1 ? getStrengthColor() : 'bg-transparent'} flex-1`} />
                      <div className={`h-full ${passwordStrength >= 2 ? getStrengthColor() : 'bg-transparent'} flex-1`} />
                      <div className={`h-full ${passwordStrength >= 3 ? getStrengthColor() : 'bg-transparent'} flex-1`} />
                      <div className={`h-full ${passwordStrength >= 4 ? getStrengthColor() : 'bg-transparent'} flex-1`} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">{getStrengthLabel()}</span>
                  </div>
                )}
              </div>

              {/* Confirm Password (Sign up only) */}
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    {t.confirmPassword} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="signup-confirmpassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword && (
                    <div className="mt-1 text-[10px] font-bold">
                      {password === confirmPassword ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Passwords Match
                        </span>
                      ) : (
                        <span className="text-rose-500">Passwords do not match</span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile Avatar Picker (Sign Up only) */}
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  {language === 'bn' ? 'প্রোফাইল অবতার বেছে নিন' : 'Choose Profile Avatar'}
                </label>
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {presetAvatars.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAvatar(av)}
                      className={`relative rounded-full p-0.5 transition-all shrink-0 cursor-pointer ${
                        selectedAvatar === av
                          ? 'ring-3 ring-indigo-600 scale-105 shadow-sm'
                          : 'opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      <img
                        src={av}
                        alt="Avatar choice"
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
                      />
                      {selectedAvatar === av && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 bg-white rounded-full absolute -top-1 -right-1 ring-1 ring-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Terms & Agreement (Sign Up only) */}
            {authMode === 'signup' && (
              <div className="pt-1 space-y-1.5">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    id="signup-agree-terms"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-xs text-slate-600 leading-tight">
                    {language === 'bn' 
                      ? 'আমি ট্যালেন্ট শোকেসের কমিউনিটি নির্দেশিকা এবং সেবামূলক শর্তাবলীতে সম্মতি জানাচ্ছি।' 
                      : 'I agree to the Community Guidelines, Fair Voting Rules, and Terms of Service.'}
                  </span>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              id="auth-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-indigo-600/25 active:scale-98 transition-all flex items-center justify-center gap-2 mt-3 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{authMode === 'signup' ? t.register : t.signIn}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social Sign Up Options */}
          <div className="relative flex items-center justify-center my-5">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.orContinueWith}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              id="signup-google-btn"
              onClick={() => handleSocialAuth('Google')}
              className="py-2.5 px-3 border border-slate-200 hover:border-indigo-300 hover:bg-slate-50/80 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              id="signup-facebook-btn"
              onClick={() => handleSocialAuth('Facebook')}
              className="py-2.5 px-3 border border-slate-200 hover:border-indigo-300 hover:bg-slate-50/80 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
            >
              <div className="w-4 h-4 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-[10px] font-black shrink-0">
                f
              </div>
              <span>Facebook</span>
            </button>
          </div>

          {/* Bottom Switcher: Already Have Account? */}
          <div className="text-center mt-5">
            {authMode === 'signup' ? (
              <p className="text-xs text-slate-500 font-medium">
                {t.alreadyHaveAccount}{' '}
                <button
                  type="button"
                  id="signup-switch-login-btn"
                  onClick={() => { setAuthMode('login'); setError(''); }}
                  className="font-bold text-indigo-600 hover:text-indigo-700 underline decoration-indigo-200 underline-offset-4 ml-1 cursor-pointer"
                >
                  {t.loginNow}
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-500 font-medium">
                {t.dontHaveAccount}{' '}
                <button
                  type="button"
                  id="login-switch-signup-btn"
                  onClick={() => { setAuthMode('signup'); setError(''); }}
                  className="font-bold text-indigo-600 hover:text-indigo-700 underline decoration-indigo-200 underline-offset-4 ml-1 cursor-pointer"
                >
                  {t.signUp}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
