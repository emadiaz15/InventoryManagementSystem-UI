FROM node:18-slim

WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install
RUN npm install -g serve

# Copiar el resto de archivos
COPY . .

# Build del frontend
RUN npm run build

# Definir PORT para Railway
ENV PORT=3000
EXPOSE 3000

# Importante: Servir el build con serve, escuchando el $PORT de Railway
CMD ["serve", "-s", "dist", "-l", "3000"]
