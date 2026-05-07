pipeline {
  agent any

  environment {
    // ── Replace with your Docker Hub username ──────────────────
    DOCKER_HUB     = 'your-dockerhub-username'
    IMAGE_BACKEND  = "${DOCKER_HUB}/fullstack-backend"
    IMAGE_FRONTEND = "${DOCKER_HUB}/fullstack-frontend"

    // Credential ID set in Jenkins → Manage Jenkins → Credentials
    DOCKER_CREDS   = credentials('dockerhub-creds')
    }
stages {

  // ── Stage 1: Pull code from Git ───────────────────────────
  stage('Checkout') {
    steps {
      echo '==> Pulling latest code...'
      checkout scm
    }
    }

// ── Stage 2: Build Backend (TypeScript → JS) ──────────────
  stage('Build Backend') {
    steps {
      dir('backend') {
        echo '==> Installing backend dependencies...'
        bat 'npm install'
        echo '==> Running TypeScript compiler...'
        bat 'npm run build'
      }
  }
}

    // ── Stage 3: Build Frontend (Vite → dist/) ────────────────

  stage('Build Frontend') {
    steps {
        
      dir('frontend') {
        echo '==> Installing frontend dependencies...'                   
        bat 'npm install'
        echo '==> Building frontend...'
        bat 'npm run build'
      }
    }
  }

// ── Stage 4: Build Docker Images ─────────────────────────
    // Tags with BUILD_NUMBER (for traceability) AND "latest"
  stage('Build Docker Images') {
    steps {
      echo '==> Building backend Docker image...'
      bat "docker build -t ${IMAGE_BACKEND}:${env.BUILD_NUMBER} -t ${IMAGE_BACKEND}:latest -f backend/dockerfile ."            
      echo '==> Building frontend Docker image...'
      bat "docker build -t ${IMAGE_FRONTEND}:${env.BUILD_NUMBER} -t ${IMAGE_FRONTEND}:latest -f frontend/dockerfile ."
    }
  }

  // ── Stage 5: Push Images to Docker Hub ───────────────────
  stage('Push to Docker Hub') {
    steps {
      echo '==> Logging in to Docker Hub...'
      bat "docker login -u ${DOCKER_CREDS_USR} -p ${DOCKER_CREDS_PSW}"
      
      echo '==> Pushing backend image...'
      bat "docker push ${IMAGE_BACKEND}:${env.BUILD_NUMBER}"
      bat "docker push ${IMAGE_BACKEND}:latest"
      
      echo '==> Pushing frontend image...'
      bat "docker push ${IMAGE_FRONTEND}:${env.BUILD_NUMBER}"
      bat "docker push ${IMAGE_FRONTEND}:latest"    
    }
  }
    // ── Stage 6: Deploy with Docker Compose ──────────────────
    // Pulls latest images and restarts containers
  stage('Deploy to Server') {
    steps {
      echo '==> Deploying to server...'
      // Assuming you have SSH access and docker-compose.yml on the server
      // You can use Jenkins SSH plugin or execute remote commands via SSH
      // Example using SSH plugin:
      sshCommand remote: [host: 'your-server-ip', user: 'your-ssh-user', identityFile: 'path-to-ssh-key'], command: '''
          cd /path/to/your/docker-compose-directory
          docker-compose pull
          docker-compose up -d
      '''
    }
  }
}
// ── After pipeline finishes ────────────────────────────────────
post {
  success {
    echo '✅ Pipeline completed successfully!'
  }
  failure {
    echo '❌ Pipeline failed. Please check the logs.'
  }
  always {
    echo '🔒 Cleaning up...'
    // Optional: Logout from Docker Hub, clean workspace, etc.
    dockerLogout()
    }
  }
}



