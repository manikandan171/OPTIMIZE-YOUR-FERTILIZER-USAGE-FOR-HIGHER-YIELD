pipeline {
    agent any

    environment {
        // These will be pulled from Jenkins credentials
        DOCKER_REGISTRY = 'your-docker-registry.com'
        APP_NAME = 'fertilizer-optimizer'
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Use SSH or HTTPS with credentials
                git branch: 'main', 
                url: 'https://github.com/manikandan171/OPTIMIZE-YOUR-FERTILIZER-USAGE-FOR-HIGHER-YIELD.git',
                credentialsId: 'github-credentials'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build with build-time arguments
                    docker.build("${DOCKER_REGISTRY}/${APP_NAME}:${env.BUILD_ID}", 
                        "--build-arg MONGODB_URI=\$(cat /run/secrets/mongodb-uri) " +
                        ".")
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    // Authenticate using Jenkins credentials
                    withCredentials([usernamePassword(
                        credentialsId: 'docker-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin ${DOCKER_REGISTRY}"
                        sh "docker push ${DOCKER_REGISTRY}/${APP_NAME}:${env.BUILD_ID}"
                    }
                }
            }
        }

        stage('Deploy to Production') {
            steps {
                sshagent(['production-server-credentials']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no user@production-server << EOF
                        docker pull ${DOCKER_REGISTRY}/${APP_NAME}:${env.BUILD_ID}
                        docker stop ${APP_NAME} || true
                        docker rm ${APP_NAME} || true
                        docker run -d \\
                            -p 5000:5000 \\
                            --name ${APP_NAME} \\
                            --restart unless-stopped \\
                            -v /etc/secrets/mongodb-uri:/run/secrets/mongodb-uri:ro \\
                            ${DOCKER_REGISTRY}/${APP_NAME}:${env.BUILD_ID}
                        EOF
                    """
                }
            }
        }
    }

    post {
        always {
            // Cleanup credentials
            sh 'docker logout'
            // Optional: Clean up Docker images
            sh 'docker system prune -f'
        }
    }
}
