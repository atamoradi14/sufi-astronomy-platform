FROM node:22-alpine
WORKDIR /app
EXPOSE 8083
CMD ["node", "-e", "require('http').createServer((_,r)=>r.end('qibla stub')).listen(8083)"]
