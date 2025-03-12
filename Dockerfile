# Usa una imagen base de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos del proyecto al contenedor
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Construye la aplicación de Vite
RUN npm run build

# Expone el puerto que el contenedor va a usar
EXPOSE 5174

# Define el comando para iniciar la aplicación
CMD ["npm", "run", "preview"]
