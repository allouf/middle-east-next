// utils/pusher.js
import Pusher from "pusher-js";
import { broadcastURL, PusherKey } from "../../shared/constants/data";

export const pusherClient = new Pusher(PusherKey, {
  cluster: "mt1",
  authEndpoint: broadcastURL,
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  },
});
