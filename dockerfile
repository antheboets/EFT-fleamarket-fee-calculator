FROM node:16.15.0-alpine as Build
RUN apk -U upgrade
#RUN apk add --no-cache --upgrade bash
WORKDIR /app
COPY ./fleamarketcal /app/
RUN npm install npm@latest -g
RUN npm update -g
RUN npm install --silent
#RUN npx browserslist@latest --update-db 
RUN npm run build

FROM nginx:1.21.6-alpine
RUN apk -U upgrade
#RUN apk add --no-cache --upgrade bash
#COPY . /usr/share/nginx/html
COPY --from=build /app/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
#COPY nginx/nginx.conf /etc/nginx/conf.d
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]