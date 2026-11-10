FROM php:8.3-fpm-bookworm AS api
RUN apt-get update && apt-get install -y --no-install-recommends libicu-dev libzip-dev libonig-dev libxml2-dev unzip git && docker-php-ext-install pdo_mysql intl zip bcmath pcntl opcache mbstring dom xml && rm -rf /var/lib/apt/lists/*
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer
WORKDIR /app
COPY backend/ ./
RUN composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader && mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs storage/app/public && chown -R www-data:www-data storage bootstrap/cache
COPY deploy/bootstrap-production.php /app/bootstrap-production.php
RUN printf 'upload_max_filesize=10M\npost_max_size=12M\nexpose_php=Off\nopcache.enable=1\n' > /usr/local/etc/php/conf.d/production.ini
FROM node:24-alpine AS frontend
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci --no-audit --no-fund
COPY frontend/ ./
ARG REVERB_PUBLIC_KEY
ENV VITE_API_URL=/api VITE_REVERB_HOST=ahmad-gozali.web.id VITE_REVERB_PORT=443 VITE_REVERB_SCHEME=https
RUN VITE_REVERB_APP_KEY="$REVERB_PUBLIC_KEY" npm run build
FROM nginx:1.27-alpine AS web
COPY deploy/web.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend /frontend/dist /usr/share/nginx/html
COPY --from=api /app/public /app/public
