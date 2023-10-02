#!/bin/bash

# Run migration command
npx prisma migrate deploy

# Start the application
npm run start:prod