## Development

1. Start the docker container for the postgres database.

```sh
docker compose up
```

> [!NOTE]  
> Change the credentials in [docker-compose.yaml](docker-compose.yaml) before deploying.

2. When the containers start, rename the `.env.example` files to `.env` in [apps/server/.env.example](apps/server/.env.example) and fill in the blank values

3. Install the dependencies and run migrations

```sh
npm install
npm run migrate
```

4. Start the development server

```sh
npm run dev
```
