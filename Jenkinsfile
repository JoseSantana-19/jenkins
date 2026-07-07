pipeline {
    agent any

    stages {
        stage('Construir Imagen Docker') {
            steps {
                script {
                    docker.image('docker:27-cli').inside('-v /var/run/docker.sock:/var/run/docker.sock') {
                        sh 'docker build -t hola-mundo-node:latest .'
                    }
                }
            }
        }

        stage('Ejecutar Contenedor Node.js') {
            steps {
                script {
                    docker.image('docker:27-cli').inside('-v /var/run/docker.sock:/var/run/docker.sock') {
                        sh '''
                            # Detener y eliminar cualquier contenedor previo
                            docker stop hola-mundo-node || true
                            docker rm hola-mundo-node || true

                            # Ejecutar el contenedor de la aplicación
                            docker run -d --name hola-mundo-node -p 3000:3000 hola-mundo-node:latest
                        '''
                    }
                }
            }
        }
    }
}