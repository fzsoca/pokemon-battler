
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npx prisma generate

COPY . .

EXPOSE 3000
EXPOSE 5432

ENV PGHOST=db
ENV PGUSER=postgres
ENV PGPASSWORD=secret
ENV PGDATABASE=pokemon
ENV PGPORT=5432

RUN apk add --no-cache postgresql-client

# Start the Next.js application
CMD ["npm", "run", "dev:migrate:start"]
