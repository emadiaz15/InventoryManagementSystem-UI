# Dockerfile.dev

# Usamos Node 18 en Alpine para un contenedor ligero
FROM node:18-alpine

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos esenciales para instalar dependencias
COPY package.json package-lock.json ./

# Instalar las dependencias (dev y prod)
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto en el que Vite se ejecuta (según tu script, 5173)
EXPOSE 5173

# Iniciar el servidor de desarrollo con hot-reload
CMD ["npm", "run", "dev"]
