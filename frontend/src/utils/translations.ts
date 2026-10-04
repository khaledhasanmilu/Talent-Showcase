export type Language = 'en' | 'bn';

export interface Translations {
  // Navigation
  appName: string;
  appTagline: string;
  home: string;
  explore: string;
  leaderboard: string;
  inbox: string;
  profile: string;
  uploadTalent: string;
  upload: string;
  signIn: string;
  signUp: string;
  signOut: string;
  searchPlaceholder: string;
  notifications: string;
  markAllRead: string;
  markAllAsRead: string;
  noNotifications: string;
  newMessages: string;
  language: string;
  bangla: string;
  english: string;

  // Hero Section
  heroBadge: string;
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  uploadNow: string;
  featuredCreator: string;

  // Categories
  categories: string;
  viewAll: string;
  resetFilter: string;
  catSinging: string;
  catDancing: string;
  catArt: string;
  catPoetry: string;
  catInstrumental: string;
  catComedy: string;
  catOthers: string;

  // Feed & Filter
  trendingTalents: string;
  seeAll: string;
  format: string;
  all: string;
  video: string;
  audio: string;
  text: string;
  showcases: string;
  noTalentsFound: string;
  beFirstToUpload: string;
  uploadShowcase: string;

  // Card Actions & Labels
  like: string;
  liked: string;
  vote: string;
  voted: string;
  comment: string;
  comments: string;
  share: string;
  save: string;
  saved: string;
  watchFullVideo: string;
  listenAudio: string;
  readPoem: string;
  views: string;
  pts: string;
  votes: string;
  lines: string;

  // Sidebar / How it works
  topLeaderboard: string;
  fullBoard: string;
  howItWorks: string;
  rule1: string;
  rule2: string;
  rule3: string;

  // Leaderboard View
  leaderboardTitle: string;
  leaderboardSubtitle: string;
  thisWeek: string;
  thisMonth: string;
  allTime: string;
  rank: string;
  creator: string;
  category: string;
  score: string;
  action: string;
  boostCreator: string;
  boosted: string;
  goldPodium: string;
  silverPodium: string;
  bronzePodium: string;

  // Explore View
  exploreTitle: string;
  exploreSubtitle: string;
  popular: string;
  recent: string;
  mostLiked: string;
  topVoted: string;
  resultsFor: string;
  filterBy: string;

  // Inbox View
  inboxTitle: string;
  activeNow: string;
  offline: string;
  typeMessage: string;
  selectConversation: string;
  today: string;
  newMessage: string;
  searchPeople: string;
  startConversation: string;
  noUsersFound: string;

  // Profile View
  editProfile: string;
  shareProfile: string;
  talentCountLabel: string;
  scoreLabel: string;
  tabTalent: string;
  tabLiked: string;
  tabSaved: string;
  noItemsYet: string;
  fullName: string;
  usernameHandle: string;
  location: string;
  bio: string;
  cancel: string;
  saveChanges: string;

  // Auth Page & Modal
  welcomeBack: string;
  loginToContinue: string;
  createAccount: string;
  toShowcaseTalent: string;
  emailOrUsername: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  rememberMe: string;
  forgotPassword: string;
  login: string;
  register: string;
  orContinueWith: string;
  continueWithGoogle: string;
  continueWithFacebook: string;
  continueWithGithub: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  registerNow: string;
  loginNow: string;
  iAmCreator: string;
  iAmAudience: string;
  accountType: string;
  backToHome: string;
  authBadge: string;
  authHeroTitle1: string;
  authHeroTitle2: string;
  authHeroSubtitle: string;

  // Upload Modal
  uploadModalTitle: string;
  selectTalentType: string;
  selectType: string;
  talentTitle: string;
  talentTitleLabel: string;
  talentTitlePlaceholder: string;
  enterTitle: string;
  categoryLabel: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  writeDescription: string;
  poemContentLabel: string;
  poemContentPlaceholder: string;
  poemPlaceholder: string;
  uploadFileLabel: string;
  uploadVideoLabel: string;
  uploadAudioLabel: string;
  mediaFormatHint: string;
  clickToUpload: string;
  maxFileSize: string;
  submitShowcase: string;
  submitBtn: string;
  publishing: string;

