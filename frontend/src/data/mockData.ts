import { TalentItem, Comment, NotificationItem, ChatThread, LeaderboardUser, UserProfile } from '../types';

export const currentUserProfile: UserProfile = {
  id: 'user-current',
  name: 'Khaled Hasan Milu',
  handle: '@khaledhasanmilu',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  location: 'Dhaka, Bangladesh',
  bio: 'Dreamer | Performer | Believer\nI love to sing and capture moments.',
  talentCount: 10,
  score: 1050,
  rank: 4,
  email: 'khaled.hasan@example.com'
};

export const mockTalents: TalentItem[] = [
  {
    id: 'talent-1',
    title: 'Soulful Vibes',
    type: 'video',
    category: 'Singing',
    authorName: 'Rahat Ahmed',
    authorHandle: '@rahatahmed',
    authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    authorLocation: 'Dhaka, Bangladesh',
    authorRank: 12,
    isVerified: true,
    createdAt: 'Jul 25, 2026',
    likes: 125400,
    views: 500200,
    commentsCount: 1540,
    votes: 125000,
    description: 'Just a little try to express my feeling through this song. Hope you all like it and support my journey in music!',
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
    contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    isLiked: false,
    isVoted: false,
    isSaved: false,
    tags: ['Acoustic', 'Vocal', 'LivePerformance', 'Original']
  },
  {
    id: 'talent-2',
    title: 'আগামীর সময় (Upcoming Time)',
    type: 'text',
    category: 'Poetry',
    authorName: 'Hasan Mahmud',
    authorHandle: '@hasanmahmud',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    authorLocation: 'Chittagong, Bangladesh',
    authorRank: 2,
    isVerified: true,
    createdAt: 'Jul 25, 2026',
    likes: 16800,
    views: 15400,
    commentsCount: 5200,
    votes: 15900,
    description: 'A poetic ode to resilience, dreams, and the dawn of a new generation.',
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80',
    poemText: [
      'সত্যের আলোক জ্বেলে, কাটে কালো ভয়,',
      'তটিনীর ধারা বেয়ে, এলো যে সময়।',
      'অপপ্রচারের বাণে, তুমি শক্ত বাঁধ,',
      'নিশার আঁধার চিরে, আনো পূর্ণ চাঁদ।',
      '',
      'সকল বীরের কথা, পাতায় পাতায়,',
      'তোমার সাহসে আজ, মুক্তি খুঁজে পায়।',
      'দায়িত্ব পালনে তুমি, রবে অবিচল,',
      'তোমারি আলোতে হাসে, সুদিন উজ্জ্বল।',
      '',
      'নতুনের জয়গান, গাছে এ মাতৃক,',
      'আঁধারে জ্বালিয়ে দিলে, আশার বর্তিক।',
      'বীরদের এই বাণী, ছড়ালো সুবাস,',
      'জাগালো সবার মনে, সুদৃঢ় বিশ্বাস।',
      '',
      'সময়ের দাবি মেনে, চলুক এ তরী,',
      '‘আগামীর সময়’ কে, ধন্য মোরা করি।'
    ],
    isLiked: true,
    isVoted: true,
    isSaved: false,
    tags: ['BengaliPoetry', 'Inspiration', 'Literature', 'Rhymes']
  },
  {
    id: 'talent-3',
    title: 'Voice of Nirob',
    type: 'audio',
    category: 'Singing',
    authorName: 'Nirob Hossen',
    authorHandle: '@nirobhossen',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    authorLocation: 'Sylhet, Bangladesh',
    authorRank: 10,
    isVerified: true,
    createdAt: 'Jul 25, 2026',
    likes: 125000,
    views: 125000,
    commentsCount: 125000,
    votes: 125000,
    audioDuration: '4:47',
    description: 'An ethereal instrumental vocal performance blending soft eastern melodies with modern ambient soundscapes.',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    contentUrl: 'https://actions.google.com/sounds/v1/ambiences/outdoor_ambience.ogg',
    audioWaveform: [24, 42, 68, 85, 45, 30, 72, 90, 60, 48, 80, 95, 70, 55, 35, 65, 88, 76, 54, 92, 100, 65, 40, 78, 85, 60, 30, 45, 65, 80, 95, 70, 50, 60, 75, 90, 82, 45, 30, 20],
    isLiked: false,
    isVoted: false,
    isSaved: true,
    tags: ['AudioShowcase', 'AcousticSoul', 'IndieMusic', 'Melody']
  },
  {
    id: 'talent-4',
    title: 'Melody of Life',
    type: 'video',
    category: 'Singing',
    authorName: 'Riya Hasan',
    authorHandle: '@riyahasan',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    authorLocation: 'Dhaka, Bangladesh',
    authorRank: 8,
    isVerified: true,
    createdAt: 'Aug 10, 2026',
    likes: 25400,
    views: 150000,
    commentsCount: 980,
    votes: 24100,
    description: 'A tribute cover celebrating life and harmonic balance.',
    thumbnail: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80',
    contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    isLiked: false,
    isVoted: false,
    isSaved: false,
    tags: ['Music', 'Vocal', 'Cover']
  },
  {
    id: 'talent-5',
    title: 'Street Dancer',
    type: 'video',
    category: 'Dancing',
    authorName: 'Afran Nisho',
    authorHandle: '@afrannisho',
    authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    authorLocation: 'Dhaka, Bangladesh',
    authorRank: 3,
    isVerified: true,
    createdAt: 'Aug 14, 2026',
    likes: 20500,
    views: 140000,
    commentsCount: 1120,
    votes: 19800,
    description: 'Urban popping and locking street choreography recorded at sunset.',
    thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
    contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    isLiked: false,
    isVoted: false,
    isSaved: false,
    tags: ['HipHop', 'Dance', 'StreetStyle', 'Urban']
  },
  {
    id: 'talent-6',
    title: 'Colors of Nature',
    type: 'video',
    category: 'Art',
    authorName: 'Khaled Hasan Milu',
    authorHandle: '@khaledhasanmilu',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    authorLocation: 'Dhaka, Bangladesh',
    authorRank: 4,
    isVerified: true,
    createdAt: 'Aug 18, 2026',
    likes: 202,
    views: 1040,
    commentsCount: 45,
    votes: 790,
    description: 'Acrylic canvas painting timelapse capturing golden sunset over green mountain meadows.',
    thumbnail: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=80',
    contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    isLiked: false,
    isVoted: false,
    isSaved: true,
    tags: ['FineArt', 'NaturePainting', 'Acrylic', 'Timelapse']
  },
  {
    id: 'talent-7',
    title: 'How to create a video',
    type: 'video',
    category: 'Others',
    authorName: 'Subarna Khan',
    authorHandle: '@subarnakhan',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    authorLocation: 'Rajshahi, Bangladesh',
    authorRank: 2,
    isVerified: true,
    createdAt: 'Aug 22, 2026',
    likes: 40000,
    views: 230000,
    commentsCount: 3100,
    votes: 38200,
    description: 'Masterclass on cinematography, composition, and storytelling on a minimal budget.',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
    contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    isLiked: false,
    isVoted: false,
    isSaved: false,
    tags: ['Filmmaking', 'Tutorial', 'Cinematography']
  },
  {
    id: 'talent-8',
    title: 'Life is Good',
    type: 'video',
    category: 'Art',
    authorName: 'Minhazul',
    authorHandle: '@minhazul_official',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    authorLocation: 'Dhaka, Bangladesh',
    authorRank: 6,
    isVerified: true,
    createdAt: 'Aug 25, 2026',
    likes: 25000,
    views: 150000,
    commentsCount: 890,
    votes: 24500,
    description: 'Digital 3D motion design & optical lighting synthesis.',
    thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80',
    contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    isLiked: false,
    isVoted: false,
    isSaved: false,
    tags: ['3DArt', 'Motion', 'VFX']
  },
  {
    id: 'talent-9',
    title: 'Dance Fire',
    type: 'video',
    category: 'Dancing',
    authorName: 'Tasmire Haque',
    authorHandle: '@tasmirehaque',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    authorLocation: 'Khulna, Bangladesh',
    authorRank: 7,
    isVerified: false,
    createdAt: 'Aug 28, 2026',
    likes: 120000,
    views: 620000,
    commentsCount: 4200,
    votes: 118000,
    description: 'High tempo contemporary fire choreography.',
    thumbnail: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&auto=format&fit=crop&q=80',
    contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    isLiked: false,
    isVoted: false,
    isSaved: false,
    tags: ['Contemporary', 'DanceEnergy', 'Stage']
  },
  {
    id: 'talent-10',
    title: 'Voice of Soul',
    type: 'audio',
    category: 'Singing',
    authorName: 'Afrin Tashu',
    authorHandle: '@afrintashu',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    authorLocation: 'Dhaka, Bangladesh',
    authorRank: 5,
    isVerified: true,
    createdAt: 'Aug 29, 2026',
    likes: 150000,
    views: 740000,
    commentsCount: 9200,
    votes: 148000,
    audioDuration: '3:52',
    description: 'A soothing classical vocal rendition with acoustic guitar accompaniment.',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    audioWaveform: [30, 45, 60, 75, 90, 65, 45, 55, 70, 85, 90, 60, 40, 50, 70, 85, 95, 65, 40, 30, 50, 75, 90, 80, 55, 45, 60, 80, 95, 70, 50, 40, 60, 75, 90, 65, 45, 30, 20, 15],
    isLiked: false,
    isVoted: false,
    isSaved: false,
    tags: ['Soul', 'Classical', 'Vocalist']
  },
  {
    id: 'talent-11',
    title: 'Life in Colors',
    type: 'video',
    category: 'Art',
    authorName: 'Sakib Uddin',
    authorHandle: '@sakibuddin',
    authorAvatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=80',
    authorLocation: 'Dhaka, Bangladesh',
    authorRank: 1,
    isVerified: true,
    createdAt: 'Aug 30, 2026',
    likes: 10000000,
    views: 24000000,
    commentsCount: 145000,
    votes: 9800000,
    description: 'A global art mural painted across a 50ft canvas depicting human connection.',
    thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    isLiked: false,
    isVoted: false,
    isSaved: false,
    tags: ['Mural', 'GlobalArt', 'Painting']
  }
];

