import { withCheckin } from "spooky-checkin";

// The real work. It only runs for callers that passed the secret check below.
const run = withCheckin(async () => {
  // Your real work goes here.
  const processed = 12;
  return Response.json({ done: true, processed });
});

// Vercel sends "Authorization: Bearer <CRON_SECRET>" when the CRON_SECRET
// environment variable is set on the project. Refuse every other caller
// before anything is checked in, so a stranger cannot fake a failed run.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  return run(req);
}
