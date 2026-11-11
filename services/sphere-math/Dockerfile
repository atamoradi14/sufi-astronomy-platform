FROM node:22-alpine
WORKDIR /app
EXPOSE 8082
CMD ["node", "-e", "require('http').createServer((_,r)=>r.end('sphere-math stub')).listen(8082)"]
