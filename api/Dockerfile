FROM node:12
WORKDIR /code
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=8000
EXPOSE 8000
CMD ["npm", "start"]

