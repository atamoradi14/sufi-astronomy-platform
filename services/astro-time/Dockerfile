# Placeholder image — replace CMD with a slim Node/Go binary when extracted.
FROM node:22-alpine
WORKDIR /app
COPY package.json ./
RUN echo '{"name":"astro-time","private":true}' > package.json
EXPOSE 8081
CMD ["node", "-e", "require('http').createServer((_,r)=>r.end('astro-time stub')).listen(8081)"]
