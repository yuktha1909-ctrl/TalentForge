import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AntdProvider from '@/components/providers/AntdProvider';
import { AuthProvider } from '@/context/AuthContext';
import AppShell from '@/components/layout/AppShell';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Talent Forge — AI-Powered Talent Acquisition Platform',
  description:
    'Autonomous AI recruiter agents, multi-dimensional candidate screening, and role-based talent management pipelines.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full font-sans antialiased bg-slate-50 text-slate-900">
        <AuthProvider>
          <AntdProvider>
            <AppShell>{children}</AppShell>
          </AntdProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
