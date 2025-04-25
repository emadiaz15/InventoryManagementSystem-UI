# 🛠 Imagen base de Node.js sobre Alpine (ligera y rápida)
FROM node:18-alpine as builder

# 📂 Directorio de trabajo
WORKDIR /app

# 📦 Copiar dependencias primero
COPY package*.json ./
RUN npm install

# 📂 Copiar el resto del código (incluyendo .env.production)
COPY . .

# 🧪 Usar el archivo de entorno de producción durante el build
COPY .env.production .env

# ⚙️ Generar el build optimizado con Vite
RUN npm run build


# 🌐 Etapa final: solo servir archivos (más segura, más ligera)
FROM node:18-alpine

# 🔒 Crear un usuario sin privilegios
RUN addgroup app && adduser -S -G app app

# 📂 Directorio de trabajo
WORKDIR /app

# 📂 Copiar solo los archivos necesarios del build anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.env.production .env

# 👤 Usar el usuario sin privilegios
USER app

# 🚀 Servir con Express
CMD ["node", "server.js"]
