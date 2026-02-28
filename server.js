const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "profiles.json");

app.use(express.json({ limit: "5mb" }));
app.use(express.static(__dirname));

let writeQueue = Promise.resolve();

function normalizePin(pin) {
  return String(pin || "").replace(/[^0-9]/g, "").trim();
}

function normalizeSport(sport) {
  const value = String(sport || "").toLowerCase().trim();
  if (value === "basketball" || value === "football") return value;
  return null;
}

function sanitizeStringList(input, max) {
  if (!Array.isArray(input)) return [];
  return input.filter(item => typeof item === "string").slice(0, max);
}

function sanitizeWeeks(input) {
  if (!Array.isArray(input)) return [];
  return input.slice(0, 500).map((week, index) => {
    const rankingDate = typeof week?.rankingDate === "string" ? week.rankingDate : new Date().toISOString().slice(0, 10);
    const savedAt = typeof week?.savedAt === "string" ? week.savedAt : new Date().toISOString();
    return {
      id: typeof week?.id === "string" ? week.id : `week-${Date.now()}-${index}`,
      label: typeof week?.label === "string" && week.label.trim() ? week.label.trim() : `Week ${index + 1}`,
      rankingDate,
      savedAt,
      rankingNames: sanitizeStringList(week?.rankingNames, 25),
      honorableNames: sanitizeStringList(week?.honorableNames, 5)
    };
  });
}

function sanitizeTeamStats(input) {
  if (!input || typeof input !== "object") return {};
  const entries = Object.entries(input).slice(0, 1000);
  const cleaned = {};
  entries.forEach(([name, stats]) => {
    if (typeof name !== "string" || !name.trim()) return;
    if (!stats || typeof stats !== "object") return;
    cleaned[name] = {
      record: typeof stats.record === "string" ? stats.record : "N/A",
      conferenceRecord: typeof stats.conferenceRecord === "string" ? stats.conferenceRecord : "N/A",
      kenpomRank: typeof stats.kenpomRank === "string" ? stats.kenpomRank : "N/A",
      netRank: typeof stats.netRank === "string" ? stats.netRank : "N/A",
      apRank: typeof stats.apRank === "string" ? stats.apRank : "Unranked",
      coachesRank: typeof stats.coachesRank === "string" ? stats.coachesRank : "Unranked",
      lastGame: stats.lastGame && typeof stats.lastGame === "object" ? stats.lastGame : null,
      nextGame: stats.nextGame && typeof stats.nextGame === "object" ? stats.nextGame : null
    };
  });
  return cleaned;
}

function sanitizeProfile(profile) {
  return {
    currentRanking: sanitizeStringList(profile?.currentRanking, 25),
    honorableMentions: sanitizeStringList(profile?.honorableMentions, 5),
    weeks: sanitizeWeeks(profile?.weeks),
    teamStats: sanitizeTeamStats(profile?.teamStats),
    updatedAt: new Date().toISOString()
  };
}

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(DATA_FILE);
  } catch {
    const empty = { version: 1, profiles: {}, pins: {} };
    await fs.writeFile(DATA_FILE, JSON.stringify(empty, null, 2));
  }
}

async function readStore() {
  await ensureDataFile();
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { version: 1, profiles: {} };
    if (!parsed.profiles || typeof parsed.profiles !== "object") parsed.profiles = {};
    if (!parsed.pins || typeof parsed.pins !== "object") parsed.pins = {};
    return parsed;
  } catch {
    return { version: 1, profiles: {}, pins: {} };
  }
}

async function writeStore(store) {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2));
}

function queueWrite(task) {
  writeQueue = writeQueue.then(task, task);
  return writeQueue;
}

function pinExists(store, pin) {
  if (store?.pins?.[pin]) return true;
  const profile = store?.profiles?.[pin];
  return Boolean(profile && typeof profile === "object" && Object.keys(profile).length);
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.get("/api/pin/:pin/status", async (req, res) => {
  const pin = normalizePin(req.params.pin);
  if (!pin) {
    res.status(400).json({ error: "Invalid PIN.", code: "INVALID_PIN" });
    return;
  }
  const store = await readStore();
  res.json({ exists: pinExists(store, pin) });
});

app.post("/api/pin/register", async (req, res) => {
  const pin = normalizePin(req.body?.pin);
  if (!pin) {
    res.status(400).json({ error: "Invalid PIN.", code: "INVALID_PIN" });
    return;
  }

  let created = false;
  await queueWrite(async () => {
    const store = await readStore();
    if (pinExists(store, pin)) return;
    store.pins[pin] = {
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };
    await writeStore(store);
    created = true;
  });

  if (!created) {
    res.status(409).json({ error: "PIN already exists.", code: "PIN_TAKEN" });
    return;
  }

  res.json({ ok: true });
});

app.post("/api/pin/login", async (req, res) => {
  const pin = normalizePin(req.body?.pin);
  if (!pin) {
    res.status(400).json({ error: "Invalid PIN.", code: "INVALID_PIN" });
    return;
  }

  let found = false;
  await queueWrite(async () => {
    const store = await readStore();
    if (!pinExists(store, pin)) return;
    found = true;
    if (!store.pins[pin]) {
      store.pins[pin] = { createdAt: new Date().toISOString() };
    }
    store.pins[pin].lastLoginAt = new Date().toISOString();
    await writeStore(store);
  });

  if (!found) {
    res.status(404).json({ error: "PIN not found.", code: "PIN_NOT_FOUND" });
    return;
  }

  res.json({ ok: true });
});

app.get("/api/profile/:pin/:sport", async (req, res) => {
  const pin = normalizePin(req.params.pin);
  const sport = normalizeSport(req.params.sport);
  if (!pin || !sport) {
    res.status(400).json({ error: "Invalid pin or sport." });
    return;
  }

  const store = await readStore();
  const profile = store.profiles?.[pin]?.[sport] || null;
  res.json({ profile });
});

app.put("/api/profile/:pin/:sport", async (req, res) => {
  const pin = normalizePin(req.params.pin);
  const sport = normalizeSport(req.params.sport);
  if (!pin || !sport) {
    res.status(400).json({ error: "Invalid pin or sport." });
    return;
  }

  const incoming = req.body?.profile;
  if (!incoming || typeof incoming !== "object") {
    res.status(400).json({ error: "Missing profile payload." });
    return;
  }

  const profile = sanitizeProfile(incoming);

  await queueWrite(async () => {
    const store = await readStore();
    if (!store.profiles[pin]) store.profiles[pin] = {};
    store.profiles[pin][sport] = profile;
    if (!store.pins[pin]) {
      store.pins[pin] = { createdAt: new Date().toISOString() };
    }
    store.pins[pin].lastLoginAt = new Date().toISOString();
    await writeStore(store);
  });

  res.json({ ok: true, updatedAt: profile.updatedAt });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
