import express from "express";
import cors from "cors";
import { AccessToken } from "livekit-server-sdk";

const app = express();
app.use(cors());

const LIVEKIT_API_KEY = "YOUR_API_KEY";
const LIVEKIT_API_SECRET = "YOUR_SECRET";

app.get("/getToken", (req, res) => {
  const { userId, room } = req.query;

  const at = new AccessToken(
    LIVEKIT_API_KEY,
    LIVEKIT_API_SECRET,
    { identity: userId }
  );

  at.addGrant({
    roomJoin: true,
    room: room,
    canPublish: true,
    canSubscribe: true,
  });

  res.json({ token: at.toJwt() });
});

app.listen(3000, () => console.log("Server running"));