  // Talent Details Modal
  addCommentPlaceholder: string;
  writeCommentPlaceholder: string;
  postComment: string;
  discussion: string;
  verifiedCreator: string;
  copiedLink: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    appName: 'Talent',
    appTagline: 'Showcase',
    home: 'Home',
    explore: 'Explore',
    leaderboard: 'Leaderboard',
    inbox: 'Inbox',
    profile: 'Profile',
    uploadTalent: 'Upload Talent',
    upload: 'Upload',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    searchPlaceholder: 'Search talents, creators, categories...',
    notifications: 'Notifications',
    markAllRead: 'Mark all read',
    markAllAsRead: 'Mark all read',
    noNotifications: 'No new notifications',
    newMessages: 'new',
    language: 'Language',
    bangla: 'বাংলা',
    english: 'English',

    // Hero Section
    heroBadge: 'Showcase Platform',
    heroTitle1: 'Show Your Talent',
    heroTitle2: 'In Your Way',
    heroSubtitle: 'Audio | Video | Text',
    uploadNow: 'Upload Now',
    featuredCreator: 'Featured Creator',

    // Categories
    categories: 'Categories',
    viewAll: 'View All',
    resetFilter: 'Reset Filter',
    catSinging: 'Singing',
    catDancing: 'Dancing',
    catArt: 'Art & Drawing',
    catPoetry: 'Poetry & Story',
    catInstrumental: 'Instrumental',
    catComedy: 'Comedy',
    catOthers: 'Others',

    // Feed & Filter
    trendingTalents: 'Trending Talents',
    seeAll: 'See All',
    format: 'Format:',
    all: 'All',
    video: 'Video',
    audio: 'Audio',
    text: 'Text',
    showcases: 'showcases',
    noTalentsFound: 'No talents found in this category',
    beFirstToUpload: 'Be the first to upload a showcase here!',
    uploadShowcase: 'Upload Showcase',

    // Card Actions & Labels
    like: 'Like',
    liked: 'Liked',
    vote: 'Vote',
    voted: 'Voted',
    comment: 'Comment',
    comments: 'Comments',
    share: 'Share',
    save: 'Save',
    saved: 'Saved',
    watchFullVideo: 'Click to Watch Full Video',
    listenAudio: 'Listen Audio Showcase',
    readPoem: 'Click to read full poem',
    views: 'views',
    pts: 'pts',
    votes: 'votes',
    lines: 'lines',

    // Sidebar
    topLeaderboard: 'Top Leaderboard',
    fullBoard: 'Full Board',
    howItWorks: 'How Talent Showcase Works',
    rule1: 'Upload your original talent in Audio, Video, or Text formats.',
    rule2: 'The community votes and likes your performance in real-time.',
    rule3: 'Climb the weekly leaderboard and earn rewards and recognition!',

    // Leaderboard View
    leaderboardTitle: 'Talent Leaderboard',
    leaderboardSubtitle: 'Ranked automatically by votes, likes & comments on each creator’s posts — vote on the posts to move them up',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    allTime: 'All Time',
    rank: 'Rank',
    creator: 'Creator',
    category: 'Category',
    score: 'Score',
    action: 'Action',
    boostCreator: 'Boost (+10)',
    boosted: 'Voted',
    goldPodium: '1st Place Winner',
    silverPodium: '2nd Place Runner-Up',
    bronzePodium: '3rd Place Runner-Up',

    // Explore View
    exploreTitle: 'Explore Talents',
    exploreSubtitle: 'Discover sensational creators across music, cinema, poetry, and creative arts',
    popular: 'Popular',
    recent: 'Recent',
    mostLiked: 'Most Liked',
    topVoted: 'Top Voted',
    resultsFor: 'Results for',
    filterBy: 'Filter by format',

