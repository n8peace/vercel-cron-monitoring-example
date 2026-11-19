export default function Home() {
  return (
    <main>
      <h1>Vercel cron monitoring example</h1>
      <p>
        One scheduled route at <code>/api/cron/nightly</code>. Each run checks in, so a missed or
        failed run gets noticed.
      </p>
    </main>
  );
}
