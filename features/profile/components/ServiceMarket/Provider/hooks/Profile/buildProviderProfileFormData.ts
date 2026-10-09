import { ProviderProfileFormState } from "../../types";

export function buildProviderProfileFormData(args: {
  data: ProviderProfileFormState;
  logoFile?: File | null;
  coverFile?: File | null;
}) {
  const fd = new FormData();

  // New API fields
  if (args.data.display_name) fd.append("display_name", args.data.display_name);
  
  if (args.data.country_code) fd.append("country_code", args.data.country_code);
  if (args.data.region) fd.append("region", args.data.region);
  if (args.data.bio) fd.append("bio", args.data.bio);
  if (args.data.verification_notes) fd.append("verification_notes", args.data.verification_notes);
  if (args.data.language_ids && args.data.language_ids.length > 0) {
    args.data.language_ids.forEach((id) => {
      fd.append("language_ids[]", id.toString());
    });
  }
  if (args.data.identity_document) fd.append("identity_document", args.data.identity_document);

  // Legacy fields for backward compatibility
  if (args.data.provider_name) fd.append("provider_name", args.data.provider_name);
  if (args.data.description) fd.append("description", args.data.description);
  if (args.data.website) fd.append("website", args.data.website);
  if (args.data.location) fd.append("location", args.data.location);
  if (args.data.languages && args.data.languages.length > 0) {
    fd.append("languages", JSON.stringify(args.data.languages));
  }

  // Files
  if (args.logoFile) fd.append("logo", args.logoFile);
  if (args.coverFile) fd.append("cover", args.coverFile);

  return fd;
}
