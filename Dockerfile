FROM node:18-alpine

WORKDIR /app
#force reuild
# Copy package files first — this layer is cached until package.json changes
COPY package*.json ./
RUN npm install

# Copy source after deps so code changes don't invalidate the install cache
COPY . .

EXPOSE 3000

CMD ["node", "src/app.js"]
