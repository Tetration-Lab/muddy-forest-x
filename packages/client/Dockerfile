FROM nginx:1.13.12-alpine

COPY ./nginx/nginx.conf /etc/nginx/
COPY ./dist/ /usr/share/nginx/html/

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
