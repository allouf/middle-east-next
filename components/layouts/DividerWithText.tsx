import React from "react";
import useGetData  param($m) 
        $path = $m.Groups[1].Value
        if ($m.Value -match "from\s+['""]@/") {
            "from '@/$path'"
        } else {
            $m.Value
        }
    ;
import Button from "../ui/Button";

const DividerWithText = () => {
  const {
    data: resData,
    loading,
    error,
  } = useGetData({
    url: `Home/banners`,
  });

  const data = resData?.data;

  return (
    <div className="relative w-full overflow-hidden bg-sky-200 border-t border-b py-2">
      <div className="whitespace-nowrap animate-marquee flex items-center space-x-8 rtl:space-x-reverse">
        {data?.map((item) => (
          <React.Fragment key={item.id}>
            <span className="text-subTitleColor font-medium text-lg">
              {item.title}
            </span>
            <Button
              to={item.link}
              className="whitespace-nowrap"
              aria-label={`Ù…ØªØ§Ø¨Ø¹Ø© ${item.title}`}
            >
              View
            </Button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default DividerWithText;
