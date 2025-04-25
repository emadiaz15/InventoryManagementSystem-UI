# 🔧 Imagen ligera de Node.js
FROM node:18-slim

# 📂 Directorio de trabajo
WORKDIR /app

# 📦 Instalar TODAS las dependencias (incluye vite)
COPY package*.json ./
RUN npm install

# 📂 Copiar el código
COPY . .

# ⚙️ Build con Vite
RUN npm run build

# 🌍 Puerto para Railway
ENV PORT=3000
EXPOSE 3000

# 🚀 Servir con Express
CMD ["node", "server.js"]
