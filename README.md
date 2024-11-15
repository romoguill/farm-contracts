# APP SETUP

## Environment variables

APP_URL=""
POSTGRES_DB=""
POSTGRES_USER=""
POSTGRES_PASSWORD=""
POSTGRES_HOST=""
POSTGRES_PORT=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_REDIRECT_URL=""
RESEND_API_KEY=""
DOMAIN_SENDER=""
AWS_BUCKET_NAME=""
AWS_BUCKET_REGION=""
AWS_ACCESS_KEY=""
AWS_SECRET_KEY=""

## Run docker dev

docker compose -f docker-compose.dev.yml --env-file .env.local up -d

## Run docker prod

docker compose -f docker-compose.prod.yml --env-file .env.local up -d

## Build image prod

docker buildx build -t farm-contracts-prod .

## Build image dev

docker buildx build -t farm-contracts-dev -f Dockerfile.dev .
