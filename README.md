# First Steps

1. cp .env.production-example .env
2. set .env configurations (app url, app port, database, mail config, etc)

# How to run 

1. docker-compose up -d
2. docker-compose exec app bash
3. composer install + npm install
4. composer install --optimize-autoloader --no-dev
5. php artisan event:cache
6. php artisan route:cache
7. php artisan view:cache
8. php artisan migrate
9. php artisan db:seed
10. npm run build
11. exit
