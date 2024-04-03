import type { Metadata } from 'next';
import {
  Expletus_Sans,
  Noto_Sans_Mono,
  Poppins,
  Sanchez,
} from 'next/font/google';
import './globals.css';
import './print.css';
import clsx from 'clsx';
import { Header } from '@/components/Header';
import { DBProvider } from '@/components/providers/DBProvider';

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
  subsets: ['latin-ext'],
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
        <DBProvider>
          <main>{children}</main>
        </DBProvider>
      </body>
    </html>
  );
}
