FROM nginx:1.21.6-alpine

RUN rm /etc/nginx/conf.d/*

COPY virtual.conf /etc/nginx/conf.d/default.conf

COPY public/ /etc/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
