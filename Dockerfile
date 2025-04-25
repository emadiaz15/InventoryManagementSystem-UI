# 🔧 Lightweight Node image
FROM node:18-slim

# 📂 App directory
WORKDIR /app

# 📦 Dependencies (prod only)
COPY package*.json ./
RUN npm install --omit=dev

# 📂 Source code
COPY . .

# ⚙️ Build
RUN npm run build

# 🌍 Port exposure for Railway
ENV PORT=3000
EXPOSE 3000

# 🚀 Start Express
CMD ["node", "server.js"]
