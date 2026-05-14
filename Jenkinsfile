pipeline {
  agent any

  environment {
    // ── Replace with your Docker Hub username ──────────────────
    DOCKER_HUB     = 'sdamani97',
    DOCKER_USER = 'sdamani97',
    DOCKER_PASS = 'AQAAABAAAAAQhexs3Z9XGr1svcEpU8n4MuJhkDa2JFoIbFsg5s9b0Vo=' ,
    IMAGE_TAG = "${BUILD_NUMBER}"
    // Credential ID set in Jenkins → Manage Jenkins → Credentials
    DOCKER_CREDS   = credentials('Country-app-weather')
    }
stages {

  // ── Stage 1: Pull code from Git ───────────────────────────
  stage('Clone Repository') {
    steps {
      git branch: 'main', url: 'https://github.com/sadamani97/FullStack-project.git'
    }
    }

// ── Stage 2: Build Backend (TypeScript → JS) ──────────────
  stage('Build Backend Image') {
   steps {
                dir('backend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
  }

    // ── Stage 3: Build Frontend (Vite → dist/) ────────────────

  stage('Build Frontend') {
    steps {
                dir('frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
  }

  stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'Country-app-weather',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    bat 'docker login -u %DOCKER_USER% -p %DOCKER_PASS%'
                }
            }


  stage('Build Docker Images') {
            steps {

                bat 'docker build -t sdamani97/backend:%IMAGE_TAG% ./backend'

                bat 'docker build -t sdamani97/frontend:%IMAGE_TAG% ./frontend'
            }
        }

        stage('Push Docker Images') {
            steps {

                bat 'docker push sdamani97/backend:%IMAGE_TAG%'

                bat 'docker push sdamani97/frontend:%IMAGE_TAG%'
            }
        }
        



  stage('Update Kubernetes Images') {
            steps {

                bat '''
                kubectl set image deployment/backend backend=sdamani97/backend:%IMAGE_TAG% -n fullstack
                '''

                bat '''
                kubectl set image deployment/frontend frontend=sdamani97/frontend:%IMAGE_TAG% -n fullstack
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
    docker Logout()
    }
  }




