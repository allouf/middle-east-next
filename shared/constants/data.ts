import { IconType } from "react-icons";
import { FaUser, FaHeart } from "react-icons/fa";
import {
  FiHome,
  FiBriefcase,
  FiPlusCircle,
  FiPhone,
  FiLogIn,
  FiUserPlus,
  FiGrid,
  FiShield,
  FiLayers,
  FiShare2,
  FiClock,
  FiUser,
  FiShoppingBag,
  FiCreditCard,
  FiUserCheck,
} from "react-icons/fi";
import { MdCampaign } from "react-icons/md";

// Normalize remote URLs to https to avoid mixed-content blocking in production
export const ensureHttps = (url: string): string => url.replace(/^http:\/\//i, "https://");

const deriveApiOrigin = (url: string): string =>
  ensureHttps(url)
    .replace(/\/api\/v\d+\/?$/i, "")
    .replace(/\/api\/?$/i, "");

// Backend API Base URLs
// These should be set in your .env.local file
// Default: UAT environment
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  "https://apiuat.middleeastcommerce.net/api/v1";
const API_ORIGIN = deriveApiOrigin(API_URL);

export const baseURL: string = typeof window !== "undefined" ? "/api/proxy" : ensureHttps(API_URL);
export const broadcastURL: string = `${API_ORIGIN}/broadcasting/auth`;
export const storageURL: string = `${API_ORIGIN}/storage`;
export const backUrl: string = API_ORIGIN;



export interface NavItem {
  name: string;
  icon: IconType;
  path: string;
  isSmall?: boolean;
  disabled?: boolean;
}

export const headerUnauthData: NavItem[] = [
  { name: "nav.home", icon: FiHome, path: "/" },

];

export const headerData: NavItem[] = [
  { name: "nav.home", icon: FiHome, path: "/" },
  { name: "nav.profile", icon: FaUser, path: "/profile" },
  // { name: "nav.jobs", icon: FiBriefcase, path: "/jobs" },
  // { name: "nav.community", icon: FiUsers, path: "/community" },
  // { name: "nav.auction", icon: FiPlusCircle, path: "/auctions" },
  { name: "nav.ads", icon: MdCampaign, path: "/ads" },
  { name: "nav.jobs", icon: FiBriefcase, path: "/jobs" },
  { name: "nav.services", icon: FiBriefcase, path: "/services" },
  // { name: "nav.contact", icon: FiPhone, path: "/contact" },
  { name: "nav.wishlist", icon: FaHeart, path: "/profile?tab=wishlist" },
];

export const sideNavData: NavItem[] = [
  { name: "nav.dashboard", icon: FiGrid, path: "/dashboard" },
  { name: "nav.profile", icon: FiUser, path: "/profile" },
  { name: "nav.wallet", icon: FiCreditCard, path: "/wallet" },
  // { name: "nav.stores", icon: FiMapPin, path: "/stores", disabled: true },
  { name: "nav.usedMarket", icon: FiShoppingBag, path: "/ads" },
  { name: "nav.freeZone", icon: FiShield, path: "/free-zone" },
  { name: "nav.jobs", icon: FiBriefcase, path: "/jobs" },
  { name: "nav.services", icon: FiLayers, path: "/services" },
  { name: "nav.sellerStripeOnboarding", icon: FiUserCheck, path: "/seller/stripe-onboarding" },
  { name: "nav.contact", icon: FiPhone, path: "/contact", disabled: true },
  { name: "nav.auction", icon: FiPlusCircle, path: "/auctions", disabled: true },
  { name: "nav.socialMedia", icon: FiShare2, path: "/social-media", disabled: true },
  { name: "nav.echoesOfTime", icon: FiClock, path: "/echoes-of-time", disabled: true },
];


export const headerAuthData: NavItem[] = [
  { name: "nav.login", icon: FiLogIn, path: "/login", isSmall: true },
  { name: "nav.signup", icon: FiUserPlus, path: "/register", isSmall: false },
];

const pagePath = (slug: string) => `/_pages/${slug}`;

// Footer
export interface FooterLink {
  key: string;
  label: string;
  path: string;
}

export const ABOUT_MIDDLE_EAST_LINKS: FooterLink[] = [
  {
    key: "about",
    label: "About us",
    path: "",
  },
  {
    key: "sitemap",
    label: "Sitemap",
    path: "",
  },
  {
    key: "guide-user",
    label: "Guide User",
    path: "",
  },
  {
    key: "help-center",
    label: "FAQ / Help Center",
    path: "",
  },
  {
    key: "how-it-works",
    label: "How does the platform work?",
    path: "",
  },
  {
    key: "faq",
    label: "Frequently Asked Questions",
    path: "",
  },
];

export const PROFESSIONAL_SECTION_LINKS: FooterLink[] = [
  {
    key: "advertise",
    label: "Advertise with us",
    path: "",
  },
  {
    key: "join-provider",
    label: "Join as a service provider",
    path: "",
  },
  {
    key: "vacancies",
    label: "Vacancies in East Middle",
    path: "",
  },
  {
    key: "partnerships",
    label: "Partnerships and distributors",
    path: "",
  },
  {
    key: "registration",
    label: "Registration of companies and institutions",
    path: "",
  },
];

export const LEGAL_NOTICES_LINKS: FooterLink[] = [
  {
    key: "terms-of-use",
    label: "Terms of Use",
    path: "",
  },
  {
    key: "privacy-policy",
    label: "Privacy Policy",
    path: "",
  },
  {
    key: "terms-and-conditions",
    label: "Terms & Conditions",
    path: "",
  },
  {
    key: "cookies-policy",
    label: "Cookies Policy",
    path: "",
  },
];



export const perPage: number = 10;

export const BACKGROUND_COLORS: string[] = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#000000",
  "#ffffff",
];

export interface TestImage {
  id: number;
  path: string;
}

export const Test_images: TestImage[] = [
  { id: 1, path: "/ReferralImage.png" },
  { id: 2, path: "/syriaFlag.png" },
  { id: 3, path: "/ReferralImage.png" },
  { id: 5, path: "/syriaFlag.png" },
  { id: 6, path: "/ReferralImage.png" },
  { id: 7, path: "/syriaFlag.png" },
  { id: 8, path: "/ReferralImage.png" },
];

