import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// 📌 Cargar variables de entorno desde `.env`
dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 📂 Servir archivos estáticos desde "dist"
app.use(express.static(path.join(__dirname, "dist")));

// 🔄 Manejar rutas de React Router (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// 🚀 Usar el puerto correcto
const PORT = process.env.VITE_PORT || 5173;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