    // Inbox View
    inboxTitle: 'Messages',
    activeNow: 'Active now',
    offline: 'Offline',
    typeMessage: 'Type your message...',
    selectConversation: 'Select a conversation to start messaging',
    today: 'Today',
    newMessage: 'New message',
    searchPeople: 'Search people...',
    startConversation: 'Start conversation',
    noUsersFound: 'No users found',

    // Profile View
    editProfile: 'Edit profile',
    shareProfile: 'Share',
    talentCountLabel: 'Talent',
    scoreLabel: 'Score',
    tabTalent: 'My Talents',
    tabLiked: 'Liked',
    tabSaved: 'Saved',
    noItemsYet: 'No items yet in this collection.',
    fullName: 'Full Name',
    usernameHandle: 'Username Handle',
    location: 'Location',
    bio: 'Bio',
    cancel: 'Cancel',
    saveChanges: 'Save Changes',

    // Auth Page & Modal
    welcomeBack: 'Welcome Back!',
    loginToContinue: 'Login to access your creator dashboard',
    createAccount: 'Create an Account',
    toShowcaseTalent: 'Join thousands of creators showcasing their talent',
    emailOrUsername: 'Email or username',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    login: 'Log In',
    register: 'Create Account',
    orContinueWith: 'or continue with',
    continueWithGoogle: 'Continue with Google',
    continueWithFacebook: 'Continue with Facebook',
    continueWithGithub: 'Continue with GitHub',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    registerNow: 'Register Now',
    loginNow: 'Login Now',
    iAmCreator: 'Creator (I want to share my talent)',
    iAmAudience: 'Audience (I want to watch & vote)',
    accountType: 'Select Account Type',
    backToHome: 'Back to Home',
    authBadge: 'Creator Community',
    authHeroTitle1: 'Show Your Talent',
    authHeroTitle2: 'To The World',
    authHeroSubtitle: 'Audio, Video, Text — One platform. Endless Opportunities.',

    // Upload Modal
    uploadModalTitle: 'Upload Your Talent',
    selectTalentType: 'Select Talent Format',
    selectType: 'Select Type',
    talentTitle: 'Talent Title',
    talentTitleLabel: 'Talent Title',
    talentTitlePlaceholder: 'Enter title (e.g. Acoustic Guitar Solo)',
    enterTitle: 'e.g., Acoustic Guitar Solo, Bengali Poetry...',
    categoryLabel: 'Category',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'Write something about your talent...',
    writeDescription: 'Write a few lines about your performance and inspiration...',
    poemContentLabel: 'Poem / Written Content (Bengali or English)',
    poemContentPlaceholder: 'Write your verses or story here...',
    poemPlaceholder: 'Write your verses or story here...',
    uploadFileLabel: 'Upload Media File',
    uploadVideoLabel: 'Upload Video',
    uploadAudioLabel: 'Upload Audio File',
    mediaFormatHint: 'Max 100MB MP4 (720p/1080p) or MP3/WAV Audio',
    clickToUpload: 'Click or drag & drop file to upload',
    maxFileSize: 'Max 100MB MP4 (720p/1080p) or MP3/WAV Audio',
    submitShowcase: 'Submit Talent Showcase',
    submitBtn: 'Submit',
    publishing: 'Publishing Showcase...',

