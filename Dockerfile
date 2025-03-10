FROM node:22.14.0 AS development
WORKDIR /readmefy-api
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
