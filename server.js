import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config(); // Carga variables automáticamente

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ✅ Servir los archivos de la build
app.use(express.static(path.join(__dirname, "dist")));

// 🧭 Redirigir todas las rutas al index.html (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// 🌐 Variables de entorno dinámicas
const API_URL = process.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Frontend servido en http://localhost:${PORT}`);
  console.log(`🔗 Backend apuntando a: ${API_URL}`);
});
