// JAX KIDS APP - BACKEND - YOU CONTROL
const express = require('express');
const app = express();

// YOU CONTROL HERE - CHANGE ANYTIME
const CONFIG = {
  WEEKLY_FEE: 1000, // 1000 UGX/week - change to 2000
  VIRAL_THRESHOLD: 10000, // 10k views = viral
  VIRAL_PERCENT: 0.10, // 10% of pool
  ONE_VIDEO_ONE_PAY: true, // one video only one pay
  BOSS_PERCENT: 0.70 // you keep 70%
};

let subscriptionPool = 0;
let videos = [];

app.use(express.json());

// 1. PARENT PAYS - MTN & AIRTEL BOTH
app.post('/subscribe', (req, res) => {
  const { phone, network } = req.body; // MTN or AIRTEL
  subscriptionPool += CONFIG.WEEKLY_FEE;
  console.log(`Paid ${CONFIG.WEEKLY_FEE} via ${network} - Phone: ${phone}`);
  res.json({ success: true, pool: subscriptionPool });
});

// 2. VIDEO VIEW + VIRAL CHECK
app.post('/view/:id', (req, res) => {
  const video = videos.find(v => v.id == req.params.id);
  video.views++;
  
  if(video.views >= CONFIG.VIRAL_THRESHOLD && !video.isPaid){
    const reward = subscriptionPool * CONFIG.VIRAL_PERCENT;
    video.isPaid = true; // LOCK - never pay again
    video.reward = reward;
    return res.json({ viral: true, reward });
  }
  res.json({ views: video.views });
});

// 3. ADMIN - YOU CONTROL
app.get('/admin', (req, res) => {
  res.json({
    YOU_CONTROL: CONFIG,
    totalPool: subscriptionPool,
    totalVideos: videos.length,
    message: "Edit CONFIG to change anything!"
  });
});

app.listen(3000, () => console.log("JAX KIDS BACKEND RUNNING - YOU CONTROL!"));
