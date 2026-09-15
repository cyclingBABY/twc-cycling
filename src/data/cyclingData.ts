import { CyclingEvent, CommunityAdvocacyStory } from '../types';

export const CLUB_INFO = {
  name: 'Together We Can Cycling Uganda Limited',
  shortName: 'TWC Cycling Academy',
  director: 'Solomon Ssebakaki',
  directorMoniker: 'Manager Solo',
  directorTitle: 'Founder & Executive Director',
  headquarters: 'BMK House, Katwe, Kampala, Uganda',
  primaryPhone: '+256706770872',
  secondaryPhone: '+256763145915',
  email: 'twccyclinguganda@gmail.com',
  circuitName: 'Lubiri Ring Road Circuit (Mengo, Kampala)',
  socialLinks: {
    youtube: 'https://www.youtube.com/channel/UCcyYTjupx6KfAfe-ON_Wqlg',
    tiktok: 'https://www.tiktok.com/@togetherwecancyclingug?is_from_webapp=1&sender_device=pc',
    instagram: 'https://www.instagram.com/togetherwecancyclingug/',
    facebook: 'https://facebook.com/TWCCyclingUganda',
    twitter: 'https://x.com/TWCCyclingUg',
    whatsapp: 'https://wa.me/256706770872?text=Hello%20Manager%20Solo%20-%20I%20am%20interested%20in%20TWC%20Cycling%20Academy%20Uganda',
  },
  stats: [
    { label: 'Active Youth & Elite Riders', value: '320+' },
    { label: 'Flagship Circuit Length', value: '105 km' },
    { label: 'Circuits & Milestones Held', value: '28+' },
    { label: 'Self-Funded Athletes Backed', value: '85+' },
  ],
};

export const FLAGSHIP_RACE_CATEGORIES = [
  {
    id: 'elite-105',
    name: 'Elite Category',
    distance: '105 Kilometers',
    laps: '30 Laps (3.5 km per lap)',
    targetGroup: 'Licensed Elite Racers, Pro Riders & Senior Competitors',
    description: 'The premier endurance and tactical test of speed, drafting, and stamina on the paved Lubiri Ring Road closed circuit.',
    requirements: [
      'Full UCI / UCF compliant road bike',
      'Cycling helmet & clipped race shoes mandatory',
      'Minimum age: 18 years or elite developmental clearance',
      'Registration bib & transponder pickup 1 hr before flag-off',
    ],
    prizeHighlight: 'Prime Land Title Certificate + Sponsored Cash Purse & Gold Trophy',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    accentBorder: 'border-amber-500',
  },
  {
    id: 'schools-youth',
    name: 'Schools & Youth Competition',
    distance: '21 Kilometers',
    laps: '6 Laps (3.5 km per lap)',
    targetGroup: 'School Students with particular focus on Senior One (S.1) Youth Riders',
    description: 'Grassroots championship targeted at discovering Uganda’s next cycling olympians and high-school talent. School teams and individual students welcome.',
    requirements: [
      'Valid student identity or school recommendation letter',
      'Road or mountain bike in inspected working condition',
      'Protective helmet and sports attire',
      'Parental/Guardian consent form for riders under 18',
    ],
    prizeHighlight: 'Academic Cycling Scholarships + Specialized Road Racing Bicycles + Silver Cup',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    accentBorder: 'border-emerald-500',
  },
  {
    id: 'armed-forces',
    name: 'Armed Forces Category',
    distance: '52.5 Kilometers',
    laps: '15 Laps (3.5 km per lap)',
    targetGroup: 'UPDF, Uganda Police Force, Uganda Prisons Service & Paramilitary Personnel',
    description: 'Inter-agency competitive contest celebrating discipline, physical prowess, and national service on two wheels.',
    requirements: [
      'Service agency affiliation verification',
      'Operational or standard sports bicycle',
      'Safety helmet & reflective markings',
    ],
    prizeHighlight: 'Commemorative Service Shield + Sponsored Equipment Kit + Cash Honorarium',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    accentBorder: 'border-cyan-500',
  },
  {
    id: 'family-fans',
    name: 'Family & Fans Category',
    distance: '7 Kilometers',
    laps: '2 Fun Laps (Non-Competitive Community Ride)',
    targetGroup: 'Cycling Enthusiasts, Veterans, Children, Families & Corporate Supporters',
    description: 'An open, jubilant community ride to foster road safety awareness, active fitness, and pure passion for Ugandan cycling culture.',
    requirements: [
      'Any bicycle style (mountain, road, hybrid, or single-speed)',
      'Helmet strongly advised (free loaners available at BMK desk)',
      'Open to all ages from 7 to 70+',
    ],
    prizeHighlight: 'Finisher Medals, TWC Branded High-Vis Jerseys & Refreshment Packages',
    badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
    accentBorder: 'border-orange-500',
  },
];

