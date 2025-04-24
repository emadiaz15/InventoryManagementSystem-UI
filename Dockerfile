# 🛠 Usar una imagen ligera de Node.js basada en Alpine
FROM node:18-alpine  

# 📂 Establecer el directorio de trabajo en el contenedor
WORKDIR /app  

# 📦 Copiar los archivos de dependencias primero para aprovechar la caché
COPY package.json package-lock.json ./  

# 📥 Instalar las dependencias del proyecto
RUN npm install  

# 📂 Copiar el resto del código fuente al contenedor
COPY . .  

# ⚙️ Ejecutar el build de Vite para generar la carpeta "dist"
RUN npm run build  

# 🔥 Instalar Express para servir los archivos estáticos
RUN npm install express  

# 🚀 Copiar el archivo del servidor Express
COPY server.js .

# 🎯 Iniciar el servidor Express para servir "dist"
CMD ["node", "server.js"]
