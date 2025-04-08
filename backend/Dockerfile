FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

# For TypeScript, if needed:
# RUN npm run build

EXPOSE 5000

# Use a non-root user for better security
USER node

CMD ["npm", "start"]