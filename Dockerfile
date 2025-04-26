FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install -g serve

COPY . .

# 🔥 DEBUG: Mostrar la variable antes de build
RUN echo "VITE_API_BASE_URL=$VITE_API_BASE_URL"

# 🔥 Build
RUN npm run build

ENV PORT=3000
EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
