import Image from "next/image";
import { CalendarClock, BriefcaseBusiness, MapPinned, Star } from "lucide-react";

interface Props {
  image: string;
  category: string;
  rating: number;
  reviewsCount: number;
  title: string;
  description: string;
  serviceType: string;
  deliveryModel: string;
  estimatedDeliveryDays: number;
}

export default function OrderServiceCard({
  image,
  category,
  rating,
  reviewsCount,
  title,
  description,
  serviceType,
  deliveryModel,
  estimatedDeliveryDays,
}: Props) {
  return (
    <div className="overflow-hidden rounded-[22px] border border-grayBorder bg-white shadow-[0_6px_24px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col gap-5 p-4 md:p-5 lg:flex-row">
        <div className="relative h-[128px] w-full overflow-hidden rounded-2xl bg-[#DCE8E6] md:w-[172px] lg:shrink-0">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#DDF3E7] px-3 py-1 text-sm font-semibold text-[#15945C]">
              {category}
            </span>

            <div className="inline-flex items-center gap-1 text-sm font-semibold text-[#F4A300]">
              <span>{rating}</span>
              <Star className="h-4 w-4 fill-current" />
              <span className="font-normal text-textGrayColor">({reviewsCount} reviews)</span>
            </div>
          </div>

          <h2 className="max-w-3xl text-[26px] font-bold leading-[1.35] text-textColor">
            {title}
          </h2>

          <p className="mt-3 max-w-4xl text-base leading-7 text-textGrayColor">
            {description}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-grayBorder bg-[#FCFCFC] px-4 py-4 md:px-5">
        <div className="inline-flex items-center gap-2 text-base text-textGrayColor">
          <BriefcaseBusiness className="h-4 w-4 text-blueSite" />
          <span>
            Service Type: <span className="font-bold text-textColor">{serviceType}</span>
          </span>
        </div>

        <div className="inline-flex items-center gap-2 text-base text-textGrayColor">
          <MapPinned className="h-4 w-4 text-blueSite" />
          <span>
            Delivery Model: <span className="font-bold uppercase text-textColor">{deliveryModel}</span>
          </span>
        </div>

        <div className="inline-flex items-center gap-2 text-base text-textGrayColor">
          <CalendarClock className="h-4 w-4 text-blueSite" />
          <span>
            Estimated Delivery:{" "}
            <span className="font-bold text-textColor">{estimatedDeliveryDays} Days</span>
          </span>
        </div>
      </div>
    </div>
  );
}