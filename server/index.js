import cors from "cors";
import express from "express";
import { readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, "data", "events.json");
const PORT = 3001;

const app = express();
app.use(cors());
app.use(express.json());

async function readEvents() {
  const raw = await readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

async function writeEvents(events) {
  await writeFile(DATA_PATH, JSON.stringify(events, null, 2), "utf-8");
}

app.get("/api/events", async (_req, res) => {
  try {
    const events = await readEvents();
    res.json(events);
  } catch {
    res.status(500).json({ error: "Не удалось загрузить события" });
  }
});

app.get("/api/events/:id", async (req, res) => {
  try {
    const events = await readEvents();
    const event = events.find((e) => e.id === req.params.id);
    if (!event) {
      res.status(404).json({ error: "Событие не найдено" });
      return;
    }
    res.json(event);
  } catch {
    res.status(500).json({ error: "Не удалось загрузить событие" });
  }
});

app.post("/api/events", async (req, res) => {
  try {
    const { title, description, posterUrl, lat, lng, expiresAt, category, registrationUrl } =
      req.body;

    if (!title || lat == null || lng == null || !expiresAt) {
      res.status(400).json({ error: "Заполните название, координаты и дату окончания" });
      return;
    }

    const events = await readEvents();
    const event = {
      id: uuidv4(),
      title,
      description: description ?? "",
      posterUrl: posterUrl ?? "",
      lat: Number(lat),
      lng: Number(lng),
      expiresAt,
      category: category ?? "other",
      ...(registrationUrl ? { registrationUrl } : {}),
    };

    events.push(event);
    await writeEvents(events);
    res.status(201).json(event);
  } catch {
    res.status(500).json({ error: "Не удалось создать событие" });
  }
});

app.put("/api/events/:id", async (req, res) => {
  try {
    const events = await readEvents();
    const index = events.findIndex((e) => e.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: "Событие не найдено" });
      return;
    }

    const { title, description, posterUrl, lat, lng, expiresAt, category, registrationUrl } =
      req.body;

    events[index] = {
      ...events[index],
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(posterUrl !== undefined && { posterUrl }),
      ...(lat !== undefined && { lat: Number(lat) }),
      ...(lng !== undefined && { lng: Number(lng) }),
      ...(expiresAt !== undefined && { expiresAt }),
      ...(category !== undefined && { category }),
      registrationUrl: registrationUrl ?? events[index].registrationUrl,
    };

    await writeEvents(events);
    res.json(events[index]);
  } catch {
    res.status(500).json({ error: "Не удалось обновить событие" });
  }
});

app.delete("/api/events/:id", async (req, res) => {
  try {
    const events = await readEvents();
    const index = events.findIndex((e) => e.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: "Событие не найдено" });
      return;
    }

    events.splice(index, 1);
    await writeEvents(events);
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Не удалось удалить событие" });
  }
});

app.listen(PORT, () => {
  console.log(`API сервер: http://localhost:${PORT}`);
});
