Railway deployment guide for LokaStay backend

Prerequisites
- Repo pushed to GitHub (you already pushed `Dockerfile` + `Procfile`).
- Railway account with access to the GitHub repo.

Deploy via Railway (recommended)

1. Connect repository
- In Railway dashboard: New Project → Deploy from GitHub → choose `prinkaachz/LokaStay-BackEnd-FP-PPB-2026`.

2. Choose deployment method
- Docker: select "Deploy from Dockerfile" so Railway builds the image using `Dockerfile`.
- Or Node build: set Build Command to:

```
npm ci && npx prisma generate && npm run build
```

Start Command (if not using Docker):

```
npm run start:prod
```

3. Add Environment Variables (Project → Settings → Variables)
- `DATABASE_URL` = postgres://... (Railway Postgres or external DB)
- `JWT_SECRET` = a long random string
- `PORT` = 3000 (optional)

4. Run migrations and seed (once after deploy)
- Open Railway Console / Run command and execute:

```
npx prisma migrate deploy
npm run seed
```

Notes & Troubleshooting
- Prisma client generation: if build fails with prisma client missing, ensure `npx prisma generate` runs during build (see Build Command above), or add a `postinstall` script in `package.json`:

```
"postinstall": "npx prisma generate"
```

- If DB is unreachable, verify `DATABASE_URL` and network/allowlist settings.
- Check Railway logs for runtime errors (missing env, permission issues, migration errors).

Railway CLI quick commands (optional)

```
npm install -g railway
railway login
railway init      # link to project
railway up        # deploy
railway run -- npx prisma migrate deploy
railway run -- npm run seed
```

If you want, I can:
- create a PR with this guide added to `DEPLOY_RAILWAY.md`, or
- help run the Railway CLI steps interactively (you'll need to run auth locally).