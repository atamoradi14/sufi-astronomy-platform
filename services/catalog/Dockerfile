FROM node:22-alpine
WORKDIR /app
EXPOSE 8084
CMD ["node", "-e", "require('http').createServer((_,r)=>r.end('catalog stub')).listen(8084)"]
