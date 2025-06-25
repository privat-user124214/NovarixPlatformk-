CMD ["node", "dist/index.js"]


# Basis-Image
FROM node:20-alpine

# Arbeitsverzeichnis
WORKDIR /app

# Nur package.json und package-lock.json kopieren, um Caching zu ermöglichen
COPY package*.json ./

# Abhängigkeiten installieren
RUN npm install

# Den gesamten Projektinhalt kopieren
COPY . .

# Build ausführen: baut sowohl den Frontend-Teil (via Vite) als auch den Backend-Teil (via esbuild)
RUN npm run build

# App starten (falls du eine Production-Start-Anweisung brauchst, z.B.)
CMD ["node", "dist/index.js"]
