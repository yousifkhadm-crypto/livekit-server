import express from "express";
import cors from "cors";
import { AccessToken } from "livekit-server-sdk";

const app = express();
app.use(cors());

// جلب المفاتيح من إعدادات Railway لضمان الأمان والعمل الصحيح
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;

app.get("/getToken", async (req, res) => { // أضفنا async هنا
  try {
    const { userId, room } = req.query;

    if (!userId || !room) {
      return res.status(400).json({ error: "userId and room are required" });
    }

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

    // إضافة await ضرورية جداً هنا لكي ينتظر السيرفر توليد التوكن
    const token = await at.toJwt(); 
    
    res.json({ token: token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
