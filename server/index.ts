import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// 🌍 Erlaube Frontends (lokal und deployed)
const allowedOrigins = [
  "http://localhost:5173",              // Lokale Entwicklung
  "https://novarixclient.onrender.com", // Deployment (Frontend)
  "https://novarixplatformk.onrender.com" 
];

// 🧱 Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Nicht erlaubte Origin: " + origin));
      }
    },
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supergeheim", // ⚠️ später in .env
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // lokal false, auf Render dann true
      sameSite: "lax",
    },
  })
);


// 📝 Logging für API-Routen
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
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

(async () => {
  const server = await registerRoutes(app);

  // 🛠 Fehlerbehandlung
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });

    // ⛔ Kein throw – Render mag das nicht
    console.error("Serverfehler:", err);
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // 🌐 Port korrekt setzen
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
