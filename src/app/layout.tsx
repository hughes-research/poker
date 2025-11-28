import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '5-Card Stud Poker',
  description: 'Play 5-card stud poker',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

