This is a [Next.js](https://nextjs.org) project bootstrapped with [
`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically
optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions
are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use
the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for
more details.

## Server deployment via rsync/Node.js

This project includes a deploy script that builds the app with standalone output, syncs it to a remote server via rsync,
and starts it with Node.js.

Steps:

- Copy .deployment.env.example to .deployment.env and fill in your server details.
- Run: npm run deploy

The script will:

- Build the app locally.
- rsync the standalone bundle, static assets, and public/ to the remote DEPLOY_TARGET_DIR.
- Restart the app remotely using nohup (PID and logs in DEPLOY_TARGET_DIR).

## Run as an OpenRC service on Alpine Linux

This repo provides an OpenRC service definition to run a Node.js server at /srv/server.js.

Files:

- openrc/ivbeck-node: init script (to install into /etc/init.d/ivbeck-node)
- openrc/ivbeck-node.confd: example config (to install into /etc/conf.d/ivbeck-node)

Install on Alpine (as root):

1) Install deps

```bash
   apk add nodejs npm openrc # (if not already installed)
```

2) Add node user

```bash
  adduser node   
```

3) Install the service files:

```bash
   cp openrc/ivbeck-node /etc/init.d/ivbeck-node && chmod +x /etc/init.d/ivbeck-node
   cp openrc/ivbeck-node.confd /etc/conf.d/ivbeck-node
```

4) Ensure your app entrypoint exists at `/srv/server.js` (or edit `/etc/conf.d/ivbeck-node` to point `APP_PATH`
   elsewhere) and that the `RUN_AS` user can read/execute it.
5) Optionally tweak /etc/conf.d/ivbeck-node (`NODE_ENV`, `PORT`, `LOGFILE`, `RUN_AS`, etc.).
6) Add the service and start it:

```bash
   rc-update add ivbeck-node default
   rc-service ivbeck-node start
```

Logs will be written to `/var/log/ivbeck-node.log` by default. The service runs under supervise-daemon with optional
respawn (configure in /etc/conf.d/ivbeck-node).
