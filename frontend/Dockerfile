# Stage 1: Build
FROM node:18-alpine AS build

WORKDIR /app

# Copiamos archivos de dependencias
COPY package.json package-lock.json ./
RUN npm install

# --- CONFIGURACIÓN DE VARIABLES DE ENTORNO ---
# 1. Definimos el argumento que vendrá desde docker-compose
ARG REACT_APP_API_URL

# 2. Lo convertimos en variable de entorno para que el proceso 'npm run build' lo capture
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Copiamos el resto del código
COPY . .

# Al ejecutar el build, React "quemará" el valor de REACT_APP_API_URL en el código estático
RUN npm run build

# Stage 2: Servidor de producción (Nginx)
FROM nginx:alpine

# Copiamos el build generado en la etapa anterior a la ruta de Nginx
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]