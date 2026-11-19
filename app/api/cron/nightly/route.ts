import { withCheckin } from "spooky-checkin";

// Vercel sends "Authorization: Bearer <CRON_SECRET>" when the CRON_SECRET
// environment variable is set on the project. Refuse every other caller.
export const GET = withCheckin(async (req: Request) => {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Your real work goes here.
  const processed = 12;

  return Response.json({ done: true, processed });
});
