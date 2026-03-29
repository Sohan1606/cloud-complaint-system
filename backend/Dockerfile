FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate
# RUN npx prisma db push (done in docker-compose command)

EXPOSE 5000

CMD ["npm", "start"]
