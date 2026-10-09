"use client";
import { useState } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import MyOrderS from "./MyOrderS";
import Services from "./Services";
import OurTeam from "./OurTeam";

interface ProfileTabsProps {
  services: any[];
  orders: any[];
  team: any[];
}

import {
  BriefcaseBusiness,
  ShoppingBag,
  FileText,
  Gavel,
  Megaphone,
  Users,
} from "lucide-react";
import { QuickActionCard } from "./QuickActionCard";
import { ServicesIcon } from "./icons/ServicesIcon";

type ActionItem = {
  id: number;
  title: string;
  icon: React.ElementType;
};

const actions: ActionItem[] = [
  { id: 1, title: "Services", icon: ServicesIcon },
  { id: 2, title: "Orders", icon: ShoppingBag },
  { id: 3, title: "RFQ", icon: FileText },
  { id: 4, title: "Disputes", icon: Gavel },
  { id: 5, title: "Boost Campaign", icon: Megaphone },
  { id: 6, title: "Proposals", icon: BriefcaseBusiness },
  { id: 7, title: "Team", icon: Users },
];

const ProfileTabs = ({ services = [], orders = [], team = [] }: ProfileTabsProps) => {
  const { t } = useTranslation();
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const renderContent = () => {
    switch (selectedAction) {
      case "Services":
        return <Services />;
      case "Orders":
        return <MyOrderS />;
      case "Team":
        return <OurTeam />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full p-6">
      {!selectedAction ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 ">
          {actions.map((item) => (
            <QuickActionCard
              key={item.id}
              title={item.title}
              icon={item.icon}
              onClick={() => setSelectedAction(item.title)}
            />
          ))}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setSelectedAction(null)}
            className="mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Actions
          </button>
          {renderContent()}
        </div>
      )}
    </div>
  );
};

export default ProfileTabs;
