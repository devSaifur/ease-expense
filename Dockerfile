FROM oven/bun:1 as base
WORKDIR /app

COPY . .

RUN bun install 
RUN bun run install:client 

RUN bun run build:client

EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "start" ]