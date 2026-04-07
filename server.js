import express from 'express';
import { AccessToken } from 'livekit-server-sdk';
import cors from 'cors';

const app = express();
app.use(cors());

const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;

app.get('/getToken', async (req, res) => {
  try {
    const { userId, room } = req.query;
    if (!userId || !room) return res.status(400).json({ error: "Missing params" });

    const at = new AccessToken(API_KEY, API_SECRET, { identity: userId });
    at.addGrant({ roomJoin: true, room: room, canPublish: true, canSubscribe: true });
    
    const token = await at.toJwt();
    res.json({ token: token });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => console.log(`Server running on port ${port}`));