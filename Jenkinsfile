pipeline {
    agent any

    environment {
        // Get these from Jenkins credentials
        MONGODB_URI = credentials('mongodb-uri')
        PORT = '5000'
        DOCKER_IMAGE = 'your-docker-repo/fertilizer-optimizer'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/yourusername/fertilizer-optimizer.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Application') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build Docker image with environment variables
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}", 
                        "--build-arg MONGODB_URI=${MONGODB_URI} " +
                        "--build-arg PORT=${PORT} " +
                        ".")
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    // Authenticate to Docker registry (configure credentials in Jenkins)
                    withCredentials([usernamePassword(
                        credentialsId: 'docker-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
                        sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                    }
                }
            }
        }

        stage('Deploy to Production') {
            steps {
                script {
                    // SSH into production server and deploy
                    sshagent(['your-ssh-credentials-id']) {
                        sh """
                            ssh user@production-server \
                            "docker pull ${DOCKER_IMAGE}:${DOCKER_TAG} && \
                            docker stop fertilizer-optimizer || true && \
                            docker rm fertilizer-optimizer || true && \
                            docker run -d \
                                -p ${PORT}:${PORT} \
                                -e MONGODB_URI=${MONGODB_URI} \
                                --name fertilizer-optimizer \
                                ${DOCKER_IMAGE}:${DOCKER_TAG}"
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            // Cleanup
            sh 'docker logout'
            echo 'Pipeline completed'
        }
        success {
            // Optional: Send success notification
            slackSend(color: 'good', message: "Build ${env.BUILD_NUMBER} deployed successfully")
        }
        failure {
            // Optional: Send failure notification
            slackSend(color: 'danger', message: "Build ${env.BUILD_NUMBER} failed")
        }
    }
}