export const mockComments: Record<string, Comment[]> = {
  'talent-1': [
    {
      id: 'c1',
      talentId: 'talent-1',
      authorName: 'Nurul Huda',
      authorAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
      text: 'Amazing Voice.......:( Really touched my heart!',
      createdAt: '2h ago',
      likes: 42,
      isLiked: true,
      replies: [
        {
          id: 'r1',
          authorName: 'Rahat Ahmed',
          authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
          text: 'Thank you so much brother! Means a lot ❤️',
          createdAt: '1h ago',
          likes: 12
        }
      ]
    },
    {
      id: 'c2',
      talentId: 'talent-1',
      authorName: 'Sizan',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      text: 'What a Voice man!....just wowww.... instant vote from me!',
      createdAt: '3m ago',
      likes: 18,
      isLiked: false
    },
    {
      id: 'c3',
      talentId: 'talent-1',
      authorName: 'Subarna Khan',
      authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
      text: 'The high pitch modulation at 1:45 is simply breathtaking.',
      createdAt: '4h ago',
      likes: 85,
      isLiked: false
    }
  ],
  'talent-2': [
    {
      id: 'c201',
      talentId: 'talent-2',
      authorName: 'Nurul Huda',
      authorAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
      text: 'অসাধারণ কবিতা! প্রতিটি চরণে দেশপ্রেম এবং আশা ফুটে উঠেছে।',
      createdAt: '2h ago',
      likes: 64,
      isLiked: true
    },
    {
      id: 'c202',
      talentId: 'talent-2',
      authorName: 'Sizan',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      text: 'Mindblowing writing. Kept reading it over and over again.',
      createdAt: '15m ago',
      likes: 29,
      isLiked: false
    }
  ],
  'talent-3': [
    {
      id: 'c301',
      talentId: 'talent-3',
      authorName: 'Nurul Huda',
      authorAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
      text: 'Amazing Voice.......:(',
      createdAt: '2h ago',
      likes: 91,
      isLiked: true
    },
    {
      id: 'c302',
      talentId: 'talent-3',
      authorName: 'Sizan',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      text: 'What a Voice man!....just wowww....',
      createdAt: '3 min ago',
      likes: 54,
      isLiked: false
    }
  ]
};

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'like',
    user: {
      name: 'Ratul Ahmed',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80'
    },
    message: 'Liked Your Talent',
    talentTitle: 'Soulful Vibes',
    time: '1:25 am',
    isRead: false,
    targetTalentId: 'talent-1'
  },
  {
    id: 'notif-2',
    type: 'like',
    user: {
      name: 'Minhazul',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80'
    },
    message: 'Liked Your Talent',
    talentTitle: 'Soulful Vibes',
    time: '12:25 pm',
    isRead: false,
    targetTalentId: 'talent-1'
  },
  {
    id: 'notif-3',
    type: 'vote',
    user: {
      name: 'Talent Showcase System',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
    },
    message: 'You receive a new vote on your artwork',
    talentTitle: 'Colors of Nature',
    time: '5:25 pm',
    isRead: true,
    targetTalentId: 'talent-6'
  },
  {
    id: 'notif-4',
    type: 'follow',
    user: {
      name: 'Afran Nisho',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80'
    },
    message: 'started following you',
    talentTitle: 'Soulful Vibes',
    time: '8:25 am',
    isRead: true
  },
  {
    id: 'notif-5',
    type: 'milestone',
    user: {
      name: 'Showcase Highlights',
      avatar: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&auto=format&fit=crop&q=80'
    },
    message: 'Your talent is now in Top 10 Great Job',
    talentTitle: 'Colors of Nature',
    time: '3:25 am',
    isRead: true,
    targetTalentId: 'talent-6'
  }
];

