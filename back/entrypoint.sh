sleep 5

npm install
npm run build

while ! nc -z dev-db 5432; do   
  echo "Waiting for Postgres server at 'dev-db:5432' to accept connections..."
  sleep 2
done

if [ "$NODE_ENV" = "development" ]; then
  npx prisma migrate dev
fi

if [ "$NODE_ENV" = "development" ]; then
  npm run start
fi

if [ "$NODE_ENV" != "development" ]; then
 npm run start:prod
fi
