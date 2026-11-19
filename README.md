# Vercel cron monitoring example (Next.js)

How to find out when a Vercel cron job fails or never runs. A small Next.js app with one scheduled route that checks in after each run. If a run is late or fails, you get an alert, and your coding agent (Claude Code or Codex) can read the cause.

A Vercel cron job that stops running gives no error. Nothing calls your route, so nothing fails loudly. The fix is to have the job report in, and to be told when the report does not arrive.

## What is in here

| File | What it does |
|---|---|
| `vercel.json` | Runs `/api/cron/nightly` every day at 07:00 UTC. |
| `app/api/cron/nightly/route.ts` | The cron route. Refuses callers without `CRON_SECRET` first, then runs the work wrapped in `withCheckin`. |
| `package.json` | Next.js plus [`spooky-checkin`](https://www.npmjs.com/package/spooky-checkin), one file with no dependencies. |

## Quick start

```bash
git clone https://github.com/n8peace/vercel-cron-monitoring-example
cd vercel-cron-monitoring-example
npm install
CRON_SECRET=test-secret npm run dev
```

In a second terminal:

```bash
# Refused: no secret
curl -i localhost:3000/api/cron/nightly

# Accepted: Vercel sends this header on real runs
curl -i -H "Authorization: Bearer test-secret" localhost:3000/api/cron/nightly
```

The first call answers 401. The second answers `{"done":true,"processed":12}`. Locally nothing is sent anywhere, because no check-in link is set.

## Deploy it and watch it

1. Deploy to Vercel. In the project's Environment Variables add `CRON_SECRET` (any long random string). Vercel then sends it with each cron call.
2. Make a check-in link for the job at [Spooky Particles](https://spookyparticles.com/automate-fixes?ct=example-vercel-cron-monitoring) and tell it how often the job runs.
3. Add the link as `SPOOKY_PING_URL` in the same Environment Variables page, for Production. Treat it like a password: anyone who has it can say your job ran. Keep it out of code and logs.
4. Redeploy. After the first scheduled run the job shows as up.

Each run checks in ok when the route answers 2xx or 3xx, and fail when it throws or answers 4xx or 5xx. Your route's own answer and errors pass through unchanged. If the check-in service cannot be reached, the job still runs as normal.

## Use it for a job that is not a Vercel route

```ts
import { checkin } from "spooky-checkin";

await checkin("start");
try {
  await doTheWork();
  await checkin("ok", { count: 12 });
} catch (error) {
  await checkin("fail", { note: "import step failed" });
  throw error;
}
```

From a shell script or GitHub Actions step: `curl -fsS -m 10 --retry 3 "$SPOOKY_PING_URL"`.

## Let your coding agent do the setup

Paste this into Claude Code or Codex in your own Vercel project:

> Read https://spookyparticles.com/setup.md and set up Spooky Particles for my Vercel project. Add a check-in to every cron route. Open a pull request. Do not print or commit any key.

## License

MIT
