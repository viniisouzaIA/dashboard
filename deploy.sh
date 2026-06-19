#!/bin/bash
set -e

IMAGE="ghcr.io/viniisouzaia/dashboard:latest"
SERVICE="dashboard_dashboard"

echo "==> Puxando imagem mais recente..."
docker pull "$IMAGE"

echo "==> Forçando redeploy do serviço..."
docker service update --image "$IMAGE" --force "$SERVICE"

echo "==> Deploy concluído."
docker service ps "$SERVICE" --no-trunc
