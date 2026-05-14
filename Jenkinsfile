pipeline {
agent any

```
environment {
    DOCKER_HUB = 'sdamani97'
    IMAGE_TAG = "${BUILD_NUMBER}"
}

stages {

    stage('Clone Repository') {
        steps {
            git branch: 'main',
            url: 'https://github.com/sadamani97/FullStack-project.git'
        }
    }

    stage('Build Backend') {
        steps {
            dir('backend') {
                bat 'npm install'
                bat 'npm run build'
            }
        }
    }

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
            withCredentials([
                usernamePassword(
                    credentialsId: 'Country-app-weather',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )
            ]) {

                bat 'docker login -u %DOCKER_USER% -p %DOCKER_PASS%'
            }
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

    stage('Deploy to Kubernetes') {
        steps {

            bat 'kubectl apply -f k8s/'

            bat 'kubectl set image deployment/backend backend=sdamani97/backend:%IMAGE_TAG% -n fullstack'

            bat 'kubectl set image deployment/frontend frontend=sdamani97/frontend:%IMAGE_TAG% -n fullstack'
        }
    }
}

post {

    success {
        echo 'Pipeline completed successfully!'
    }

    failure {
        echo 'Pipeline failed!'
    }

    always {
        bat 'docker logout'
    }
}
```

}
