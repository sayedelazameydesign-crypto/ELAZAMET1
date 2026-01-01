# Koyeb Deployment Configuration for Python ML Backend
# This file helps Koyeb understand how to deploy the ML backend

# Build Configuration
buildCommand: pip install -r requirements.txt

# Start Configuration
startCommand: uvicorn app:app --host 0.0.0.0 --port 8000

# Port Configuration
port: 8000

# Environment Variables (set these in Koyeb Dashboard)
# OPENAI_API_KEY=your-openai-api-key
# FRONTEND_URL=your-vercel-app-url
# DATABASE_URL=sqlite:///./enhanced_store.db
