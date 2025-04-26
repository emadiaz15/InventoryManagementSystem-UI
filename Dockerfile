FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

CMD ["echo", "Frontend build listo. Usa Nginx para servir."]
