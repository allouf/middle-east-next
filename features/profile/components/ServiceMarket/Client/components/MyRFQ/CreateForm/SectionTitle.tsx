export default function SectionTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-start gap-3">
        <span className="mt-1 h-6 sm:h-8 w-[4px] sm:w-[5px] rounded-full bg-[#0B6B57]" />
        <div>
          <h1 className="text-[28px] sm:text-[32px] md:text-[38px] lg:text-[42px] font-bold leading-none text-[#2B2F38]">
            {title}
          </h1>
          <p className="mt-3 max-w-[620px] text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] leading-7 sm:leading-8 text-[#667085]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
