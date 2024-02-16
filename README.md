# First Steps

1. cp .env.example .env
2. set .env configurations (app url, app port, database, mail config, etc)

# Production run

1. docker-compose up -d
2. docker-compose exec app bash
3. composer install --optimize-autoloader --no-dev
4. npm install
5. php artisan event:cache
6. php artisan route:cache
7. php artisan view:cache
8. php artisan migrate:fresh -seed
9. npm run build
10. exit
