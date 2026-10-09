import { CompanyProfileFormState } from "../types";

export function buildCompanyProfileFormData(args: {
  data: CompanyProfileFormState;
  logoFile: File | null;
  coverFile: File | null;
}) {
  const fd = new FormData();

  fd.append("description", args.data.description);

  // Only append if selected
  if (args.logoFile) fd.append("logo", args.logoFile);
  if (args.coverFile) fd.append("cover", args.coverFile);

  return fd;
}