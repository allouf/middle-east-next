
import {
    Tag,
    Typography,
} from "antd";
const { Text } = Typography;
export const StatsCard = ({
    label,
    value,
    trend,
    trendTone = "up",
    iconBgClass,
    icon,
    cardBg,
    textColor,
}: {
    label: string;
    value: string | number;
    trend?: string;
    trendTone?: "up" | "down";
    iconBgClass: string;
    icon: React.ReactNode;
    cardBg: string;
    textColor: string;
}) => (
    <div className={`!rounded-[12px] px-6 !py-4 ${cardBg}`}>
        <div className="flex items-center gap-3">
            <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBgClass} text-[26px]`}
            >
                {icon}
            </div>
            <div className="flex flex-col gap-1">
                <Text className="text-[15px] text-[#323232] font-medium underline">
                    {label}
                </Text>
                <div className="flex items-center gap-2">
                    <Text strong className={`text-[20px] ${textColor} me-5`}>
                        {value}
                    </Text>
                    {trend ? (
                        <Tag
                            color={trendTone === "up" ? "success" : "error"}
                            className="text-[11px] rounded-md px-2 py-[2px]"
                        >
                            {trend}
                        </Tag>
                    ) : null}
                </div>
            </div>
        </div>
    </div>
);