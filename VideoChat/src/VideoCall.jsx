import { useState, useEffect } from "react";
import {
  config,
  useClient,
  useMicrophoneAndCameraTracks,
  channelName,
} from "./settings.jsx";
import { Grid } from "@material-ui/core";
import Video from "./Video.jsx";
import Controls from "./Controls.jsx";
export default function VideoCall(props) {
  const { setInCall } = props;
  const [users, setUsers] = useState([]);
  const [start, setStart] = useState(false);
  const Client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();

  useEffect(() => {
    let init = async (name) => {
      Client.on("user-published", async (user, mediaType) => {
        await Client.subscribe(user, mediaType);
        if (mediaType === "video") {
          setUsers((prevUsers) => [...prevUsers, user]);
        }

        if (mediaType === "audio") {
          user.audioTrack.play();
        }
      });

      Client.on("user-unpublished", (user, type) => {
        if (type === "audio") {
          if (user.audioTrack) user.audioTrack.stop();
        }
        if (type === "video") {
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user.uid !== user.uid)
          );
        }
      });

      Client.on("user-left", (user) => {
        setUsers((prevUsers) =>
          prevUsers.filter((prevUser) => prevUser.uid !== user.uid)
        );
      });

      try {
        await Client.join(config.appId, name, config.token, null);
        if (tracks) await Client.publish([tracks[0], tracks[1]]);
        setStart(true);
      } catch (error) {
        console.error("Error joining the channel:", error.message);
      }
    };

    if (ready && tracks) {
      try {
        init(channelName);
      } catch (error) {
        console.error("Initialization error:", error.message);
      }
    }
  }, [channelName, Client, ready, tracks]);

  return (
    <Grid container direction="column" style={{ height: "100%" }}>
      <Grid item style={{ height: "15%" }}>
        {ready && tracks && tracks[1] && (
          <Controls tracks={tracks} setStart={setStart} setInCall={setInCall} />
        )}
      </Grid>
      <Grid item style={{ height: "95%" }}>
        {start && tracks && tracks[1] && <Video tracks={tracks} users={users} />}
      </Grid>
    </Grid>
  );
}