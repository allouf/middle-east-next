import useGetData from "@/lib/api/useGetData";
import { profileUrl } from "@/shared/constants/urls";
import { ProfileApiResponse } from "../types";

const useProfile = () =>
    useGetData<ProfileApiResponse>({
    url: profileUrl,
  });

export default useProfile;
