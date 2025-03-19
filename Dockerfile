# 🛠 Usar una imagen ligera de Node.js basada en Alpine
FROM node:18-alpine AS build  

# 📂 Establecer el directorio de trabajo en el contenedor
WORKDIR /app  

# 📦 Copiar los archivos de dependencias primero para aprovechar la caché
COPY package.json package-lock.json ./  

# 📥 Instalar las dependencias en modo producción
RUN npm install --production  

# 📂 Copiar el resto del código fuente al contenedor
COPY . .  

# ⚙️ Generar el build de Vite
RUN npm run build  

# ----------------------------------------
# 🔥 Segunda etapa para producción (solo archivos necesarios)
FROM node:18-alpine AS production  

WORKDIR /app  

# Copiar solo la carpeta "dist" desde la imagen anterior
COPY --from=build /app/dist ./dist  
COPY package.json package-lock.json ./  
COPY server.js ./  

# 📥 Instalar solo las dependencias necesarias para producción
RUN npm install --production  

# 🚀 Exponer el puerto que usará Railway o localhost
EXPOSE 3000  

# 🎯 Iniciar el servidor Express para servir "dist"
CMD ["node", "server.js"]
