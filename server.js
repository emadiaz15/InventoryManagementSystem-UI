import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 📦 Servir archivos estáticos desde el directorio `dist`
app.use(express.static(path.join(__dirname, "dist")));

// 🧭 Redirigir cualquier ruta no encontrada al frontend (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// 🚀 Arrancar el servidor en el puerto especificado
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌍 Frontend disponible en ${VITE_API_BASE_URL} ${PORT}`);
});
