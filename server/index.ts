import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./routes";
import "dotenv/config";
import { setupVite, serveStatic, log } from "./vite";
import express from 'express'; // korrekt, wenn express installiert ist
import someMissingPackage from 'some-missing-package'; // ❌ wird den Fehler verursachen


const app = express();

// 🌍 Erlaube Frontends (lokal und deployed)
const allowedOrigins = [
  "http://localhost:5173",
  "https://novarixclient.onrender.com",
  "https://novarixplatformk.onrender.com",
];

// 🧱 Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 🛡️ Session-Konfiguration
app.use(session({
  name: "sid",
  secret: process.env.SESSION_SECRET || "default_secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 2, // 2h
  },
}));

// 🔓 CORS mit dynamischer Origin-Validierung
app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Nicht erlaubte Origin: " + origin));
      }
    },
    credentials: true,
  })
);

// 📋 Logging für API-Routen
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json;
  res.json = function (body, ...args) {
    capturedJsonResponse = body;
    return originalResJson.apply(res, [body, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

// 🚀 Server-Start
(async () => {
  let server;

  try {
    server = await registerRoutes(app);
  } catch (err) {
    console.error("❌ Fehler beim Initialisieren der Routen:", err);
    process.exit(1);
  }

  // ⚠️ Fehlerbehandlung
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Interner Serverfehler";
    console.error("❌ Fehler:", err);
    res.status(status).json({ message });
  });

  // 🧪 Umgebungsspezifisches Verhalten
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = process.env.PORT || 5000;
  server.listen(
    {
      port: Number(port),
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`🌍 Server läuft auf Port ${port}`);
    }
  );
})();
