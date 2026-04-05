import express from "express";
import cors from "cors";
import { AccessToken } from "livekit-server-sdk";

const app = express();
app.use(cors());

// استدعاء المفاتيح من النظام (Railway Variables)
const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;

app.get("/getToken", async (req, res) => {
  try {
    const { userId, room } = req.query;

    if (!userId || !room) {
      return res.status(400).json({ error: "Missing userId or room" });
    }

    // التأكد من وجود المفاتيح قبل البدء
    if (!API_KEY || !API_SECRET) {
      return res.status(500).json({ error: "Server keys are not configured in Railway Variables" });
    }

    const at = new AccessToken(API_KEY, API_SECRET, { identity: userId });

    at.addGrant({
      roomJoin: true,
      room: room,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt(); // انتظار توليد التوكن
    res.json({ token: token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Railway يحدد المنفذ (Port) تلقائياً، لذا نستخدم process.env.PORT
const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});
