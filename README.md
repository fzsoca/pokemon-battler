Pokemon battler

Made with nextjs + prisma + postgresql

How to run:

You're gonna need a node runtime and a postgresql database. You can run them separately in your system, or you can run `docker compose up` in the project root directory to create the required components in docker.

To generate the prisma schema, run:

`npx prisma generate`

To create the initial schema, locally we can run

`npx prisma db push`

You can also run `prisma migrate dev --name init`, also works, and for production, this is what we would use, but for local development, `db push` is enough

After this, the application should run on port 3000 on localhost. To initialize the pokemon from the pokemon API, call the `/api/sync` endpoint (GET).
