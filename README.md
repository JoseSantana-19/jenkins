# Jenkins Demo Project

Proyecto de ejemplo para desplegar Jenkins con Docker y usarlo como base de integración continua.

## Requisitos

- Docker
- Node.js 18 o superior

## Ejecución local

```bash
npm install
npm start
```

## Jenkins

Para levantar Jenkins con persistencia local:

```bash
docker pull jenkins/jenkins:lts
docker volume create jenkins_home
docker run -d --name jenkins -p 8080:8080 -p 50000:50000 --user root -v /var/run/docker.sock:/var/run/docker.sock -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts
```
