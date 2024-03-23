import type { Metadata } from 'next';
import {
  Expletus_Sans,
  Noto_Sans_Mono,
  Poppins,
  Sanchez,
} from 'next/font/google';
import './globals.css';
import clsx from 'clsx';

const expletus = Expletus_Sans({
  weight: '500',
  subsets: ['latin'],
  variable: '--font-headline',
});
const sanchez = Sanchez({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-chord',
});
const poppins = Poppins({
  weight: ['100', '400'],
  subsets: ['latin'],
  variable: '--font-body',
});
const noto = Noto_Sans_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-monospace',
});

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
      <body
        className={clsx(
          expletus.variable,
          sanchez.variable,
          noto.variable,
          poppins.variable
        )}>
        <header>
          <div className="wrapper">
            <h1>Chords</h1>
          </div>
        </header>
        <main className="wrapper">{children}</main>
        <footer>
          <div className="wrapper">&copy; {new Date().getFullYear()}</div>
        </footer>
      </body>
    </html>
  );
}
