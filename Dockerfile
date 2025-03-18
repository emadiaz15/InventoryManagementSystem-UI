# Usar una imagen oficial de Node.js como base
FROM node:18-alpine

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos de package.json y package-lock.json
COPY package.json package-lock.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código al contenedor
COPY . .

# Ejecutar el build de Vite
RUN npm run build

# Exponer el puerto asignado por Railway (Railway inyecta la variable PORT)
EXPOSE $PORT

# Iniciar el servidor para servir la carpeta dist en producción
CMD ["npx", "serve", "dist", "-s", "-n", "-L", "-p", "${PORT:-5000}"]
