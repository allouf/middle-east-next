import { SkeletonBox } from "./SkeletonBox";

const ProfileSkeleton = () => {
  return (
    <div className="flex flex-col gap-8 p-4">
      <div className="flex flex-col gap-6">

        {/* Top grid: name, email, phone */}
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
          <SkeletonBox className="h-14" />
          <SkeletonBox className="h-14" />
          <SkeletonBox className="h-14" />
        </div>

        {/* Second grid: country, region */}
        <div className="grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4">
          <SkeletonBox className="h-14" />
          <SkeletonBox className="h-14" />
        </div>
      </div>

      {/* Buttons area */}
      <div className="flex flex-row gap-5">
        <SkeletonBox className="h-10 w-[100px]" />
        <SkeletonBox className="h-10 w-[100px]" />
      </div>
    </div>
  );
};

export default ProfileSkeleton;