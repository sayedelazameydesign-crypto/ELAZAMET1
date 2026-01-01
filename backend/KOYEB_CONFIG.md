# Koyeb Deployment Configuration for Node.js Backend
# This file helps Koyeb understand how to deploy the backend

# Build Configuration
buildCommand: npm install

# Start Configuration  
startCommand: node server.js

# Port Configuration
port: 5001

# Environment Variables (set these in Koyeb Dashboard)
# MONGO_URI=your-mongodb-connection-string
# FRONTEND_URL=your-vercel-app-url
# PORT=5001
