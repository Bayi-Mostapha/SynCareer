import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "2344ee84bb5546b4a6c04585407fa7bf";

const token =
  "007eJxTYIjvmphTIeV24qaU1QJxuTOv8pQPn67gufl5f3uHTeU5mX4FBiNjE5PUVAuTpCRTUxOzJJNEs2QDE1MLUxMD87RE86Q0jTl/UxsCGRnm3P3LwsgAgSA+C0NuYmYeAwMAU5UgbQ==";

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "main";