export const EVENTS_DATA: CyclingEvent[] = [
  {
    id: 'inaugural-reconciliatory-race',
    title: 'Inaugural Reconciliatory Cycling Race',
    tagline: 'Uniting Communities, Fostering Peace & Crowned on the Historic Lubiri Circuit',
    type: 'upcoming',
    isFlagship: true,
    date: 'Saturday, October 24, 2026 • 06:30 AM EAT',
    location: 'Lubiri Ring Road Circuit, Mengo, Kampala',
    circuit: 'Lubiri Ring Road (3.5 km Closed High-Speed Loop)',
    distanceSummary: 'Up to 105 km (30 Laps) across 4 Divisions',
    description: 'The premier flagship cycling extravaganza organized by Together We Can Cycling Uganda Ltd under Director Solomon Ssebakaki. Bringing together elite peloton racers, passionate school kids (especially Senior One champions), armed forces units, and local community families in Katwe and Kampala.',
    heroImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1600&auto=format&fit=crop',
    registrationStatus: 'open',
    registrationDeadline: 'Registration closes 48 hours prior to race day',
    officialContacts: ['+256 706 770 872', '+256 763 145 915'],
    categories: FLAGSHIP_RACE_CATEGORIES,
    prizes: [
      {
        title: 'Documented Land Title',
        description: 'Awarded to the overall Elite Champion of the 105km test (sponsored parcel).',
        icon: 'Award',
      },
      {
        title: 'UGX 10,000,000+ Prize Purse',
        description: 'Cash rewards distributed across podium finishers in Elite, Youth, and Service ranks.',
        icon: 'Banknote',
      },
      {
        title: 'Youth Academic Cycling Grants',
        description: 'Term tuition grants & high-performance training gear for outstanding Senior One riders.',
        icon: 'GraduationCap',
      },
      {
        title: 'Custom Finisher Medals & TWC Kits',
        description: 'High-visibility athletic cycling apparel and commemorative medals for participants.',
        icon: 'ShieldCheck',
      },
    ],
    mapCoordinates: {
      lat: 0.3015,
      lng: 32.5642,
      circuitName: 'Lubiri Ring Road, Mengo, Kampala',
    },
  },
  {
    id: 'irene-gleeson-memorial',
    title: 'Irene Gleeson Memorial Bicycle Race (Northern Uganda Tour)',
    tagline: 'Charity, Reconciliation & Endurance across Kitgum and the Acholi Sub-region',
    type: 'milestone',
    isFlagship: false,
    date: 'Annual Milestone Expedition • Kitgum, Northern Uganda',
    location: 'Kitgum Town & Surrounding District Corridors',
    circuit: 'Cross-Terrain Regional Highway & Gravel Corridor',
    distanceSummary: '68 km Memorial Solidarity Road Stage',
    description: 'TWC Cycling Academy riders traveled over 450 km from Kampala to Kitgum in Northern Uganda to headline the Irene Gleeson Memorial Bicycle Race. Supporting orphaned youth, community health initiatives, and demonstrating the bicycle as a tool for post-conflict healing and unity.',
    heroImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7WBsfFNzFp04i3JTuiQCmIxNf9Y1L6-TeUcaewO_8mg&s',
    registrationStatus: 'completed',
    officialContacts: ['+256 706 770 872'],
    categories: [
      {
        id: 'ig-memorial-open',
        name: 'Open Regional Road Stage',
        distance: '68 km',
        targetGroup: 'Ugandan Academy Athletes & Northern Uganda Community Bikers',
        description: 'Challenging open road race commemorating the humanitarian legacy of Irene Gleeson.',
        requirements: ['All road and hybrid cycles', 'Mandatory safety protocol'],
        prizeHighlight: 'Community Trophy & Educational Support Fund',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        accentBorder: 'border-amber-500',
      },
    ],
    prizes: [
      {
        title: 'Community Relief & Medical Support',
        description: 'Direct charity raised for grassroots clinics and school supplies in Kitgum.',
        icon: 'HeartHandshake',
      },
    ],
  },
  {
    id: 'katwe-youth-crit',
    title: 'Katwe Grassroots Youth Criterium',
    tagline: 'Empowering urban youth from Katwe slums and Kampala schools through cycling mechanics and racing',
    type: 'upcoming',
    isFlagship: false,
    date: 'Saturday, December 12, 2026 • 07:00 AM EAT',
    location: 'Katwe Clocktower - Queen’s Way Loop, Kampala',
    circuit: '2.4 km Urban Circuit',
    distanceSummary: '36 km Junior Showcase',
    description: 'A focused grassroots speed race designed specifically for self-funded riders, young bicycle mechanics, and secondary school riders based around Katwe, BMK House, and Makindye.',
    heroImage: '/images/katwe-grassroots-criterium.jpg',
    registrationStatus: 'open',
    registrationDeadline: 'Registration open until race morning',
    officialContacts: ['+256 706 770 872', '+256 763 145 915'],
    categories: [
      {
        id: 'katwe-junior',
        name: 'Senior One to Senior Three Trophy',
        distance: '24 km',
        laps: '10 Laps',
        targetGroup: 'School Students aged 12-16',
        description: 'Showcasing fast cornering and technical pack riding skills on city asphalt.',
        requirements: ['School ID or birth document', 'Inspected bicycle'],
        prizeHighlight: 'Bicycle Toolkits, New Tires & Term School Materials',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        accentBorder: 'border-emerald-500',
      },
    ],
    prizes: [
      {
        title: 'Mechanical Workshop Toolkits',
        description: 'Professional tools and spare parts for aspiring youth bicycle mechanics.',
        icon: 'Wrench',
      },
    ],
  },
  {
    id: 'tour-of-buganda-circuit',
    title: 'Tour of Buganda Heritage Circuit',
    tagline: 'Historical milestone race celebrating cultural heritage and endurance athletics in Mengo',
    type: 'milestone',
    isFlagship: false,
    date: 'Past Championship Milestone • Kampala',
    location: 'Mengo - Kabaka Anjagala Road, Kampala',
    circuit: 'Royal Mile Avenue & Lubiri Environs',
    distanceSummary: '84 km Classical Circuit',
    description: 'A celebrated milestone event where TWC athletes demonstrated superior peloton tactics and teamwork, securing podium finishes across three distinct age brackets.',
    heroImage: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?q=80&w=1600&auto=format&fit=crop',
    registrationStatus: 'completed',
    officialContacts: ['+256 706 770 872'],
    categories: [],
    prizes: [
      {
        title: 'Royal Heritage Cups',
        description: 'Prestigious trophies honoring top regional cycling clubs in Uganda.',
        icon: 'Trophy',
      },
    ],
  },
];

