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

## Run docker for development

docker-compose --env-file .env.local up -d

## Build image

docker buildx build -t farm-contracts-image .

## Run container

docker run -p 3000:3000 farm-contracts-image
