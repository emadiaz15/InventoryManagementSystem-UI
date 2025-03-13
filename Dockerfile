# Usar una imagen oficial de Node.js como base
FROM node:18-alpine

# Establecer el directorio de trabajo en el contenedor
WORKDIR /src

# Copiar los archivos de package.json y package-lock.json
COPY package.json package-lock.json /src/

# Instalar las dependencias de Node.js
RUN npm install
RUN npm install crypto


# Copiar el resto del código al contenedor
COPY . /src

# Exponer el puerto que usará Vite.js (por defecto 5173)
EXPOSE 5173

# Iniciar Vite.js en modo desarrollo
CMD ["npm", "run", "dev"]