export const ADVOCACY_STORIES: CommunityAdvocacyStory[] = [
  {
    id: 'irene-gleeson-journey',
    title: 'Expedition to Kitgum: Irene Gleeson Memorial Bicycle Race',
    location: 'Northern Uganda (Kitgum & Acholi Region)',
    year: 'Regional Advocacy Milestone',
    summary: 'Led by Director Solomon Ssebakaki, TWC Cycling Academy mounted a full caravan to travel from Katwe, Kampala to Northern Uganda. Competing in the Irene Gleeson Memorial Bicycle Race, the team bridged sports diplomacy and charity, uplifting youth affected by historical regional conflicts.',
    impactMetrics: '450+ km journey • 18 TWC Athletes fielded • Supported 200+ local school children',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7WBsfFNzFp04i3JTuiQCmIxNf9Y1L6-TeUcaewO_8mg&s',
    tags: ['Northern Uganda', 'Memorial Race', 'Peace & Youth', 'Regional Tour'],
    keyHighlight: 'Demonstrated how grassroots cycling connects urban athletes with rural communities in national unity.',
  },
  {
    id: 'self-funded-athletes',
    title: 'Lifting Self-Funded Athletes & Mechanics in Katwe',
    location: 'Katwe Industrial & Commercial Hub, Kampala',
    year: 'Ongoing Grassroots Initiative',
    summary: 'Most talented cyclists in Uganda start with second-hand steel frames and zero corporate sponsorship. TWC provides essential race gear, nutrition advice, bike fitting, and maintenance workshops out of BMK House in Katwe, turning raw hustle into podium finishes.',
    impactMetrics: '85+ Self-funded cyclists supported • 120+ wheel truing & gear service workshops',
    imageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=1200&auto=format&fit=crop',
    tags: ['Katwe Hub', 'Equipment Sponsorship', 'Mechanical Training', 'Grassroots'],
    keyHighlight: 'No rider is turned away due to lack of an expensive carbon frame; passion and dedication come first.',
  },
  {
    id: 'schools-senior-one',
    title: 'Senior One & School Youth Cycling Development Program',
    location: 'Kampala & Wakiso Secondary Schools',
    year: 'Schools Outreach Initiative',
    summary: 'Focusing on pupils entering secondary school (Senior One), this program embeds road cycling discipline, safety, and physical resilience. Students learn peloton etiquette, helmet safety, and have a clear pathway to national competition.',
    impactMetrics: '14 Partner schools engaged • 230+ Junior riders mentored • 40 academic kits distributed',
    imageUrl: 'https://images.unsplash.com/photo-1528720208104-3d9bd03cc9d4?q=80&w=1200&auto=format&fit=crop',
    tags: ['Senior One', 'Youth Sports', 'School Cups', 'Safety First'],
    keyHighlight: 'Balancing rigorous classroom academics with the discipline and stamina of endurance cycling.',
  },
  {
    id: 'women-veterans-inclusion',
    title: 'Expanding the Peloton for Women & Community Veterans',
    location: 'Lubiri Ring Road Weekly Circuits',
    year: 'Inclusive Community Program',
    summary: 'Breaking traditional barriers by establishing dedicated non-intimidating training pacelines for women cyclists, working mothers, and community veterans looking to stay active and maintain cardiovascular health.',
    impactMetrics: '45+ Female club members • Weekly veteran weekend group rides • Zero-harassment ride culture',
    imageUrl: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?q=80&w=1200&auto=format&fit=crop',
    tags: ['Women in Cycling', 'Veterans', 'Inclusivity', 'Health & Fitness'],
    keyHighlight: 'Creating a welcoming, safe environment where riders of all ages and genders pedal together as one family.',
  },
];

