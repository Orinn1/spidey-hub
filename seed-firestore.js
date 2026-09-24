// seed-firestore.js — ยิงข้อมูลเริ่มต้นเข้า Firestore ให้หน้า Admin เห็นสคริปต์

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBCZdUq2gEmz_Zhc7XAnY0oa9Uds3hk1lI",
  projectId: "rocketscriptz-hub",
};

const scripts = [
  {
    id: "script-1",
    title: "Steal An Egg – Ajjans HUB Dr Scrambles",
    game: "Steal An Egg",
    tags: ["All-Script", "Dr Scrambles", "Keysystem"],
    date: "กันยายน 20, 2026",
    isKeyless: false,
    isExecutor: false,
    thumbnail: "https://i.postimg.cc/NjhnhRkJ/153b5a40-0a72-4b41-ab3d-a784d6cff6ec.png",
    videoPreview: "https://i.postimg.cc/NjhnhRkJ/153b5a40-0a72-4b41-ab3d-a784d6cff6ec.png",
    loadstring: 'loadstring(game:HttpGet("https://api.luarmor.net/files/v4/loaders/359e97f8618e9008afe5f496184ebb7c.lua"))()',
    views: 38308,
    sub2unlock: true,
    channelUrl: "https://youtube.com",
    channelName: "Spidey Official"
  },
  {
    id: "script-2",
    title: "Steal An Egg – Chilli HUB Dr Scrambles แนะนำ!!!",
    game: "Steal An Egg",
    tags: ["All-Script", "Dr Scrambles", "Keyless"],
    date: "กันยายน 20, 2026",
    isKeyless: true,
    isExecutor: false,
    thumbnail: "https://i.postimg.cc/Tw5QWxyN/Chat-GPT-Image-Sep-15-2026-11-45-45-PM.png",
    videoPreview: "https://i.postimg.cc/Tw5QWxyN/Chat-GPT-Image-Sep-15-2026-11-45-45-PM.png",
    loadstring: 'loadstring(game:HttpGet("https://zeroinhub.com/api/script"))()',
    views: 24510,
    sub2unlock: false
  },
  {
    id: "script-3",
    title: "Download Delta iOS No ksign",
    game: "Delta iOS",
    tags: ["Executor", "Apple iOS"],
    date: "กันยายน 20, 2026",
    isKeyless: true,
    isExecutor: true,
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
    videoPreview: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
    loadstring: '-- Delta iOS Executor Direct Download:\n-- https://deltaexploits.net/\n-- ติดตั้งผ่าน Scarlet หรือ TrollStore โดยไม่ต้อง Sign ซ้ำ',
    views: 52890,
    sub2unlock: false
  },
  {
    id: "script-4",
    title: "Steal An Egg 🔥 ฟาร์มไข่อัตโนมัติ + Auto Steal 24 ชม (ZeroinHub)",
    game: "Steal An Egg",
    tags: ["All-Script", "Keyless"],
    date: "กันยายน 21, 2026",
    isKeyless: true,
    isExecutor: false,
    thumbnail: "https://i.postimg.cc/Tw5QWxyN/Chat-GPT-Image-Sep-15-2026-11-45-45-PM.png",
    videoPreview: "https://i.postimg.cc/Tw5QWxyN/Chat-GPT-Image-Sep-15-2026-11-45-45-PM.png",
    loadstring: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/ZeroinHub/Scripts/main/Loader.lua"))()',
    views: 19420,
    sub2unlock: false
  },
  {
    id: "script-5",
    title: "Blox Fruits – Redz Hub V3 (Auto Farm, Raid, Sea Event)",
    game: "Blox Fruits",
    tags: ["Blox Fruits", "Keyless", "Popular"],
    date: "กันยายน 21, 2026",
    isKeyless: true,
    isExecutor: false,
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    videoPreview: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    loadstring: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/realredz/BloxFruits/refs/heads/main/Source.lua"))()',
    views: 95400,
    sub2unlock: false
  },
  {
    id: "script-6",
    title: "Fluxus Executor V7 – Android & PC Edition (Keyless)",
    game: "Roblox Executor",
    tags: ["Executor", "Android", "PC"],
    date: "กันยายน 20, 2026",
    isKeyless: true,
    isExecutor: true,
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
    videoPreview: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
    loadstring: '-- Fluxus Mobile / PC Official Direct Download\n-- Version: 7.2.1 Stable\n-- ดาวน์โหลดได้ที่ https://fluxteam.net/',
    views: 82190,
    sub2unlock: false
  }
];

const settings = {
  siteTitle: "Spidey",
  siteHandle: "@Spidey",
  announcementText: "อัปเดตสคริปต์ Steal An Egg และ Blox Fruits ตัวล่าสุดแล้ววันนี้!",
  discordUrl: "https://discord.gg",
  youtubeUrl: "https://youtube.com"
};

async function seed() {
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/hub/database?key=${FIREBASE_CONFIG.apiKey}`;

  const body = {
    fields: {
      scriptsJson: { stringValue: JSON.stringify(scripts) },
      settingsJson: { stringValue: JSON.stringify(settings) }
    }
  };

  console.log("กำลังยิงข้อมูลเข้า Firestore...");

  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (res.ok) {
    const data = await res.json();
    console.log("✅ สำเร็จ! ข้อมูลสคริปต์", scripts.length, "รายการ + settings ถูกบันทึกลง Firestore แล้ว");
  } else {
    const errText = await res.text();
    console.error("❌ Error:", res.status, errText);
  }
}

seed();
