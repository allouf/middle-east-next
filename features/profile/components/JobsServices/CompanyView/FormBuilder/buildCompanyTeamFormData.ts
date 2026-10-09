// FormBuilder/buildCompanyTeamMemberFormData.ts
export function buildCompanyTeamMemberFormData(args: {
  name: string;
  position: string;
  imageFile: File | null;
}) {
  const fd = new FormData();
  fd.append("name", args.name ?? "");
  fd.append("position", args.position ?? "");
  if (args.imageFile) fd.append("image", args.imageFile);
  return fd;
}