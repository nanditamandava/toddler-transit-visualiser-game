import type { Metadata } from 'next';
import { Sora, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { GameStateProvider } from '../hooks/useGameState';

const sora = Sora({
  variable: '--font-sora',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Jealous Husbands River Crossing CSP Visualizer',
  description:
    'An interactive, high-fidelity algorithmic visualizer for the classic Jealous Husbands Constraint Satisfaction Problem (CSP) built with Next.js, React Hooks, and Tailwind CSS.',
  keywords: [
    'Jealous Husbands',
    'River Crossing Problem',
    'Constraint Satisfaction Problem',
    'CSP Solver',
    'Graph Traversal',
    'BFS Solver',
    'Algorithm Visualizer',
  ],
  authors: [{ name: 'Antigravity systems team' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${ibmPlexMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0F1117] text-[#F8FAFC]">
        <GameStateProvider>{children}</GameStateProvider>
      </body>
    </html>
  );
}
