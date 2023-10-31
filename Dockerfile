##DockerFile
#Pulling node image from dockerhub
FROM node:16
# Create app directory
WORKDIR /app
# Copy code from root repo to the working directory
COPY . .
#Run node commands to build and serve the application
RUN \
  npm install && \
  npm install gulp -g && \
  npm install swagger -g && \
  gulp clean && \
  gulp tsc
CMD [ “node”, “server.js” ]
EXPOSE 3000
