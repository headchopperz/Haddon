FROM docker.tiw.io/docker-static-site:latest

ENV INDEXFILE=/Main/index.html

COPY html /var/www/html