export const LUBIRI_CIRCUIT_DETAILS = {
  circuitName: 'Lubiri Ring Road Circuit',
  subCounty: 'Mengo, Lubaga Division, Kampala',
  lapLengthKm: 3.5,
  surface: 'Smooth City Asphalt with slight gradient undulations',
  turnsCount: 4,
  elevationPerLapM: 32,
  description: 'A 3.5-kilometer loop circumnavigating the historic walls of Kabaka’s Palace in Mengo. Wide, high-speed sweeping corners, a punchy false flat on the eastern straight, and a wide 400m sprint finish straight along the main palace boulevard.',
  checkpoints: [
    { name: 'Start / Finish Arch', desc: 'Main Lubiri Royal Palace Gate avenue, timing chip scanners & grandstand' },
    { name: 'Feed & Neutral Mechanical Zone', desc: 'Stationed at Lap km 1.8 for spare wheels, water musettes & first aid' },
    { name: 'Mengo Hill False Flat', desc: 'A subtle 3.8% gradient where breakaways test the peloton’s legs' },
    { name: 'Palace Wall Corner 3', desc: 'High-speed 90-degree left hander requiring precise pack positioning' },
    { name: '400m Sprint Shootout Straight', desc: 'Wide asphalt straightway for explosive mass sprints' },
  ],
};

export interface MediaVideoItem {
  id: string;
  title: string;
  duration: string;
  views: string;
  uploadDate: string;
  category: string;
  thumbnail: string;
  youtubeId?: string;
  channelId: string;
  description: string;
  videoUrl?: string;
}

