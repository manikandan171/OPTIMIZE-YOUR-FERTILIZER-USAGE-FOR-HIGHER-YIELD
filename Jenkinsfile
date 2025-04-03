pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'mani1711/fertilizer-optimizer:latest'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git url: 'https://github.com/manikandan171/OPTIMIZE-YOUR-FERTILIZER-USAGE-FOR-HIGHER-YIELD.git', branch: 'main'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh '''
                    docker build -t $DOCKER_IMAGE .
                    '''
                }
            }
        }

        stage('Push Image to Docker Hub') {
            steps {
                script {
                    sh '''
                    docker login -u mani1711 -p Rithvikmani123#
                    docker push $DOCKER_IMAGE
                    docker logout
                    '''
                }
            }
        }

        stage('Deploy to Minikube') {
            steps {
                script {
                    sh '''
                    minikube start --driver=docker
                    kubectl config set-cluster minikube --server=https://$(minikube ip):8443
                    kubectl config set-context minikube --cluster=minikube --user=minikube
                    kubectl config use-context minikube
                    
                    # Apply the Kubernetes deployment
                    kubectl apply -f deployment.yaml --validate=false
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    sh '''
                    kubectl get pods
                    kubectl get services
                    '''
                }
            }
        }
    }

    post {
        failure {
            echo 'Build or Deployment Failed! Check logs for errors.'
        }
        success {
            echo 'Deployment Successful!'
        }
    }
}
