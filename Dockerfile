FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install -g serve

COPY . .

# 💥 Define ARG para VITE_API_BASE_URL
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# 🔥 Verificar que llega
RUN echo "VITE_API_BASE_URL DURING BUILD: $VITE_API_BASE_URL"

# 🔥 Build usando variable correcta
RUN npm run build

ENV PORT=3000
EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
