# Grafi Creative Ops

Full custom studio ops app for **Grafi Creative Design** — case study for Grafi Solutions.

## Modules
- **Dashboard** — open jobs, revenue snapshot, recent orders
- **Orders** — Inquiry → Quoted → … → Done
- **Quotes** — editable price bands
- **Customers** — client log (IG handle as key)

## Run

```bash
cd grafi-creative-ops
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Data file: `data/store.json` (created on first run).

## First 30 seconds
1. Orders → delete sample `GC-0001`
2. Log the next Instagram DM
3. Check Quotes before you reply

## Railway deploy

Persistent store uses `DATA_DIR` (default `./data`). On Railway mount a volume at `/data` and set `DATA_DIR=/data`.

### Required environment variables
- `GRAFI_STUDIO_PASSWORD` — studio gate password (required)
- `DATA_DIR=/data` — volume mount path for `store.json`
- `NODE_ENV=production`

### Volume
Mount a Railway volume at `/data` so `store.json` survives redeploys.

### Build
This project uses Next.js `output: "standalone"` and a `Dockerfile` (see `railway.toml`).

```bash
npm ci
npm run build
```

### CLI deploy (if logged in)
```bash
railway login   # browser once
railway init
railway variables set GRAFI_STUDIO_PASSWORD=... DATA_DIR=/data NODE_ENV=production
# add volume /data in Railway dashboard (Volumes)
railway up
railway domain
```

### Browser deploy (no CLI login)
1. Open https://railway.app/new
2. Deploy from GitHub repo or empty project + local upload / Dockerfile
3. Set variables above; add volume mount `/data`
4. Generate a public domain; open URL — should redirect to `/login`