export const mockLeaderboard: LeaderboardUser[] = [
  {
    rank: 1,
    id: 'lead-1',
    name: 'Rahat Ahmed',
    handle: '@rahatahmed',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    category: 'Singing',
    score: 1200,
    likes: 125400,
    votes: 1200,
    talentCount: 14,
    isTop3: true
  },
  {
    rank: 2,
    id: 'lead-2',
    name: 'Subarna khan',
    handle: '@subarnakhan',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    category: 'Others / Filmmaking',
    score: 950,
    likes: 98000,
    votes: 950,
    talentCount: 8,
    isTop3: true
  },
  {
    rank: 3,
    id: 'lead-3',
    name: 'Arfan Nisho',
    handle: '@afrannisho',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    category: 'Dancing',
    score: 870,
    likes: 85200,
    votes: 870,
    talentCount: 11,
    isTop3: true
  },
  {
    rank: 4,
    id: 'lead-4',
    name: 'Khaled Hasan',
    handle: '@khaledhasanmilu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    category: 'Art & Vocal',
    score: 790,
    likes: 67400,
    votes: 790,
    talentCount: 10
  },
  {
    rank: 5,
    id: 'lead-5',
    name: 'Redwanul',
    handle: '@redwanul_dev',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    category: 'Instrumental',
    score: 710,
    likes: 54000,
    votes: 710,
    talentCount: 6
  },
  {
    rank: 6,
    id: 'lead-6',
    name: 'Minhazul',
    handle: '@minhazul_official',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    category: '3D Art',
    score: 650,
    likes: 49000,
    votes: 650,
    talentCount: 7
  },
  {
    rank: 7,
    id: 'lead-7',
    name: 'Nurul Huda',
    handle: '@nurulhuda',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
    category: 'Poetry',
    score: 540,
    likes: 38000,
    votes: 540,
    talentCount: 9
  },
  {
    rank: 8,
    id: 'lead-8',
    name: 'Mahi Islam',
    handle: '@mahiislam',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    category: 'Singing',
    score: 430,
    likes: 29000,
    votes: 430,
    talentCount: 5
  }
];

