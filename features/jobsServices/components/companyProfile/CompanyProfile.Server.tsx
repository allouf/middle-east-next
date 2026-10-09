import { fetchCompanyById } from "../../api/fetchCompanyById";
import { fetchJobByICompanyId } from "../../api/fetchJobByICompanyId";
import CompanyNotFoundError from "./CompanyNotFoundError";
import CompanyProfileclient from "./CompanyProfile.client";



export default async function CompanyProfile({
    params,
}: {
    params: { locale: string; id: string };
}) {
    const { locale, id } = await params;
    
     if (!id) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Invalid company id.</p>
      </div>
    );
  }
    const company = await fetchCompanyById(id, locale);
    const jobsResponse = await fetchJobByICompanyId(id, locale);
    const jobsCompany = jobsResponse?.data?.jobs || null;
 if (!company) {
    return <CompanyNotFoundError />;
  }

    return (
        <CompanyProfileclient company={company} jobs={jobsCompany} />
    );

}