# Etapa de compilacion: las variables VITE_* quedan embebidas en el bundle.
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . ./

ARG VITE_FORM_ENDPOINT
ARG VITE_FORM_ACCESS_KEY
ENV VITE_FORM_ENDPOINT=${VITE_FORM_ENDPOINT}
ENV VITE_FORM_ACCESS_KEY=${VITE_FORM_ACCESS_KEY}

RUN npm run build

# Etapa de ejecucion: una imagen pequena que solo sirve los archivos estaticos.
FROM nginx:1.27-alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8080/ || exit 1
