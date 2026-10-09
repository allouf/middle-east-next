import { useEffect } from "react";
import { pusherClient } from "../utils/pusher";

export const usePusherSubscribe = <T = unknown>(
  channelName: string | null | undefined,
  eventName: string | null | undefined,
  onEvent: ((data: T) => void) | null | undefined
): void => {
  useEffect(() => {
    if (!channelName || !eventName || !onEvent) return;

    const channel = pusherClient.subscribe(channelName);

    const handler = (data: T) => {
      onEvent(data);
    };
    channel.bind(eventName, handler);

    return () => {
      channel.unbind(eventName, handler);
      pusherClient.unsubscribe(channelName);
    };
  }, [channelName, eventName, onEvent]);
};



