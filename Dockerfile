# 🔧 Imagen base ligera
FROM node:18-slim

# 📁 Directorio de trabajo
WORKDIR /app

# 📦 Copia e instala dependencias
COPY package*.json ./
RUN npm install
RUN npm install -g serve

# 📁 Copia todo el código
COPY . .

# ⚙️ Define argumento para build-time y variable de entorno
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL:-}

# 🧪 Debug build
RUN echo "🏗️  VITE_API_BASE_URL DURING BUILD: ${VITE_API_BASE_URL}"

# ✅ Validación flexible para Railway o docker-compose (ambos deben pasar el valor)
RUN if [ -z "$VITE_API_BASE_URL" ]; then \
    echo '❌ VITE_API_BASE_URL no está definida. Define la variable en docker-compose o Railway settings.' && exit 1; \
    fi

# ⚙️ Compila con Vite
RUN npm run build

# 🚀 Sirve en modo producción
ENV PORT=3000
EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
