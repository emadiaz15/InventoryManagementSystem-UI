# 🛠 Etapa 1: Construcción del Frontend
FROM node:18-alpine AS build  

# 📂 Establecer el directorio de trabajo en el contenedor
WORKDIR /app  

# 📦 Copiar archivos esenciales para instalar dependencias
COPY package.json package-lock.json ./  

# 📥 Instalar TODAS las dependencias (dev y prod) para el build
RUN npm ci  

# 📂 Copiar el resto del código fuente
COPY . .  

# ⚙️ Generar el build de Vite
RUN npm run build  

# ----------------------------------------
# 🔥 Etapa 2: Producción (solo archivos necesarios)
FROM node:18-alpine AS production  

WORKDIR /app  

# Copiar solo la carpeta "dist" y las dependencias necesarias
COPY --from=build /app/dist ./dist  
COPY --from=build /app/node_modules ./node_modules  
COPY package.json package-lock.json ./  
COPY server.js ./  

# Definir entorno de producción
ENV NODE_ENV=production  

# 🚀 Exponer el puerto (Railway o localhost)
EXPOSE 3000  

# 🎯 Iniciar el servidor Express para servir "dist"
CMD ["node", "server.js"]
