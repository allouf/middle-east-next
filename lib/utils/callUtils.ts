// utils/callUtils.js
export const joinChannel = async (client, appId, channel, token, uid) => {
  await client.join(appId, channel, token, uid);
};

export const publishTracks = async (client, tracks) => {
  await client.publish(tracks);
};

export const leaveChannel = async (client, tracks = []) => {
  for (const track of tracks) {
    console.log("track", track);

    track?.stop();
    track?.close();
  }

  if (client) await client.leave();
};
