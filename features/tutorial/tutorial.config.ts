// tutorial.config.ts
import React from 'react';

// tutorial.config.ts
import {
  MdOutlineStorefront,
  MdOutlineHeadphones,
} from 'react-icons/md';
import { FiBox } from 'react-icons/fi';
import { BsPeople } from 'react-icons/bs';
import { RiCoupon2Line } from 'react-icons/ri';
import { LuBadgePercent } from 'react-icons/lu';
import { Box, Star, Shield, Package, Heart, MapPin, Building2, Trash2, Ticket } from 'lucide-react';
import { TbPackages } from 'react-icons/tb';
import { FaRegUser } from 'react-icons/fa';
import { BiDevices } from 'react-icons/bi';
import { GrCompare } from 'react-icons/gr';

export const STORE_ICONS = {
  store: MdOutlineStorefront,
  products: FiBox,
  members: BsPeople,
  coupons: RiCoupon2Line,
  tickets: MdOutlineHeadphones,
  flash: LuBadgePercent,
  orders: Box,
  reviews: Star,
  settings: Shield,
  inventory: Package,
  packages: TbPackages,
};

export const PROFILE_ICONS = {
  personal: FaRegUser,
  devices: BiDevices,
  wishlist: Heart,
  orders: Box,
  addresses: MapPin,
  security: Shield,
  stores: Building2,
  trashed: Trash2,
  compare: GrCompare,
  tickets: Ticket,
}


export type TutorialSection = {
  headingKey: string;
  subtitleKey?: string;
  paragraphKeys?: string[];
};

export type TutorialItem = {
  /** ✅ was string, must be ReactNode */
  icon: React.ElementType;
  titleKey: string;
  descKey: string;
};

export type TutorialSlide = {
  key: string;
  imageSrc?: string;

  // ✅ Either single heading OR multiple sections
  headingKey?: string;
  subtitleKey?: string;
  paragraphKeys?: string[];

  // ✅ New
  sections?: TutorialSection[];

  items?: TutorialItem[];
  closingKeys?: string[];
};

export type TutorialConfig = {
  storageKey: string;
  modalTitleKey: string;
  modalSubtitleKey?: string;
  slides: TutorialSlide[];
};

export const PROFILE_TUTORIAL: TutorialConfig = {
  storageKey: 'onboarding_profile_seen_v1',
  modalTitleKey: 'onboarding.profile.title',
  modalSubtitleKey: 'onboarding.profile.subtitle',
  slides: [
    {
      key: 'profile-1',
      headingKey: 'onboarding.profile.overview.title',
      paragraphKeys: [
        'onboarding.profile.overview.p1',
        'onboarding.profile.overview.p2',
      ],
    },
    {
      key: 'profile-2',
      headingKey: 'onboarding.profile.sections.title',
      items: [
        { icon: PROFILE_ICONS.personal, titleKey: 'onboarding.profile.personal_info.title', descKey: 'onboarding.profile.personal_info.desc', },
        { icon: PROFILE_ICONS.devices, titleKey: 'onboarding.profile.devices.title', descKey: 'onboarding.profile.devices.desc', },
        { icon: PROFILE_ICONS.wishlist, titleKey: 'onboarding.profile.wishlist.title', descKey: 'onboarding.profile.wishlist.desc', },
        { icon: PROFILE_ICONS.orders, titleKey: 'onboarding.profile.orders.title', descKey: 'onboarding.profile.orders.desc', },
        { icon: PROFILE_ICONS.addresses, titleKey: 'onboarding.profile.addresses.title', descKey: 'onboarding.profile.addresses.desc', },
      ],
    },
    {
      key: 'profile-3',
      headingKey: 'onboarding.profile.sections.title',
      items: [
        { icon: PROFILE_ICONS.security, titleKey: 'onboarding.profile.security.title', descKey: 'onboarding.profile.security.desc', },
        { icon: PROFILE_ICONS.stores, titleKey: 'onboarding.profile.store.title', descKey: 'onboarding.profile.store.desc', },
        { icon: PROFILE_ICONS.trashed, titleKey: 'onboarding.profile.trash.title', descKey: 'onboarding.profile.trash.desc', },
        { icon: PROFILE_ICONS.compare, titleKey: 'onboarding.profile.compare.title', descKey: 'onboarding.profile.compare.desc', },
        { icon: PROFILE_ICONS.tickets, titleKey: 'onboarding.profile.tickets.title', descKey: 'onboarding.profile.tickets.desc', },
      ],
    },
    {
      key: 'profile-4',
      headingKey: 'onboarding.profile.closing.title',
      closingKeys: [
        'onboarding.profile.closing.p1',
        'onboarding.profile.closing.p2',
      ],
    },
  ],
};

