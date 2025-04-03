pipeline {
    agent any

    environment {
        IMAGE_NAME = "mani1711/fertilizer-optimizer:latest"
        CONTAINER_NAME = "fertilizer-optimizer-container"
        DOCKER_USER = "mani1711"
        DOCKER_PASS = "Rithvikmani123#"
        GIT_BRANCH = "main"  // Change this to the correct branch
    }

    stages {
        stage('Clone Repository') {
            steps {
                script {
                    checkout([$class: 'GitSCM', 
                        branches: [[name: "*/${GIT_BRANCH}"]], 
                        userRemoteConfigs: [[url: 'https://github.com/manikandan171/OPTIMIZE-YOUR-FERTILIZER-USAGE-FOR-HIGHER-YIELD.git']]
                    ])
                }
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
                    sh "docker login -u ${DOCKER_USER} -p ${DOCKER_PASS}"
                    sh "docker push ${IMAGE_NAME}"
                    sh "docker logout"
                }
            }
        }

        stage('Deploy to Minikube') {
            steps {
                script {
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
