# Usa una imagen base de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo package.json y package-lock.json primero para aprovechar la cache de Docker en la instalación de dependencias
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente (después de instalar las dependencias para evitar copiar repetidamente los archivos)
COPY . .

# Construye la aplicación de Vite
RUN npm run build

# Expone el puerto que el contenedor va a usar (en este caso, el puerto 5174)
EXPOSE 5174

# Define el comando para iniciar la aplicación en el modo de previsualización
CMD ["npm", "run", "preview"]
