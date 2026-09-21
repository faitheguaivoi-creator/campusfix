FROM php:8.2-cli

# Install system deps and PHP extensions Laravel needs
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo_mysql zip bcmath gd mbstring

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN composer install --no-dev --optimize-autoloader

EXPOSE 10000

CMD php artisan migrate --force \
    && php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache \
    && php artisan storage:link || true \
    && php artisan serve --host=0.0.0.0 --port=$PORT