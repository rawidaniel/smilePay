ARCH="amd64" GCLOUD_HOSTED_METRICS_URL="https://prometheus-prod-13-prod-us-east-0.grafana.net/api/prom/push" GCLOUD_HOSTED_METRICS_ID="1214492" GCLOUD_SCRAPE_INTERVAL="60s" GCLOUD_HOSTED_LOGS_URL="https://logs-prod-006.grafana.net/loki/api/v1/push" GCLOUD_HOSTED_LOGS_ID="706321" GCLOUD_RW_API_KEY="glc_eyJvIjoiOTU2NDIyIiwibiI6InNtaWxlcGF5IiwiayI6InUzNXY0NVg2NkdHVXdVZ1I0TTkyYU81aCIsIm0iOnsiciI6InByb2QtdXMtZWFzdC0wIn19" /bin/sh -c "$(curl -fsSL https://storage.googleapis.com/cloud-onboarding/agent/scripts/grafanacloud-install.sh)"