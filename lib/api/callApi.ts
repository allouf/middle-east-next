// api/callApi.js
import api from "./index";

export const getCallToken = async ({
  receiverId,
  channelName,
  uid,
  callType,
  conversationId,
}) => {
  const { data } = await api.post("/user/chat/get-call-token", {
    receiver_id: receiverId,
    channel_name: channelName,
    uid,
    call_type: callType,
    conversation_id: conversationId,
  });

  return data?.data;
};

export const endCall = async ({ channelName, conversationId }) => {
  await api.post("/user/chat/end-call", {
    channel_name: channelName,
    conversation_id: conversationId,
  });
};
