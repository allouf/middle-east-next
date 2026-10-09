import React from "react";
import ServiceDetails from "./ServiceDetails";
import { fetchServiceDetails } from "../../api/getServiceDetails";
import { fetchServiceProjects } from "../../api/getServiceProjects";
import { notFound } from "next/navigation";

interface ServiceDetailsPageServerProps {
  serviceId: string;
  locale?: string;
}

const ServiceDetailsPageServer: React.FC<ServiceDetailsPageServerProps> = async ({ 
  serviceId, 
  locale = "en" 
}) => {
  const id = parseInt(serviceId);
  if (isNaN(id)) {
    return notFound();
  }

  const serviceData = await fetchServiceDetails(id, "", locale);
  // const projectsData = await fetchServiceProjects(id, "", locale);

  console.log("ServiceData",serviceData)
  if (!serviceData) {
    return notFound();
  }

  // TODO: Fetch real similar services. Using empty array for now.
  const similarServices: any[] = [];

  return (
    <div className="bg-white min-h-screen">
      <ServiceDetails 
        service={serviceData as any} 
        similarServices={similarServices} 
      />
    </div>
  );
};

export default ServiceDetailsPageServer;
