import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'My Task Manager App',
  description: 'A simple task manager app built with Next.js and the phase 1 REST API.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📋</text></svg>" />
      </head>
      <body>{children}</body>
    </html>
  );
}
