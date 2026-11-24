# ==============================================================================
# CreditSight — Google Cloud Run Automated Deployment Script (PowerShell)
# Run this in PowerShell after installing Google Cloud CLI (gcloud)
# ==============================================================================
$ErrorActionPreference = "Stop"

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "💳 Deploying CreditSight to Google Cloud Run" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

# Check if gcloud is installed
if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
    Write-Host "❌ 'gcloud' CLI is not found in your PATH." -ForegroundColor Red
    Write-Host "👉 Install it via: winget install Google.CloudSDK" -ForegroundColor Yellow
    Write-Host "   or deploy directly using Google Cloud Shell (browser): https://shell.cloud.google.com" -ForegroundColor Yellow
    Exit 1
}

$CurrentProject = (gcloud config get-value project 2>$null)
if (-not $CurrentProject -or $CurrentProject -eq "(unset)") {
    $GcpProject = Read-Host "Enter your Google Cloud Project ID"
    gcloud config set project $GcpProject
} else {
    $GcpProject = $CurrentProject
}

$Region = "us-central1"
$ServiceName = "creditsight"

Write-Host "📍 Project: $GcpProject" -ForegroundColor Green
Write-Host "📍 Region:  $Region" -ForegroundColor Green
Write-Host "📍 Service: $ServiceName" -ForegroundColor Green

Write-Host "`n⚙️ Enabling necessary GCP APIs..." -ForegroundColor Cyan
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com

Write-Host "`n🚀 Building container image and deploying to Cloud Run..." -ForegroundColor Cyan
gcloud run deploy $ServiceName `
  --source . `
  --platform managed `
  --region $Region `
  --allow-unauthenticated `
  --port 8080 `
  --memory 1Gi `
  --cpu 1 `
  --min-instances 0 `
  --max-instances 3

Write-Host "`n======================================================" -ForegroundColor Green
Write-Host "✅ CreditSight successfully deployed to Google Cloud!" -ForegroundColor Green
Write-Host "🌐 Live Application URL:" -ForegroundColor Green
gcloud run services describe $ServiceName --platform managed --region $Region --format "value(status.url)"
Write-Host "======================================================" -ForegroundColor Green
