export type AgeCategory = 'Elite' | 'Youth' | 'Veteran' | 'Fan';

export type ExperienceLevel = 'Beginner / First-Time Rider' | 'Intermediate Club Rider' | 'Competitive Elite / Racer' | 'Junior School Competitor (e.g. Senior One)';

export type AdminRole = 'super_admin' | 'race_coordinator' | 'academy_trainer';

export interface RaceCategory {
  id: string;
  name: string;
  distance: string;
  laps?: string;
  targetGroup: string;
  description: string;
  requirements: string[];
  prizeHighlight: string;
  badgeColor: string;
  accentBorder: string;
}

export interface CyclingEvent {
  id: string;
  title: string;
  tagline: string;
  type: 'upcoming' | 'milestone';
  date: string;
  location: string;
  circuit: string;
  isFlagship?: boolean;
  distanceSummary: string;
  categories: RaceCategory[];
  heroImage: string;
  description: string;
  registrationStatus: 'open' | 'closed' | 'completed';
  registrationDeadline?: string;
  officialContacts: string[];
  prizes: {
    title: string;
    description: string;
    icon: string;
  }[];
  mapCoordinates?: {
    lat: number;
    lng: number;
    circuitName: string;
  };
}

export interface CommunityAdvocacyStory {
  id: string;
  title: string;
  location: string;
  year: string;
  summary: string;
  impactMetrics: string;
  imageUrl: string;
  tags: string[];
  keyHighlight: string;
}

export interface MemberRegistration {
  id: string;
  fullName: string;
  ageCategory: AgeCategory;
  phone: string;
  experienceLevel: ExperienceLevel;
  email?: string;
  interestedRace?: string;
  schoolOrClub?: string;
  registrationDate: string;
  status: 'Confirmed' | 'Pending Review';
  ticketCode: string;
}

// Admin Panel CRM: Comprehensive Rider Profile
export interface RiderProfile {
  id: string;
  name: string;
  category: 'Elite Field' | 'Schools & Youth (Senior One)' | 'Armed Forces Field' | 'Family & Fans';
  age: number;
  licensingLevel: 'UCF / UCI Licensed' | 'Academy Cadet' | 'School Competitor (Senior One)' | 'Junior' | 'Club Veteran';
  contactPhone: string;
  email?: string;
  schoolOrClub: string;
  bibNumber: string;
  paymentStatus: 'Approved' | 'Pending Verification' | 'Exempt / Scholarship';
  dateJoined: string;
  status: 'Active' | 'Under Training' | 'Graduated' | 'Inactive';
}

// Leaderboard and Results Matrix
export interface LeaderboardResult {
  id: string;
  eventId: string;
  eventTitle: string;
  categoryName: string;
  position: number;
  riderName: string;
  teamOrSchool: string;
  timeOrGap: string;
  lapsCompleted: number | string;
  averageSpeed?: string;
  prizeWon?: string;
}

// Attendance & Training Log
export interface TrainingSession {
  id: string;
  date: string;
  location: string;
  focus: string;
  trainerName: string;
  attendanceCount: number;
  equipmentChecked: {
    helmets: number;
    jerseys: number;
    bikesInspected: number;
  };
  notes: string;
}

// Financials & Payment Verification
export interface PaymentTransaction {
  id: string;
  referenceId: string;
  payerName: string;
  amountUGX: number;
  paymentMethod: 'MTN MoMo' | 'Airtel Money' | 'Bank Transfer' | 'Cash Receipt';
  purpose: 'Race Registration Fee' | 'Academy Term Kit' | 'Sponsor Contribution' | 'Licensing Fee';
  riderId?: string;
  bibAssigned?: string;
  timestamp: string;
  status: 'Approved' | 'Pending' | 'Rejected' | 'On Hold';
  verifiedBy?: string;
}

// Website CMS: News & Notice Board
export interface NoticeItem {
  id: string;
  title: string;
  badge: string;
  content: string;
  date: string;
  pinned: boolean;
  actionLink?: string;
  actionText?: string;
}

// Website CMS: Sponsor Hub
export interface SponsorItem {
  id: string;
  name: string;
  tier: 'Headline / Land Title' | 'Gold Sponsor' | 'Silver Partner' | 'Equipment Partner';
  tierWeight: number; // 1 = highest priority (e.g. Century Properties)
  logoUrl: string;
  websiteUrl?: string;
  bannerPlacement: 'Header Carousel' | 'Footer Banner' | 'Race Finish Arch' | 'All';
  active: boolean;
  description?: string;
}

// Website CMS: Gallery Photo
export interface GalleryPhotoItem {
  id: string;
  title: string;
  imageUrl: string;
  caption: string;
  eventTag: string;
  date: string;
}

// Security & Audit Log
export interface AuditLogEntry {
  id: string;
  adminRole: AdminRole;
  adminName: string;
  action: string;
  details: string;
  timestamp: string;
  module: 'events' | 'crm' | 'financials' | 'cms' | 'media' | 'security';
}

// Social Media Item for CMS Link Editor
export interface SocialMediaItem {
  id: string;
  title?: string;
  caption?: string;
  videoUrl?: string;
  postUrl?: string;
  url?: string;
  embedId?: string;
  author?: string;
  youtubeId?: string;
  thumbnail?: string;
  imageUrl?: string;
  category?: string;
  tag?: string;
  likes?: string;
  views?: string;
  comments?: string;
  duration?: string;
  uploadDate?: string;
  date?: string;
  location?: string;
  description?: string;
  audioTrack?: string;
}

export interface SiteContentSettings {
  announcementBanner: string;
  hotline1: string;
  hotline2: string;
  headquartersAddress: string;
  heroHeadline: string;
  heroSubtitle: string;
  contactEmail: string;
}

