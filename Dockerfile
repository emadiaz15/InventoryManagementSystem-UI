FROM node:18-slim

WORKDIR /app

COPY package*.json ./

# Aquí: aseguramos instalar devDependencies
ENV NODE_ENV=development
RUN npm install
RUN npm install -g serve

COPY . .

# Ahora sí corremos el build
RUN npm run build

# Producción real
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
