# Kubernetes Deployment for FullStack Project

This directory contains Kubernetes manifests for deploying the FullStack application.

## Prerequisites

- Kubernetes cluster (minikube, EKS, GKE, AKS, or local)
- `kubectl` CLI configured
- Docker images pushed to a registry

## Files Overview

- `namespace.yaml` - Kubernetes namespace for the app
- `secret.yaml` - Sensitive data (passwords, JWT secret)
- `configmap.yaml` - Configuration variables
- `mysql-pvc.yaml` - Persistent volume for MySQL data
- `mysql-deployment.yaml` - MySQL deployment
- `mysql-service.yaml` - MySQL service
- `backend-deployment.yaml` - Node.js backend deployment
- `backend-service.yaml` - Backend service
- `frontend-deployment.yaml` - React frontend deployment
- `frontend-service.yaml` - Frontend service
- `ingress.yaml` - Ingress for routing

## Pre-Deployment Steps

### 1. Build Docker Images

```bash
# Backend
cd backend
docker build -t your-registry/fullstack-backend:latest .
docker push your-registry/fullstack-backend:latest

# Frontend
cd ../frontend
docker build -t your-registry/fullstack-frontend:latest .
docker push your-registry/fullstack-frontend:latest
```

### 2. Update Image Registries

Edit the following files and replace `your-registry` with your actual registry:
- `backend-deployment.yaml` - Update `image` field
- `frontend-deployment.yaml` - Update `image` field

Example: `docker.io/myusername/fullstack-backend:latest`

### 3. Update Secrets (IMPORTANT)

Edit `secret.yaml` and update the JWT_SECRET with a strong value:

```bash
# Generate a strong JWT secret
openssl rand -hex 32
```

## Deployment

### Option 1: Deploy All at Once

```bash
kubectl apply -f k8s/
```

### Option 2: Deploy Step by Step

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Create secrets and config
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/configmap.yaml

# Deploy database
kubectl apply -f k8s/mysql-pvc.yaml
kubectl apply -f k8s/mysql-deployment.yaml
kubectl apply -f k8s/mysql-service.yaml

# Wait for MySQL to be ready
kubectl wait --for=condition=available --timeout=300s deployment/mysql -n fullstack

# Deploy backend
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml

# Deploy frontend
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml

# Setup ingress
kubectl apply -f k8s/ingress.yaml
```

## Verification

```bash
# Check all pods
kubectl get pods -n fullstack

# Check services
kubectl get svc -n fullstack

# Check deployments
kubectl get deployments -n fullstack

# View logs
kubectl logs -n fullstack deployment/backend
kubectl logs -n fullstack deployment/frontend
kubectl logs -n fullstack deployment/mysql

# Describe a pod for details
kubectl describe pod <pod-name> -n fullstack
```

## Port Forwarding (For Local Access)

```bash
# Backend: localhost:5000
kubectl port-forward -n fullstack svc/backend 5000:5000

# Frontend: localhost:3000
kubectl port-forward -n fullstack svc/frontend 3000:80

# MySQL: localhost:3307
kubectl port-forward -n fullstack svc/mysql 3307:3306
```

## Scaling

```bash
# Scale backend to 3 replicas
kubectl scale deployment backend --replicas=3 -n fullstack

# Scale frontend to 3 replicas
kubectl scale deployment frontend --replicas=3 -n fullstack
```

## Cleanup

```bash
# Delete all resources
kubectl delete namespace fullstack
```

## Accessing the Application

### Using Ingress
Update your `/etc/hosts` (or `C:\Windows\System32\drivers\etc\hosts` on Windows):
```
127.0.0.1 fullstack.local
```

Then access:
- Frontend: http://fullstack.local
- Backend API: http://fullstack.local/api

### Using Port Forwarding
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Using LoadBalancer
Get the external IP:
```bash
kubectl get svc -n fullstack
```

## Notes

- The backend requires a `/health` endpoint for liveness/readiness probes
- Adjust resource requests/limits based on your cluster capacity
- For production, use a managed database service instead of in-cluster MySQL
- Store secrets in a proper secret management system (AWS Secrets Manager, HashiCorp Vault, etc.)
- Configure proper ingress controller (nginx, Traefik, etc.)
