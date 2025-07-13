FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
# DON'T copy site files if you're using volumes
# COPY . /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
