import './globals.css';
import Navbar from '@/components/Navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ToDo App',
  description: 'Simple MERN ToDo Application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        {/* ✅ Navbar must be inside body */}
        <Navbar />
        <main className="max-w-3xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
