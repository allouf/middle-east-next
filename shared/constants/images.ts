import { StaticImageData } from 'next/image';


import Unknown from '@/assets/images/default_avatar.jpg';
import test from '@/assets/images/test.jpg';
import EmptyVideos from '@/assets/images/no-videos.png';
import NewAds from '@/assets/images/new_ads.png';
import VideoUpload from '@/assets/images/video-upload.png';
import tiketsun from '@/assets/images/tiketsun.png';
import adReportBg from '@/assets/images/ad-report-bg.png';

export interface Images {
  Unknown: StaticImageData;
  test: StaticImageData;
  EmptyVideos: StaticImageData;
  NewAds: StaticImageData;
  VideoUpload: StaticImageData;
  tiketsun: StaticImageData;
  adReportBg: StaticImageData;
}

export const images: Images = {
  Unknown,
  test,
  EmptyVideos,
  NewAds,
  VideoUpload, tiketsun, adReportBg
};

