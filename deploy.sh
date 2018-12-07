#!/bin/bash
touch .env
echo "AMAZON_ACCESS_KEY_ID=$AMAZON_ACCESS_KEY_ID" >> ./.env
echo "AMAZON_SECRET_ACCESS_KEY=$AMAZON_SECRET_ACCESS_KEY" >> ./.env
echo "AMAZON_BUCKET_NAME=$AMAZON_BUCKET_NAME" >> ./.env
npm run generate
