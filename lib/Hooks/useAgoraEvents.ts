import { useCallback, useRef, useState } from "react";

interface AgoraUser {
  uid: string | number;
  videoTrack?: {
    play: (elementId: string) => void;
  };
  audioTrack?: {
    play: () => void;
  };
}

interface AgoraClient {
  subscribe: (user: AgoraUser, mediaType: string) => Promise<void>;
}

interface UseAgoraEventsReturn {
  remoteUsers: AgoraUser[];
  remoteUsersRef: React.MutableRefObject<Record<string | number, AgoraUser>>;
  handleUserPublished: (client: AgoraClient, user: AgoraUser, mediaType: string) => Promise<void>;
  handleUserUnpublished: (user: AgoraUser) => void;
}

const useAgoraEvents = (): UseAgoraEventsReturn => {
  const [remoteUsers, setRemoteUsers] = useState<AgoraUser[]>([]);
  const remoteUsersRef = useRef<Record<string | number, AgoraUser>>({});

  const handleUserPublished = useCallback(
    async (client: AgoraClient, user: AgoraUser, mediaType: string) => {
      await client.subscribe(user, mediaType);

      if (mediaType === "video") user.videoTrack?.play(`remote-video-${user.uid}`);
      if (mediaType === "audio") user.audioTrack?.play();

      remoteUsersRef.current[user.uid] = user;
      setRemoteUsers(Object.values(remoteUsersRef.current));
    },
    []
  );

  const handleUserUnpublished = useCallback((user: AgoraUser) => {
    delete remoteUsersRef.current[user.uid];
    setRemoteUsers(Object.values(remoteUsersRef.current));
  }, []);

  return {
    remoteUsers,
    remoteUsersRef,
    handleUserPublished,
    handleUserUnpublished,
  };
};

export default useAgoraEvents;








