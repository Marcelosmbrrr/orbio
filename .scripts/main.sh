#!/bin/bash
set -e

echo "Production deployment started"

# Enter maintenance mode
(php artisan down) || true

# Pull the latest version of the app
git pull https://github.com/Marcelosmbrrr/orbio.git main

# Install all dependencies
composer install --optimize-autoloader --no-dev
npm install

# Clear and recreates cache
php artisan event:cache
php artisan route:cache
php artisan view:cache

# Directory permissions
chmod -R 777 storage bootstrap/cache

# Compile npm assets
npm run build

# Generate application initial data
php artisan migrate:fresh --seed

# Clean storage and create symbolic link to public folder
rm -rf storage/app/public/*
php artisan storage:link

# Exit maintenance mode
php artisan up

echo "Production deployment finished"






