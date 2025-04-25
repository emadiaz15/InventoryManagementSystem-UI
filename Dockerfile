# 🔧 Imagen base ligera de Node.js
FROM node:18-alpine

# 📂 Directorio de trabajo
WORKDIR /app

# 📦 Instalar solo dependencias necesarias para producción
COPY package*.json ./
RUN npm install --omit=dev

# 📂 Copiar código fuente
COPY . .

# 🧪 Copiar entorno de producción
COPY .env.production .env

# ⚙️ Generar el build con Vite
RUN npm run build

# 🚀 Servir archivos estáticos con Express
CMD ["node", "server.js"]