export function extractYouTubeId(url?: string): string | null {
  if (!url) return null;
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|live\/|watch\?v=|watch\?.+&v=))([\w-]{11})/;
  const match = url.match(regExp);
  if (match && match[1]) return match[1];
  const fallback = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]{11}).*/;
  const fbMatch = url.match(fallback);
  return fbMatch ? fbMatch[2] : null;
}

export function extractTikTokInfo(url?: string): {
  isTikTok: boolean;
  videoId?: string;
  username?: string;
  cleanUrl: string;
  embedUrl?: string;
} {
  if (!url || !url.trim()) return { isTikTok: false, cleanUrl: '' };
  const cleaned = url.trim();
  const isTikTok = /(?:tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com)/i.test(cleaned);

  // Extract video ID (e.g. /video/7339182391234567890 or /v/7339182391234567890 or /embed/v2/7339182391234567890)
  const videoIdMatch = cleaned.match(/(?:video\/|v\/|embed\/v2\/|embed\/|player\/v1\/)(\d+)/);
  const videoId = videoIdMatch ? videoIdMatch[1] : undefined;

  // Extract username (e.g. /@togetherwecancyclingug)
  const userMatch = cleaned.match(/@([\w.-]+)/);
  const username = userMatch ? userMatch[1] : undefined;

  const embedUrl = videoId ? `https://www.tiktok.com/embed/v2/${videoId}` : undefined;

  return {
    isTikTok,
    videoId,
    username,
    cleanUrl: cleaned,
    embedUrl,
  };
}

export interface TikTokPreviewData {
  thumbnailUrl?: string;
  title?: string;
  authorName?: string;
  authorUniqueId?: string;
  embedHtml?: string;
  videoId?: string;
  embedUrl?: string;
}

/**
 * Automatically fetch preview metadata (cover thumbnail, video title, author)
 * directly from the provided TikTok video link using oEmbed API
 */
export async function fetchTikTokMediaPreview(url: string): Promise<TikTokPreviewData | null> {
  if (!url || !url.trim()) return null;
  const info = extractTikTokInfo(url);
  if (!info.isTikTok) return null;

  const baseResult: TikTokPreviewData = {
    videoId: info.videoId,
    embedUrl: info.embedUrl,
  };

  try {
    const res = await fetch(`/api/tiktok-oembed?url=${encodeURIComponent(info.cleanUrl)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && (data.thumbnail_url || data.title)) {
        return {
          thumbnailUrl: data.thumbnail_url,
          title: data.title,
          authorName: data.author_name,
          authorUniqueId: data.author_unique_id,
          embedHtml: data.html,
          videoId: data.embed_product_id || info.videoId,
          embedUrl: `https://www.tiktok.com/embed/v2/${data.embed_product_id || info.videoId}`,
        };
      }
    }
  } catch {
    // fallback to direct request
  }

  try {
    const directRes = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(info.cleanUrl)}`);
    if (directRes.ok) {
      const data = await directRes.json();
      if (data && (data.thumbnail_url || data.title)) {
        return {
          thumbnailUrl: data.thumbnail_url,
          title: data.title,
          authorName: data.author_name,
          authorUniqueId: data.author_unique_id,
          embedHtml: data.html,
          videoId: data.embed_product_id || info.videoId,
          embedUrl: `https://www.tiktok.com/embed/v2/${data.embed_product_id || info.videoId}`,
        };
      }
    }
  } catch {
    // Ignore error
  }

  return baseResult;
}

export function extractInstagramInfo(url?: string): {
  isInstagram: boolean;
  shortcode?: string;
  isReel: boolean;
  username?: string;
  cleanUrl: string;
} {
  if (!url || !url.trim()) return { isInstagram: false, isReel: false, cleanUrl: '' };
  const cleaned = url.trim();
  const isInstagram = /(?:instagram\.com|instagr\.am)/i.test(cleaned);

  // Check if reel
  const isReel = /(?:\/reel\/|\/reels\/)/i.test(cleaned);

  // Extract post or reel shortcode (e.g. /p/C8qL90X.../ or /reel/C8qL90X.../)
  const codeMatch = cleaned.match(/(?:\/p\/|\/reel\/|\/reels\/|\/tv\/)([\w-]+)/);
  const shortcode = codeMatch ? codeMatch[1] : undefined;

  // Extract username if profile
  const userMatch = cleaned.match(/(?:instagram\.com|instagr\.am)\/([a-zA-Z0-9._]+)/);
  const username =
    userMatch && !['p', 'reel', 'reels', 'tv', 'stories', 'explore'].includes(userMatch[1])
      ? userMatch[1]
      : undefined;

  return {
    isInstagram,
    shortcode,
    isReel,
    username,
    cleanUrl: cleaned,
  };
}

