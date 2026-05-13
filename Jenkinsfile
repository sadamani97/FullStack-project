pipeline {
  agent any

  environment {
    // ── Replace with your Docker Hub username ──────────────────
    DOCKER_HUB     = 'sdamani97'
    // Credential ID set in Jenkins → Manage Jenkins → Credentials
    DOCKER_CREDS   = credentials('Country-app-weather')
    }
stages {

  // ── Stage 1: Pull code from Git ───────────────────────────
  stage('Clone Repository') {
    steps {
      git url: 'https://github.com/sadamani97/FullStack-project.git'
    }
    }

// ── Stage 2: Build Backend (TypeScript → JS) ──────────────
  stage('Build Backend Image') {
   steps {
                bat 'docker build -t sdamani97/backend:v1 ./backend'
            }
  }

    // ── Stage 3: Build Frontend (Vite → dist/) ────────────────

  stage('Build Frontend') {
    steps {
            bat 'docker build -t sdamani97/frontend:v1 ./frontend'
            }
  }


  // ── Stage 5: Push Images to Docker Hub ───────────────────
  stage('Push to Docker Hub') {
     steps {
                bat 'docker push sdamani97/backend:v1'
            }
  }
    // ── Stage 6: Deploy with Docker Compose ──────────────────
    stage('Push Frontend Image') {
            steps {
                bat 'docker push sdamani97/frontend:v1'
            }
        }

        stage('Deploy Kubernetes') {
            steps {
                bat 'kubectl apply -f k8s/'
            }
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
    docker Logout()
    }
  }
}



