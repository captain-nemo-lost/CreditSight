#!/bin/bash
# ==============================================================================
# CreditSight — Google Cloud Run Automated Deployment Script
# Run this inside Google Cloud Shell or a terminal with gcloud installed.
# ==============================================================================
set -e

echo "======================================================"
echo "💳 Deploying CreditSight to Google Cloud Run"
echo "======================================================"

# 1. Detect or prompt for Project ID
CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null || true)
if [ -z "$CURRENT_PROJECT" ] || [ "$CURRENT_PROJECT" = "(unset)" ]; then
    echo "⚠️  No default GCP project found."
    read -p "Enter your Google Cloud Project ID: " GCP_PROJECT
    gcloud config set project "$GCP_PROJECT"
else
    GCP_PROJECT="$CURRENT_PROJECT"
fi

REGION="us-central1"
SERVICE_NAME="creditsight"

echo "📍 Target Project: $GCP_PROJECT"
echo "📍 Target Region:  $REGION"
echo "📍 Service Name:   $SERVICE_NAME"

# 2. Enable Required GCP APIs
echo ""
echo "⚙️ Enabling necessary GCP APIs (Cloud Run, Cloud Build, Artifact Registry)..."
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com

# 3. Build & Deploy directly from source
echo ""
echo "🚀 Building container image and deploying to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
  --source . \
  --platform managed \
  --region "$REGION" \
  --allow-unauthenticated \
  --port 8080 \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 3

# 4. Display Live URL
echo ""
echo "======================================================"
echo "✅ CreditSight successfully deployed to Google Cloud!"
echo "🌐 Live Application URL:"
gcloud run services describe "$SERVICE_NAME" --platform managed --region "$REGION" --format 'value(status.url)'
echo "======================================================"