export function formatContentUrl(url?: string, defaultUrl?: string): string {
  if (!url || !url.trim()) return defaultUrl || '#';
  let cleaned = url.trim();
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = `https://${cleaned}`;
  }
  return cleaned;
}

export interface TikTokItem {
  id: string;
  caption: string;
  likes: string;
  views: string;
  comments: string;
  audioTrack: string;
  thumbnail: string;
  videoUrl: string;
  tag: string;
  category?: string;
  title?: string;
  url?: string;
  mediaUrl?: string;
  embedId?: string;
}

export interface InstagramItem {
  id: string;
  caption: string;
  likes: string;
  comments: string;
  date: string;
  imageUrl: string;
  postUrl: string;
  location: string;
  tag: string;
  category?: string;
  title?: string;
  url?: string;
  thumbnail?: string;
  videoUrl?: string;
  mediaUrl?: string;
  shortcode?: string;
  embedId?: string;
}

export const YOUTUBE_CHANNEL = {
  id: 'UCcyYTjupx6KfAfe-ON_Wqlg',
  name: 'TWC CYCLING (Together We Can Cycling Ug)',
  handle: '@TogetherWeCanCyclingUG',
  url: 'https://www.youtube.com/channel/UCcyYTjupx6KfAfe-ON_Wqlg',
  subscribers: '362+ subscribers',
  videoCount: '49+ official videos',
  description: 'Promoting Ugandan cycling, organizing high-stakes races with genuine land titles & monetary prizes, empowering grassroots youth, and bringing schools into competitive cycling.',
};

