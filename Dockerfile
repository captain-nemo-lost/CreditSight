# CreditSight Docker Container Blueprint
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency specifications
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY . .

# Cloud Run injects PORT environment variable (default: 8080)
ENV PORT=8080
ENV PYTHONUNBUFFERED=1

EXPOSE 8080

# Healthcheck
HEALTHCHECK CMD curl --fail http://localhost:${PORT}/_stcore/health || exit 1

# Launch Streamlit web dashboard dynamically honoring Cloud Run's PORT env variable
CMD ["sh", "-c", "streamlit run creditsight/ui/app.py --server.port=${PORT} --server.address=0.0.0.0 --server.enableCORS=false --server.enableXsrfProtection=false --server.headless=true"]
