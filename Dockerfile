# CreditSight Multi-Stage Docker Container (React Frontend + FastAPI Backend)

# Stage 1: Build React + TypeScript + Tailwind UI
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Python FastAPI + Multi-Agent Backend
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source & artifacts
COPY . .

# Copy built React static bundle from Stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Cloud Run / Docker port configuration
ENV PORT=8080
ENV PYTHONUNBUFFERED=1

EXPOSE 8080

# Healthcheck against FastAPI /api/health
HEALTHCHECK CMD curl --fail http://localhost:${PORT}/api/health || exit 1

# Launch FastAPI serving both REST API and React SPA
CMD ["sh", "-c", "uvicorn creditsight.api.server:app --host 0.0.0.0 --port ${PORT}"]
