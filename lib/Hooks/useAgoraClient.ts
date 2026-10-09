import { useState, useCallback } from "react";
import { createAgoraClient } from "../utils/rtcUtils";

type AgoraClient = ReturnType<typeof createAgoraClient>;
type MediaType = "audio" | "video";

type UserPublishedHandler = (
  client: AgoraClient,
  user: unknown,
  mediaType: MediaType
) => void;

type UserUnpublishedHandler = (user: unknown) => void;

const useAgoraClient = (
  handleUserPublished: UserPublishedHandler,
  handleUserUnpublished: UserUnpublishedHandler
) => {
  const [client, setClient] = useState<AgoraClient | null>(null);

  const initializeClient = useCallback(() => {
    const agoraClient = createAgoraClient();

    agoraClient.on("user-published", (user: unknown, mediaType: MediaType) =>
      handleUserPublished(agoraClient, user, mediaType)
    );
    agoraClient.on("user-unpublished", handleUserUnpublished);

    setClient(agoraClient);
    return agoraClient;
  }, [handleUserPublished, handleUserUnpublished]);

  return { client, initializeClient };
};

export default useAgoraClient;