export const YOUTUBE_MEDIA: MediaVideoItem[] = [
  {
    id: 'yt-1',
    title: "MIIRO PAUL'S attack that left Andrew from Masaka helpless in the Reconciliatory cycling race 2026",
    duration: '12:45',
    views: '5.2K views',
    uploadDate: 'Official Race Coverage',
    category: 'Flagship Race',
    thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop',
    channelId: 'UCcyYTjupx6KfAfe-ON_Wqlg',
    description: 'Watch the decisive decisive breakaway attack by Paul Miiru (Miiro Paul) along the Lubiri circuit that secured the inaugural Reconciliatory championship title.',
    videoUrl: 'https://www.youtube.com/channel/UCcyYTjupx6KfAfe-ON_Wqlg',
  },
  {
    id: 'yt-2',
    title: 'See how Aziz Ssempijja dominated the Kasese classic cycling race 2026',
    duration: '16:12',
    views: '4.7K views',
    uploadDate: 'Tour Highlights',
    category: 'Regional Classic',
    thumbnail: '/images/aziz-ssempijja-race.jpg',
    youtubeId: 'DCHD5gQPYqA',
    channelId: 'UCcyYTjupx6KfAfe-ON_Wqlg',
    description: 'Star cyclist Aziz Ssempijja puts on a masterclass performance in the challenging terrain of the Western Uganda Kasese classic tour.',
    videoUrl: 'https://www.youtube.com/watch?v=DCHD5gQPYqA',
  },
  {
    id: 'yt-3',
    title: "The Reconciliatory cycling race and inter schools cycling competitions 2026",
    duration: '21:30',
    views: '6.1K views',
    uploadDate: 'Community Special',
    category: 'Schools & Youth',
    thumbnail: 'https://images.unsplash.com/photo-1528720208104-3d9bd03cc9d4?q=80&w=800&auto=format&fit=crop',
    channelId: 'UCcyYTjupx6KfAfe-ON_Wqlg',
    description: 'Comprehensive coverage of the inter-schools youth competition, uniting students, armed forces, and elite cyclists under the theme of peace and reconciliation.',
    videoUrl: 'https://www.youtube.com/channel/UCcyYTjupx6KfAfe-ON_Wqlg',
  },
  {
    id: 'yt-4',
    title: "Uganda's cycling sport elevating to another level by entering schools (Namilyango High School Gulama)",
    duration: '09:50',
    views: '3.4K views',
    uploadDate: 'Youth Initiative',
    category: 'Grassroots Education',
    thumbnail: '/images/namilyango-cycling-school.jpg',
    youtubeId: '7KxG7z0I00Q',
    channelId: 'UCcyYTjupx6KfAfe-ON_Wqlg',
    description: 'TWC Cycling Academy introducing competitive cycling programs, safety clinics, and bike mentorship to students at Namilyango High School Gulama.',
    videoUrl: 'https://www.youtube.com/watch?v=7KxG7z0I00Q',
  },
  {
    id: 'yt-5',
    title: "''Together we unite'' - Cyclists still on the move of coming together",
    duration: '14:15',
    views: '4.1K views',
    uploadDate: 'Peloton Pack',
    category: 'Joint Road Training',
    thumbnail: '/images/together-we-unite-peloton.jpg',
    youtubeId: 'V0MWeSsgF-s',
    channelId: 'UCcyYTjupx6KfAfe-ON_Wqlg',
    description: 'Over 100 Ugandan cyclists from multiple clubs and divisions riding together in a historic joint endurance training peloton across Kampala.',
    videoUrl: 'https://www.youtube.com/watch?v=V0MWeSsgF-s',
  },
  {
    id: 'yt-6',
    title: 'Aziz Sempijja dominates Together We Can cycling club race',
    duration: '11:20',
    views: '3.8K views',
    uploadDate: 'Club Race',
    category: 'Academy Championship',
    thumbnail: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=800&auto=format&fit=crop',
    channelId: 'UCcyYTjupx6KfAfe-ON_Wqlg',
    description: 'Intense wheel-to-wheel academy racing featuring club veterans, rising youth, and national contenders testing their race fitness.',
    videoUrl: 'https://www.youtube.com/channel/UCcyYTjupx6KfAfe-ON_Wqlg',
  },
  {
    id: 'yt-lubiri-drill',
    title: 'Lubiri Ring Road Sprint Pack Training Drill',
    duration: '0:58',
    views: '2.4K views',
    uploadDate: 'Circuit Training',
    category: 'Youth Training',
    thumbnail: '/images/lubiri-sprint-drill.jpg',
    youtubeId: 'nBz2AddtXRY',
    channelId: 'UCcyYTjupx6KfAfe-ON_Wqlg',
    description: 'TWC youth squad paceline execution and drafting techniques around the 3.8 km Lubiri Palace tarmac circuit.',
    videoUrl: 'https://www.youtube.com/watch?v=nBz2AddtXRY',
  },
];

export const TIKTOK_ACCOUNT = {
  name: 'Together We Can Cycling UG',
  handle: '@togetherwecancyclingug',
  displayName: 'Together We Can Cycling UG',
  followers: '24.8K',
  likes: '340K',
  url: 'https://www.tiktok.com/@togetherwecancyclingug?is_from_webapp=1&sender_device=pc',
  bio: 'Uganda’s premier cycling academy 🇺🇬 | Katwe, Kampala | Manager Solo | Pelotons, sprints & youth empowerment 🚲',
};

