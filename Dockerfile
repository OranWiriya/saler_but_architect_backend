# Dockerfile
FROM oven/bun:1.1.13
WORKDIR /app
COPY . .
RUN bun install
RUN bun run build
EXPOSE 8080
CMD ["bun", "run", "dist/server.js"]
