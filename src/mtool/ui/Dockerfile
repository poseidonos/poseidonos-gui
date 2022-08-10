FROM nginx:1.21.6-alpine
LABEL org.opencontainers.image.source https://github.com/poseidonos/poseidonos-gui

RUN rm /etc/nginx/conf.d/*

COPY virtual.conf /etc/nginx/conf.d/default.conf

COPY public/ /etc/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
