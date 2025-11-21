FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm install -g http-server
EXPOSE 5173
CMD ["http-server", "dist", "-p", "5173", "--cors"]