export const mockChatThreads: ChatThread[] = [
  {
    id: 'thread-1',
    contact: {
      id: 'contact-1',
      name: 'Ratul Ahmed',
      handle: '@ratulahmed',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
      online: true,
      location: 'Dhaka'
    },
    lastMessage: 'Hey.....ki Obostha',
    timestamp: '1:25 am',
    unreadCount: 1,
    messages: [
      { id: 'm1', sender: 'contact', text: 'Hey bro, loved your latest art showcase!', timestamp: '1:20 am' },
      { id: 'm2', sender: 'user', text: 'Thanks brother! Working on a new video as well.', timestamp: '1:22 am' },
      { id: 'm3', sender: 'contact', text: 'Hey.....ki Obostha', timestamp: '1:25 am' }
    ]
  },
  {
    id: 'thread-2',
    contact: {
      id: 'contact-2',
      name: 'Minhazul',
      handle: '@minhazul',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
      online: false,
      location: 'Chittagong'
    },
    lastMessage: 'Bro how are you?',
    timestamp: '4:25 pm',
    unreadCount: 0,
    messages: [
      { id: 'm21', sender: 'contact', text: 'Voted for your performance in this week leaderboard!', timestamp: '4:15 pm' },
      { id: 'm22', sender: 'user', text: 'Appreciate it very much!', timestamp: '4:20 pm' },
      { id: 'm23', sender: 'contact', text: 'Bro how are you?', timestamp: '4:25 pm' }
    ]
  },
  {
    id: 'thread-3',
    contact: {
      id: 'contact-3',
      name: 'Nurul Huda',
      handle: '@nurulhuda',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
      online: true,
      location: 'Sylhet'
    },
    lastMessage: 'Bro When?',
    timestamp: '5:25 pm',
    unreadCount: 0,
    messages: [
      { id: 'm31', sender: 'user', text: 'We should collaborate on a poem recital with background guitar.', timestamp: '5:10 pm' },
      { id: 'm32', sender: 'contact', text: 'That sounds fantastic!', timestamp: '5:20 pm' },
      { id: 'm33', sender: 'contact', text: 'Bro When?', timestamp: '5:25 pm' }
    ]
  },
  {
    id: 'thread-4',
    contact: {
      id: 'contact-4',
      name: 'Subarna Khan',
      handle: '@subarnakhan',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
      online: true,
      location: 'Rajshahi'
    },
    lastMessage: 'Allhamdulillah fine.',
    timestamp: '6:55 pm',
    unreadCount: 0,
    messages: [
      { id: 'm41', sender: 'user', text: 'Congratulations on reaching Rank #2 this week!', timestamp: '6:40 pm' },
      { id: 'm42', sender: 'contact', text: 'Thank you so much Khaled! How have you been?', timestamp: '6:50 pm' },
      { id: 'm43', sender: 'contact', text: 'Allhamdulillah fine.', timestamp: '6:55 pm' }
    ]
  }
];
