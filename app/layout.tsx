export const metadata = { title: "Vercel cron monitoring example" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui", maxWidth: 640, margin: "3rem auto", padding: "0 1rem" }}>
        {children}
      </body>
    </html>
  );
}
