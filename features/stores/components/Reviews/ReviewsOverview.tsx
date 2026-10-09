"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Card,
  Col,
  Input,
  Row,
  Table,
  Typography,
  Button as AntButton,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { EyeOutlined, SearchOutlined, StarFilled } from "@ant-design/icons";
import { useParams } from "next/navigation";
import { fetchStoreReviewStatistics, fetchStoreReviews } from "../../api";
import { Review, ReviewStatistics } from "../../types";
import { useTranslation } from "@/lib/i18n/useTranslation";

import Modal from "@/components/ui/Modal";
import Image from "next/image";
import IconsMemberImage from "@/assets/images/iconsMemberImage.png";
import { BsPersonFill } from "react-icons/bs";

const { Title, Text } = Typography;

type ReviewRecord = {
  key: string;
  id: string;
  person: string;
  productName: string;
  rating: number;
  title: string;
  description: string;
  avatar?: string;
  productImage?: string;
  attachments?: string[];
};

type StatsCardProps = {
  label: string;
  value: string | number;
  trend?: string;
  trendTone?: "up" | "down";
  iconBgClass: string;
  icon: React.ReactNode;
  cardBg: string;
  textColor: string;
};

const attachmentsPool = [
  "/dummy/prod21.png",
  "/dummy/promo.png",
  "/dummy/image-6.png",
  "/dummy/Polaroid.png",
  
];

