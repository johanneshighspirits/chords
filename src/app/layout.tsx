import type { Metadata } from 'next';
import { Sanchez } from 'next/font/google';
import './globals.css';

const sanchez = Sanchez({ weight: '400', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Chords',
  description: 'Chords',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={sanchez.className}>
        <header>
          <div className="wrapper">Chords</div>
        </header>
        <main className="wrapper">{children}</main>
        <footer>
          <div className="wrapper">&copy; 2024</div>
        </footer>
      </body>
    </html>
  );
}