export const STORE_TUTORIAL: TutorialConfig = {
  storageKey: 'onboarding_store_seen_v1',
  modalTitleKey: 'onboarding.store.title',
  modalSubtitleKey: 'onboarding.store.subtitle',
  slides: [
    {
      key: 'store-1',
      sections: [
        {
          headingKey: 'onboarding.store.overview.title',
          paragraphKeys: ['onboarding.store.overview.p1', 'onboarding.store.overview.p2'],
        },
        {
          headingKey: 'onboarding.store.switching.title',
          paragraphKeys: [
            'onboarding.store.switching.p1',
            'onboarding.store.switching.p2',
            'onboarding.store.switching.p3',
          ],
        },
      ],
    },

    // ✅ FIX: unique key (was store-1 again)
    {
      key: 'store-2',
      headingKey: 'onboarding.store.sections.title',
      items: [
        { icon: STORE_ICONS.store, titleKey: 'onboarding.store.store_mgmt.title', descKey: 'onboarding.store.store_mgmt.desc' },
        { icon: STORE_ICONS.products, titleKey: 'onboarding.store.products.title', descKey: 'onboarding.store.products.desc' },
        { icon: STORE_ICONS.members, titleKey: 'onboarding.store.members.title', descKey: 'onboarding.store.members.desc' },
        { icon: STORE_ICONS.coupons, titleKey: 'onboarding.store.coupons.title', descKey: 'onboarding.store.coupons.desc' },
        { icon: STORE_ICONS.tickets, titleKey: 'onboarding.store.tickets.title', descKey: 'onboarding.store.tickets.desc' },
      ],
    },

    // ✅ FIX: next unique key (was store-2 already, keep but shift)
    {
      key: 'store-3',
      headingKey: 'onboarding.store.sections.title',
      items: [
        { icon: STORE_ICONS.flash, titleKey: 'onboarding.store.flash.title', descKey: 'onboarding.store.flash.desc' },
        { icon: STORE_ICONS.orders, titleKey: 'onboarding.store.orders.title', descKey: 'onboarding.store.orders.desc' },
        { icon: STORE_ICONS.reviews, titleKey: 'onboarding.store.reviews.title', descKey: 'onboarding.store.reviews.desc' },
        { icon: STORE_ICONS.settings, titleKey: 'onboarding.store.settings.title', descKey: 'onboarding.store.settings.desc' },
        { icon: STORE_ICONS.inventory, titleKey: 'onboarding.store.inventory.title', descKey: 'onboarding.store.inventory.desc' },
        { icon: STORE_ICONS.packages, titleKey: 'onboarding.store.packages.title', descKey: 'onboarding.store.packages.desc' },
      ],
    },

    {
      key: 'store-4',
      headingKey: 'onboarding.store.closing.title',
      closingKeys: [
        'onboarding.store.closing.p1',
        'onboarding.store.closing.p2',
        'onboarding.store.closing.p3',
        'onboarding.store.closing.p4',
      ],
    },
  ],
};

export const HOME_TUTORIAL: TutorialConfig = {
  storageKey: 'onboarding_home_seen_v1',
  modalTitleKey: 'onboarding.home.title',
  modalSubtitleKey: 'onboarding.home.subtitle',
  slides: [
    {
      key: 'home-1',
      headingKey: 'onboarding.home.browse.title',
      paragraphKeys: ['onboarding.home.browse.p1', 'onboarding.home.browse.p2'],
    },
    {
      key: 'home-2',
      headingKey: 'onboarding.home.language.title',
      paragraphKeys: [
        'onboarding.home.language.p1',
        'onboarding.home.language.p2',
        'onboarding.home.language.p3',
        // 'onboarding.home.language.p4',
      ],
    },
    {
      key: 'home-3',
      headingKey: 'onboarding.home.seller.title',
      paragraphKeys: ['onboarding.home.seller.p1', 'onboarding.home.seller.p2', 'onboarding.home.seller.p3'],
    },
    {
      key: 'home-4',
      headingKey: 'onboarding.home.recommendations.title',
      paragraphKeys: [
        'onboarding.home.recommendations.p1',
        'onboarding.home.recommendations.p2',
        'onboarding.home.recommendations.p3',
      ],
    },
    {
      key: 'home-5',
      headingKey: 'onboarding.home.sidebar.title',
      paragraphKeys: [
        'onboarding.home.sidebar.p1',
        'onboarding.home.sidebar.p2',
        'onboarding.home.sidebar.p3',
        // 'onboarding.home.sidebar.p4',
        // 'onboarding.home.sidebar.p5',
      ],
    },
    {
      key: 'home-6',
      headingKey: 'onboarding.home.closing.title',
      closingKeys: ['onboarding.home.closing.p1', 'onboarding.home.closing.p2'],
    },
  ],
};