const StatsCard = ({
  label,
  value,
  trend,
  trendTone = "up",
  iconBgClass,
  icon,
  cardBg,
  textColor,
}: StatsCardProps) => (
  <div
    className={`rounded-[12px] px-5 py-4 border border-[#E5E7EB] ${cardBg} shadow-sm`}
  >
    <div className="flex items-center gap-3">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBgClass} text-[22px]`}
      >
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <Text className="text-[15px] text-[#111827] font-semibold underline">
          {label}
        </Text>
        <div className="flex items-center gap-2">
          <Text strong className={`text-[20px] ${textColor}`}>
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

const ReviewDetailsModal = ({
  review,
  onClose,
}: {
  review: ReviewRecord | null;
  onClose: () => void;
}) =>{
  const {t} = useTranslation()
  
  return (
  <Modal
    isOpen={Boolean(review)}
    onClose={onClose}
    className="!max-w-3xl border border-[#0E8F60]/30 shadow-2xl"
    showLine
    padding="py-6 px-4"
  >
    {review ? (
      <div className="flex flex-col items-center gap-5 w-full max-w-[520px] mx-auto pb-3">
        <div className="flex justify-center">
          <Image src={IconsMemberImage} alt="rating-details" width={170}/>
        </div>

        <div className="text-center space-y-1">
          <h3 className="text-lg font-semibold text-blueSite m-0">{t("product.reviews.overview.ratingDetails")}</h3>
          <p className="text-[#6B7280] text-sm m-0">{t("product.reviews.overview.canAddAttachments")}</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl w-full mb-1">
          <div className="w-14 h-14 rounded-full overflow-hidden border border-[#C4D6CF] bg-white flex-shrink-0 mx-auto sm:mx-0">
            <img
              src={review.productImage || "/product.png"}
              alt={review.productName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <Text className="text-lg text-[#555555] font-semibold">
              {review.productName}
            </Text>
            <div className="flex items-center gap-2 text-blueSite justify-center sm:justify-start">
              <StarFilled />
              <span className="text-[15px] font-semibold">
                {review.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        <Text className="text-[#374151] leading-relaxed block text-center sm:text-left w-full">
          {review.description}
        </Text>

        <div className="flex items-center gap-3 text-blueSite font-medium w-full">
          <BsPersonFill size={20} />
          <span className="text-[#A1A1A1]">{t("product.reviews.overview.person")}:</span>
          <span className="text-[#555555]">{review.person}</span>
        </div>

        <div className="space-y-2 w-full">
          <Text className="text-[#555555] font-semibold">
            {t("product.reviews.overview.mediaAndAttachments")}:
          </Text>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(review.attachments || attachmentsPool).map((src, idx) => (
              <div
                key={`${src}-${idx}`}
                className="aspect-[4/3] rounded-xl overflow-hidden border border-[#C4D6CF] bg-white shadow-sm"
              >
                <img
                  src={src}
                  alt="Attachment"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    ) : null}
  </Modal>
)
};

const ReviewsOverview = () => {
  const { t } = useTranslation();
  const { id } = useParams(); // store id
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedReview, setSelectedReview] = useState<ReviewRecord | null>(null);

  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [statistics, setStatistics] = useState<ReviewStatistics | null>(null);
  const [statisticsLoading, setStatisticsLoading] = useState(false);

  const normalizeNumber = useCallback((value: unknown): number | undefined => {
    if (value === null || value === undefined) return undefined;
    if (typeof value === "number" && !Number.isNaN(value)) return value;
    if (typeof value === "string") {
      const cleaned = value.replace(/,/g, "").replace(/%/g, "").trim();
      if (!cleaned) return undefined;
      const parsed = Number(cleaned);
      if (!Number.isNaN(parsed)) return parsed;
    }
    return undefined;
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1); // Reset to page 1 on search change
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchReviews = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await fetchStoreReviews(id as string, {
        page,
        per_page: pageSize,
        search: debouncedSearchTerm,
      });

      console.log("fetched reviews ",data)

      const reviewsPayload: Review[] = Array.isArray(data?.reviews)
        ? data.reviews
        : Array.isArray((data as any)?.reviews?.data)
        ? (data as any).reviews.data
        : Array.isArray((data as any)?.data)
        ? (data as any).data
        : Array.isArray(data as any)
        ? (data as any)
        : [];

      const meta =
        (data as any)?.meta ||
        (data as any)?.reviews?.meta ||
        (data as any)?.data?.meta;

      const mappedReviews: ReviewRecord[] = reviewsPayload.map((r: any) => {
        const imagesArray = Array.isArray(r?.images) ? r.images : [];
        const attachmentUrls = imagesArray
          .map((img) => img?.file_path || img?.url || img)
          .filter(Boolean);

        const productName =
          r?.product?.name ||
          r?.product_name ||
          (r?.product_id ? `Product #${r.product_id}` : "Product");

        return {
          key: String(r?.id ?? Math.random()),
          id: String(r?.id ?? ""),
          person: r?.user?.name || "Anonymous",
          productName,
          rating: Number(r?.rating || 0),
          title: r?.description
            ? r.description.substring(0, 30) + (r.description.length > 30 ? "..." : "")
            : "No Title",
          description: r?.description || "",
          avatar: r?.user?.avatar || "/anonymous.png",
          productImage:r?.product?.image || "/product.png",
          attachments: attachmentUrls,
        };
      });

      setReviews(mappedReviews);
      const totalFromMeta = normalizeNumber(meta?.total);
      setTotalRows(totalFromMeta ?? mappedReviews.length);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, id, normalizeNumber, page, pageSize]);

  const fetchStatistics = useCallback(async () => {
    if (!id) return;
    try {
      setStatisticsLoading(true);
      const data = await fetchStoreReviewStatistics(id as string);
      const statsPayload =
        (data as any)?.statistics && typeof (data as any).statistics === "object"
          ? (data as any).statistics
          : data;

      if (statsPayload && typeof statsPayload === "object" && !Array.isArray(statsPayload)) {
        setStatistics(statsPayload as ReviewStatistics);
      } else {
        setStatistics(null);
      }
    } catch (error) {
      console.error("Failed to fetch review statistics", error);
    } finally {
      setStatisticsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  const statisticsCounts = useMemo(() => {
    const source: Record<string, unknown> =
      ((statistics as any)?.statistics as Record<string, unknown>) ||
      ((statistics as any)?.data as Record<string, unknown>) ||
      (statistics as Record<string, unknown>) ||
      {};

    const pickNumber = (...keys: string[]) => {
      for (const key of keys) {
        const value = source?.[key];
        const parsed = normalizeNumber(value);
        if (parsed !== undefined) return parsed;
      }
      return undefined;
    };

    return {
      total: pickNumber("total", "total_reviews", "reviews_total", "all", "count"),
      newCount: pickNumber("new", "new_reviews", "recent", "pending"),
      highestRating: pickNumber("highest_rating", "highest", "max_rating", "top_rating"),
      lowestRating: pickNumber("lowest_rating", "lowest", "min_rating", "bottom_rating"),
      averageRating: pickNumber("average_rating", "avg_rating", "average"),
      totalTrend: pickNumber("total_trend", "total_change", "total_change_percentage"),
    };
  }, [normalizeNumber, statistics]);

  const formatCount = useCallback(
    (value?: number, fallback?: number) => {
      if (statisticsLoading) return "...";
      const parsed = normalizeNumber(value);
      const fallbackParsed = normalizeNumber(fallback);
      const finalValue = parsed ?? fallbackParsed;
      if (finalValue === undefined) return "-";
      return new Intl.NumberFormat("en-US").format(finalValue);
    },
    [normalizeNumber, statisticsLoading]
  );

  const formatRating = useCallback(
    (value?: number) => {
      if (statisticsLoading) return "...";
      const parsed = normalizeNumber(value);
      if (parsed === undefined) return "-";
      return parsed.toFixed(1);
    },
    [normalizeNumber, statisticsLoading]
  );

  const reviewStats = useMemo<StatsCardProps[]>(() => {
    const trendValue = normalizeNumber(statisticsCounts.totalTrend);
    const trendLabel =
      trendValue === undefined
        ? undefined
        : `${trendValue > 0 ? "+" : ""}${trendValue}%`;
    const trendTone =
      trendValue === undefined ? undefined : trendValue >= 0 ? "up" : "down";

    return [
      {
        label: t("product.reviews.overview.allReviews"),
        value: formatCount(statisticsCounts.total, totalRows),
        trend: trendLabel,
        trendTone,
        iconBgClass: "bg-[#E8E6FF]",
        cardBg: "bg-[#F7F6FF]",
        icon: <StarFilled className="text-[#7C3AED]" />,
        textColor: "text-[#7C3AED]",
      },
      {
        label: t("product.reviews.overview.newReviews"),
        value: formatCount(statisticsCounts.newCount, 0),
        iconBgClass: "bg-[#E4F4ED]",
        cardBg: "bg-[#F3FBF7]",
        icon: <StarFilled className="text-[#0E8F60]" />,
        textColor: "text-[#0E8F60]",
      },
      {
        label: t("product.reviews.overview.highestRated"),
        value: formatRating(
          statisticsCounts.highestRating ?? statisticsCounts.averageRating
        ),
        iconBgClass: "bg-[#E1F3F3]",
        cardBg: "bg-[#F2FAFB]",
        icon: <StarFilled className="text-[#0F8C8C]" />,
        textColor: "text-[#0F8C8C]",
      },
      {
        label: t("product.reviews.overview.lowestRated"),
        value: formatRating(statisticsCounts.lowestRating),
        iconBgClass: "bg-[#FEE4E2]",
        cardBg: "bg-[#FFF4F4]",
        icon: <StarFilled className="text-[#C2410C]" />,
        textColor: "text-[#C2410C]",
      },
    ];
  }, [formatCount, formatRating, normalizeNumber, statisticsCounts, totalRows]);

  const startRow = totalRows ? (page - 1) * pageSize + 1 : 0;
  const endRow = totalRows ? Math.min(page * pageSize, totalRows) : 0;
  const headerCellClass = "!text-blueSite font-semibold !bg-[transparent]";
  const bodyCellClass = "text-[#1F2937]";

  const handleViewReview = useCallback((review: ReviewRecord) => {

    console.log(review)
    setSelectedReview(review);
  }, []);

  const columns: ColumnsType<ReviewRecord> = useMemo(
    () => [
      {
        title: t("product.reviews.overview.table.id"),
        dataIndex: "id",
        key: "id",
        className: bodyCellClass,
        onHeaderCell: () => ({ className: headerCellClass }),
        render: (text: string, record: ReviewRecord) => (
          <Text
            className="text-blueSite cursor-pointer"
            onClick={() => handleViewReview(record)}
          >
            {text}
          </Text>
        ),
      },
      {
        title: t("product.reviews.overview.table.image"),
        dataIndex: "avatar",
        key: "avatar",
        className: bodyCellClass,
        onHeaderCell: () => ({ className: headerCellClass }),
        render: (src: string) => (
          <Avatar src={src} size={38} className="shadow-sm" />
        ),
      },
      {
        title: t("product.reviews.overview.table.person"),
        dataIndex: "person",
        key: "person",
        className: bodyCellClass,
        onHeaderCell: () => ({ className: headerCellClass }),
        render: (person: string) => (
          <Text className="text-[#111827] font-medium">{person}</Text>
        ),
      },
      {
        title: t("product.reviews.overview.table.productName"),
        dataIndex: "productName",
        key: "productName",
        className: bodyCellClass,
        onHeaderCell: () => ({ className: headerCellClass }),
        render: (name: string) => <Text className="text-[#4B5563]">{name}</Text>,
      },
      {
        title: t("product.reviews.overview.table.rate"),
        dataIndex: "rating",
        key: "rating",
        className: bodyCellClass,
        onHeaderCell: () => ({ className: headerCellClass }),
        render: (rating: number) => (
          <div className="flex items-center gap-2 text-[#0E8F60] font-semibold">
            <StarFilled />
            <span>{rating.toFixed(1)}</span>
          </div>
        ),
      },
      {
        title: t("product.reviews.overview.table.title"),
        dataIndex: "title",
        key: "title",
        className: bodyCellClass,
        onHeaderCell: () => ({ className: headerCellClass }),
        render: (title: string) => (
          <Text className="text-[#475467]">{title}</Text>
        ),
      },
      {
        title: "",
        key: "action",
        align: "right" as const,
        className: bodyCellClass,
        onHeaderCell: () => ({ className: headerCellClass }),
        render: (_: unknown, record: ReviewRecord) => (
          <AntButton
            type="primary"
            icon={<EyeOutlined className="text-white" />}
            onClick={() => handleViewReview(record)}
            aria-label={t("product.reviews.overview.viewRatingDetails")}
            className="bg-blueSite"
          />
        ),
      },
    ],
    [bodyCellClass, handleViewReview, headerCellClass]
  );

  return (
    <div className="space-y-6 px-6 md:px-10 py-5">
      <div className="flex flex-col md:flex-row md:items-center gap-10">
        <h2 className={`!m-0 text-lg font-semibold text-blueSite`}>{t("product.reviews.overview.title")}</h2>
        <div className="flex items-center gap-2 md:w-80">
          <Input
            placeholder={t("product.reviews.overview.searchPlaceholder")}
            prefix={<SearchOutlined className="text-blueSite me-2" />}
            className="md:w-80 h-[42px] rounded-full border-none !bg-[#FAFAFA] px-4 !shadow-none"
            size="large"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
          />
        </div>
      </div>

      <div className="space-y-4">
        <Title level={4} className="mb-2 text-[#111827]">
          {t("product.reviews.overview.statisticsAndAnalysis")}:
        </Title>
        <Row gutter={[16, 16]}>
          {reviewStats.map((item) => (
            <Col xs={24} sm={12} md={12} lg={6} key={item.label}>
              <StatsCard {...item} />
            </Col>
          ))}
        </Row>
      </div>

      <Card className="shadow-sm px-5 !border-[#323232] !rounded-[16px] overflow-hidden [&_.ant-card-body]:p-0">
        <Table
          rowKey="key"
          dataSource={reviews}
          columns={columns}
          loading={loading}
          pagination={{
            position: ["bottomLeft", "bottomRight"],
            current: page,
            pageSize,
            total: totalRows,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]} - ${range[1]} ${t("product.reviews.overview.of")} ${total}`,
            onChange: (newPage) => setPage(newPage),
            onShowSizeChange: (_, size) => {
              setPageSize(size);
              setPage(1);
            },
          }}
          bordered={false}
          title={() => (
            <div className="flex items-center justify-between">
              <Text strong className={"text-blueSite text-lg"}>
                {t("product.reviews.overview.allReviews")}
              </Text>
              <Text className={`text-sm text-blueSite font-medium`}>
                {startRow} - {endRow} of {totalRows}
              </Text>
            </div>
          )}
          scroll={{ x: 800 }}
        />
      </Card>

      <ReviewDetailsModal
        review={selectedReview}
        onClose={() => setSelectedReview(null)}
      />
    </div>
  );
};

export default ReviewsOverview;
