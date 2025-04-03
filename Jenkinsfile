pipeline {
    agent any

    environment {
        IMAGE_NAME = "manikandan171/fertilizer-optimizer"
        CONTAINER_NAME = "fertilizer-optimizer-container"
        MINIKUBE_CONTEXT = "minikube"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git 'https://github.com/manikandan171/OPTIMIZE-YOUR-FERTILIZER-USAGE-FOR-HIGHER-YIELD.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${IMAGE_NAME} ."
                }
            }
        }

        stage('Push Image to Docker Hub') {
            steps {
                script {
                    withDockerRegistry([credentialsId: 'docker-hub-credentials', url: '']) {
                        sh "docker push ${IMAGE_NAME}"
                    }
                }
            }
        }

        stage('Deploy to Minikube') {
            steps {
                script {
                    sh "kubectl config use-context ${MINIKUBE_CONTEXT}"
                    sh "kubectl apply -f deployment.yaml"
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    sh "kubectl get pods"
                }
            }
        }
    }
}
