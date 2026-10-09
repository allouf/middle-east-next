import { UserProfileFormState } from "./useUserProfileForm";

export function buildUserProfileFormData(args: {
  data: UserProfileFormState;
  avatarFile: File | null;
  coverFile: File | null;
}) {
  const fd = new FormData();

  fd.append("name", args.data.name);
  fd.append("bio", args.data.bio);

  // Only append if selected
  if (args.avatarFile) fd.append("avatar", args.avatarFile);
  if (args.coverFile) fd.append("cover", args.coverFile);

  return fd;
}
