import type { Metadata } from 'next';
import { Sanchez } from 'next/font/google';
import './globals.css';

const sanchez = Sanchez({ weight: '400', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Chords',
  description: 'Chords',
};

const testVar = process.env.MY_TEST;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={sanchez.className}>
        <header>
          <div className="wrapper">
            Chords <i>{testVar}</i>
          </div>
        </header>
        <main className="wrapper">{children}</main>
        <footer>
          <div className="wrapper">&copy; 2024</div>
        </footer>
      </body>
    </html>
  );
}
