# 🔧 Imagen base ligera
FROM node:18-slim

# 📂 Directorio de trabajo
WORKDIR /app

# 📦 Copiar dependencias e instalar solo producción
COPY package*.json ./
RUN npm install --omit=dev

# 📂 Copiar todo el código fuente
COPY . .

# 🧪 Copiar entorno de producción
COPY .env.production .env

# ⚙️ Generar el build optimizado
RUN npm run build

# 🌍 Exponer el puerto para Railway (usa variable PORT automáticamente)
ENV PORT=3000
EXPOSE 3000

# 🚀 Servir con Express
CMD ["node", "server.js"]