    // Talent Details Modal
    addCommentPlaceholder: 'Write a supportive comment or critique...',
    writeCommentPlaceholder: 'Write a comment....',
    postComment: 'Post Comment',
    discussion: 'Community Discussion',
    verifiedCreator: 'Verified Creator',
    copiedLink: 'Link copied to clipboard!'
  },
  bn: {
    // Navigation
    appName: 'ট্যালেন্ট',
    appTagline: 'শোকেস',
    home: 'হোম',
    explore: 'অনুসন্ধান',
    leaderboard: 'লিডারবোর্ড',
    inbox: 'ইনবক্স',
    profile: 'প্রোফাইল',
    uploadTalent: 'প্রতিভা আপলোড',
    upload: 'আপলোড',
    signIn: 'লগইন',
    signUp: 'রেজিস্টার',
    signOut: 'লগআউট',
    searchPlaceholder: 'প্রতিভা, শিল্পী বা ক্যাটাগরি খুঁজুন...',
    notifications: 'বিজ্ঞপ্তি',
    markAllRead: 'সব পঠিত হিসেবে চিহ্নিত করুন',
    markAllAsRead: 'সব পঠিত করুন',
    noNotifications: 'কোনো নতুন বিজ্ঞপ্তি নেই',
    newMessages: 'নতুন',
    language: 'ভাষা',
    bangla: 'বাংলা',
    english: 'English',

    // Hero Section
    heroBadge: 'ট্যালেন্ট প্ল্যাটফর্ম',
    heroTitle1: 'আপনার প্রতিভা তুলে ধরুন',
    heroTitle2: 'নিজের মতো করে',
    heroSubtitle: 'অডিও | ভিডিও | টেক্সট সাহিত্য',
    uploadNow: 'এখনই আপলোড করুন',
    featuredCreator: 'সেরা নির্বাচিত শিল্পী',

    // Categories
    categories: 'বিভাগসমূহ',
    viewAll: 'সব দেখুন',
    resetFilter: 'ফিল্টার মুছুন',
    catSinging: 'গান ও সঙ্গীত',
    catDancing: 'নৃত্য ও নাচ',
    catArt: 'চিত্রকর্ম ও শিল্পকলা',
    catPoetry: 'কবিতা ও সাহিত্য',
    catInstrumental: 'যন্ত্রসংগীত',
    catComedy: 'কৌতুক ও অভিনয়',
    catOthers: 'অন্যান্য প্রতিভা',

    // Feed & Filter
    trendingTalents: 'জনপ্রিয় প্রতিভা',
    seeAll: 'সব দেখুন',
    format: 'ফরমেট:',
    all: 'সকল',
    video: 'ভিডিও',
    audio: 'অডিও',
    text: 'টেক্সট',
    showcases: 'টি পরিবেশনা',
    noTalentsFound: 'এই বিভাগে কোনো প্রতিভা পাওয়া যায়নি',
    beFirstToUpload: 'প্রথমেই আপনার প্রতিভা আপলোড করে চমকে দিন!',
    uploadShowcase: 'প্রতিভা আপলোড করুন',

    // Card Actions & Labels
    like: 'লাইক',
    liked: 'পছন্দ হয়েছে',
    vote: 'ভোট দিন',
    voted: 'ভোট দেওয়া হয়েছে',
    comment: 'মন্তব্য',
    comments: 'মন্তব্যসমূহ',
    share: 'শেয়ার',
    save: 'সংরক্ষণ',
    saved: 'সংরক্ষিত',
    watchFullVideo: 'সম্পূর্ণ ভিডিও দেখতে ক্লিক করুন',
    listenAudio: 'অডিও পরিবেশনা শুনুন',
    readPoem: 'সম্পূর্ণ কবিতাটি পড়তে ক্লিক করুন',
    views: 'বার দেখা হয়েছে',
    pts: 'পয়েন্ট',
    votes: 'ভোট',
    lines: 'লাইন',

    // Sidebar
    topLeaderboard: 'শীর্ষ লিডারবোর্ড',
    fullBoard: 'সম্পূর্ণ বোর্ড',
    howItWorks: 'ট্যালেন্ট শোকেস কীভাবে কাজ করে',
    rule1: 'অডিও, ভিডিও বা টেক্সট আকারে আপনার মৌলিক প্রতিভা আপলোড করুন।',
    rule2: 'দর্শকরা সরাসরি আপনার পরিবেশনা উপভোগ করে ভোট ও লাইক দেবেন।',
    rule3: 'সাপ্তাহিক লিডারবোর্ডের শীর্ষে উঠে সম্মাননা ও পুরস্কার জিতে নিন!',

    // Leaderboard View
    leaderboardTitle: 'সেরা শিল্পীদের লিডারবোর্ড',
    leaderboardSubtitle: 'প্রতিটি শিল্পীর পোস্টে পাওয়া ভোট, লাইক ও কমেন্ট থেকে স্বয়ংক্রিয় র‌্যাংকিং — পোস্টে ভোট দিলেই তারা উপরে উঠবে',
    thisWeek: 'এই সপ্তাহ',
    thisMonth: 'এই মাস',
    allTime: 'সর্বকালের সেরা',
    rank: 'র‌্যাংক',
    creator: 'শিল্পী',
    category: 'বিভাগ',
    score: 'স্কোর',
    action: 'পদক্ষেপ',
    boostCreator: 'ভোট দিন (+১০)',
    boosted: 'ভোট সম্পন্ন',
    goldPodium: '১ম স্থান বিজয়ী (স্বর্ণপদক)',
    silverPodium: '২য় স্থান রানার্সআপ (রৌপ্যপদক)',
    bronzePodium: '৩য় স্থান রানার্সআপ (ব্রোঞ্জপদক)',

    // Explore View
    exploreTitle: 'প্রতিভা অন্বেষণ',
    exploreSubtitle: 'সঙ্গীত, সিনেমা, কবিতা ও সৃজনশীল শিল্পের সেরা পরিবেশনা আবিষ্কার করুন',
    popular: 'জনপ্রিয়',
    recent: 'সাম্প্রতিক',
    mostLiked: 'সর্বাধিক লাইকপ্রাপ্ত',
    topVoted: 'সর্বাধিক ভোটপ্রাপ্ত',
    resultsFor: 'ফলাফল পাওয়া গেছে:',
    filterBy: 'ফরমেট অনুযায়ী ফিল্টার',

    // Inbox View
    inboxTitle: 'বার্তা ও ইনবক্স',
    activeNow: 'বর্তমানে সক্রিয়',
    offline: 'অফলাইন',
    typeMessage: 'আপনার বার্তা লিখুন...',
    selectConversation: 'বার্তা আদান-প্রদান করতে একটি চ্যাট নির্বাচন করুন',
    today: 'আজ',
    newMessage: 'নতুন বার্তা',
    searchPeople: 'মানুষ খুঁজুন...',
    startConversation: 'কথোপকথন শুরু করুন',
    noUsersFound: 'কোনো ব্যবহারকারী পাওয়া যায়নি',

    // Profile View
    editProfile: 'প্রোফাইল সম্পাদনা',
    shareProfile: 'শেয়ার',
    talentCountLabel: 'প্রতিভা',
    scoreLabel: 'স্কোর',
    tabTalent: 'আমার পরিবেশনা',
    tabLiked: 'পছন্দসমূহ',
    tabSaved: 'সংরক্ষিত',
    noItemsYet: 'এই সংগ্রহে এখনও কোনো পরিবেশনা নেই।',
    fullName: 'পুরো নাম',
    usernameHandle: 'ইউজারনেম হ্যান্ডেল',
    location: 'অবস্থান / জেলা',
    bio: 'সংক্ষিপ্ত পরিচিতি',
    cancel: 'বাতিল',
    saveChanges: 'পরিবর্তন সংরক্ষণ করুন',

    // Auth Page & Modal
    welcomeBack: 'স্বাগতম!',
    loginToContinue: 'আপনার ক্রিয়েটর ড্যাশবোর্ডে প্রবেশ করতে লগইন করুন',
    createAccount: 'নতুন অ্যাকাউন্ট খুলুন',
    toShowcaseTalent: 'হাজারো শিল্পীদের সাথে আপনার প্রতিভা তুলে ধরুন',
    emailOrUsername: 'ইমেইল বা ব্যবহারকারী নাম',
    password: 'পাসওয়ার্ড',
    confirmPassword: 'পাসওয়ার্ড নিশ্চিত করুন',
    firstName: 'নামের প্রথম অংশ',
    lastName: 'নামের শেষ অংশ',
    rememberMe: 'স্মরণে রাখুন',
    forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?',
    login: 'লগইন করুন',
    register: 'অ্যাকাউন্ট তৈরি করুন',
    orContinueWith: 'অথবা এর মাধ্যমে যুক্ত হোন',
    continueWithGoogle: 'গুগল দিয়ে চালিয়ে যান',
    continueWithFacebook: 'ফেসবুক দিয়ে চালিয়ে যান',
    continueWithGithub: 'গিটহাব দিয়ে চালিয়ে যান',
    dontHaveAccount: 'আপনার কি কোনো অ্যাকাউন্ট নেই?',
    alreadyHaveAccount: 'ইতিমধ্যে একটি অ্যাকাউন্ট আছে?',
    registerNow: 'এখনই রেজিস্টার করুন',
    loginNow: 'লগইন করুন',
    iAmCreator: 'শিল্পী / ক্রিয়েটর (আমি প্রতিভা প্রকাশ করব)',
    iAmAudience: 'দর্শক ও বিচারক (আমি উপভোগ করব ও ভোট দেব)',
    accountType: 'অ্যাকাউন্টের ধরন নির্বাচন করুন',
    backToHome: 'হোম পেজে ফিরে যান',
    authBadge: 'ক্রিয়েটর কমিউনিটি',
    authHeroTitle1: 'আপনার প্রতিভাকে বিশ্বদরবারে',
    authHeroTitle2: 'তুলে ধরুন',
    authHeroSubtitle: 'অডিও, ভিডিও, টেক্সট — এক অনন্য প্ল্যাটফর্মে অসংখ্য সুযোগ।',

    // Upload Modal
    uploadModalTitle: 'আপনার প্রতিভা আপলোড করুন',
    selectTalentType: 'প্রতিভার মাধ্যম নির্বাচন করুন',
    selectType: 'মাধ্যম নির্বাচন করুন',
    talentTitle: 'প্রতিভার শিরোনাম',
    talentTitleLabel: 'প্রতিভার শিরোনাম',
    talentTitlePlaceholder: 'শিরোনাম লিখুন (যেমন: একক গিটার বাদন)',
    enterTitle: 'যেমন: রবীন্দ্রসঙ্গীত একক, আধুনিক নৃত্য, বাংলা কবিতা...',
    categoryLabel: 'বিভাগ',
    descriptionLabel: 'বিবরণ',
    descriptionPlaceholder: 'আপনার প্রতিভা সম্পর্কে কিছু লিখুন...',
    writeDescription: 'আপনার পরিবেশনা ও অনুপ্রেরণা সম্পর্কে কিছু লিখুন...',
    poemContentLabel: 'কবিতা বা লিখিত সাহিত্য (বাংলা বা ইংরেজি)',
    poemContentPlaceholder: 'আপনার কবিতা বা সাহিত্যের পঙক্তি এখানে লিখুন...',
    poemPlaceholder: 'আপনার কবিতা বা সাহিত্যের পঙক্তি এখানে লিখুন...',
    uploadFileLabel: 'মিডিয়া ফাইল আপলোড করুন',
    uploadVideoLabel: 'ভিডিও আপলোড',
    uploadAudioLabel: 'অডিও ফাইল আপলোড',
    mediaFormatHint: 'সর্বোচ্চ ১০০MB MP4 (720p/1080p) বা MP3/WAV অডিও',
    clickToUpload: 'ফাইল আপলোড করতে ক্লিক করুন বা ড্র্যাগ করুন',
    maxFileSize: 'সর্বোচ্চ ১০০MB MP4 (720p/1080p) বা MP3/WAV অডিও',
    submitShowcase: 'প্রতিভা সাবমিট করুন',
    submitBtn: 'সাবমিট করুন',
    publishing: 'প্রকাশ করা হচ্ছে...',

    // Talent Details Modal
    addCommentPlaceholder: 'আপনার গঠনমূলক মতামত বা প্রশংসা লিখুন...',
    writeCommentPlaceholder: 'মন্তব্য লিখুন....',
    postComment: 'মন্তব্য পোস্ট করুন',
    discussion: 'আলোচনা ও প্রতিক্রিয়া',
    verifiedCreator: 'ভেরিফায়েড শিল্পী',
    copiedLink: 'লিঙ্ক ক্লিপবোর্ডে কপি করা হয়েছে!'
  }
};