export const TIKTOK_MEDIA: TikTokItem[] = [
  {
    id: 'tt-1',
    caption: 'That explosive 200m mass sprint along Lubiri Palace straight! Who took the wheel? 💨🔥 #UgandaCycling #LubiriRingRoad #ManagerSolo',
    likes: '12.4K',
    views: '88.6K',
    comments: '412',
    audioTrack: 'Original Sound - TWC Cycling UG',
    thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=600&auto=format&fit=crop',
    videoUrl: 'https://www.tiktok.com/@togetherwecancyclingug?is_from_webapp=1&sender_device=pc',
    tag: 'Race Finish',
  },
  {
    id: 'tt-2',
    caption: 'Manager Solo in Katwe showing our junior riders how to build and true race wheels with second-hand hubs 🛠️🚴 #GrassrootsSports #KatweTalent',
    likes: '8.9K',
    views: '64.1K',
    comments: '298',
    audioTrack: 'Ugandan Afrobeats Instrumental',
    thumbnail: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=600&auto=format&fit=crop',
    videoUrl: 'https://www.tiktok.com/@togetherwecancyclingug?is_from_webapp=1&sender_device=pc',
    tag: 'Mechanic Skills',
  },
  {
    id: 'tt-3',
    caption: 'Senior One riders holding a 43km/h paceline on Mengo Hill! The future of Ugandan cycling is fearless 🌟🚴‍♂️ #YouthInSports #SeniorOne',
    likes: '15.1K',
    views: '102K',
    comments: '530',
    audioTrack: 'High Energy Beat - Peloton Mix',
    thumbnail: 'https://images.unsplash.com/photo-1528720208104-3d9bd03cc9d4?q=80&w=600&auto=format&fit=crop',
    videoUrl: 'https://www.tiktok.com/@togetherwecancyclingug?is_from_webapp=1&sender_device=pc',
    tag: 'Youth Paceline',
  },
  {
    id: 'tt-4',
    caption: 'When they announce the Grand Prize is a documented Land Title for the 105km Elite Champion! 🏆📜🎉 #ReconciliatoryRace #Uganda',
    likes: '19.8K',
    views: '145K',
    comments: '780',
    audioTrack: 'Celebration Sound - Kampala Vibes',
    thumbnail: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=600&auto=format&fit=crop',
    videoUrl: 'https://www.tiktok.com/@togetherwecancyclingug?is_from_webapp=1&sender_device=pc',
    tag: 'Grand Prize',
  },
];

export const INSTAGRAM_ACCOUNT = {
  name: 'TWC Cycling Uganda',
  handle: '@togetherwecancyclingug',
  displayName: 'Together We Can Cycling UG',
  followers: '14.2K',
  url: 'https://www.instagram.com/togetherwecancyclingug/',
  bio: 'Official Instagram of Together We Can Cycling Uganda Limited. Home of the Lubiri 105KM Reconciliatory Race.',
};

export const INSTAGRAM_MEDIA: InstagramItem[] = [
  {
    id: 'ig-1',
    caption: 'Breakaway squad hammering through Lap 22 under the Mengo morning sun. Sweat, strategy, and pure Ugandan power. 🚲🇺🇬 #TWCCycling #LubiriCircuit',
    likes: '1,420',
    comments: '88',
    date: '2 DAYS AGO',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop',
    postUrl: 'https://www.instagram.com/togetherwecancyclingug/',
    location: 'Lubiri Ring Road, Mengo, Kampala',
    tag: 'Peloton Action',
  },
  {
    id: 'ig-2',
    caption: 'Manager Solomon Ssebakaki congratulating our newest cohort of Senior One school riders at BMK House Katwe. Discipline on the road and excellence in school! 📚🚴',
    likes: '980',
    comments: '42',
    date: '4 DAYS AGO',
    imageUrl: 'https://images.unsplash.com/photo-1528720208104-3d9bd03cc9d4?q=80&w=800&auto=format&fit=crop',
    postUrl: 'https://www.instagram.com/togetherwecancyclingug/',
    location: 'BMK House, Katwe, Kampala',
    tag: 'Youth Mentorship',
  },
  {
    id: 'ig-3',
    caption: 'Flashback to Kitgum, Northern Uganda during the Irene Gleeson Memorial Bicycle Race. The sport of cycling uniting communities across regions. 🕊️',
    likes: '1,890',
    comments: '114',
    date: 'LAST WEEK',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7WBsfFNzFp04i3JTuiQCmIxNf9Y1L6-TeUcaewO_8mg&s',
    postUrl: 'https://www.instagram.com/togetherwecancyclingug/',
    location: 'Kitgum, Northern Uganda',
    tag: 'Memorial Tour',
  },
  {
    id: 'ig-4',
    caption: 'Official inspection of the 105KM course signage and medical stations ahead of the Inaugural Reconciliatory Cycling Race. Safety first for every athlete. 🛑🏁',
    likes: '1,150',
    comments: '53',
    date: 'LAST WEEK',
    imageUrl: 'https://images.unsplash.com/photo-1474962558142-9ca83af74bb7?q=80&w=800&auto=format&fit=crop',
    postUrl: 'https://www.instagram.com/togetherwecancyclingug/',
    location: 'Mengo Palace Gates, Kampala',
    tag: 'Course Marshals',
  },
];

