import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// ✅ Cargar variables de entorno desde `.env` (incluyendo VITE_API_BASE_URL)
dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 📦 Servir archivos estáticos desde el directorio `dist`
app.use(express.static(path.join(__dirname, "dist")));

// 🧭 Redirigir cualquier ruta no encontrada al frontend (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// 🔧 Variables con fallback por si no están definidas
const API_URL = process.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const PORT = process.env.PORT || 3000;

// 🚀 Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🌍 Frontend disponible en ${API_URL} en el puerto ${PORT}`);
});
