#!/bin/bash

# Install Wrangler if not installed
if ! command -v wrangler &> /dev/null
then
    echo "Installing wrangler..."
    npm install -g wrangler
fi

# Login to Cloudflare if needed
echo "Checking Cloudflare authentication..."
wrangler whoami || wrangler login

# Deploy to Cloudflare Workers
echo "Deploying to Cloudflare Workers..."
wrangler deploy

echo "Deployment complete!" 