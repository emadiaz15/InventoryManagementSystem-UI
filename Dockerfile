FROM node:18-slim

WORKDIR /app

COPY package*.json ./

# 🔥 Instala todas las dependencias incluyendo devDependencies (vite)
RUN npm install

# 🔥 Instala vite globalmente para que esté disponible
RUN npm install -g vite serve

COPY . .

# 🔥 Build el proyecto
RUN vite build

# 🔥 Exponer el puerto de production
ENV PORT=3000
EXPOSE 3000

# 🔥 Serve el contenido built
CMD ["serve", "-s", "dist", "-l", "3000"]
