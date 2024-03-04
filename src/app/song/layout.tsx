import { PageContainer } from '@/components/layout/PageContainer';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

export default async function SongLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Link
        style={{ display: 'block', marginBottom: '1rem', color: '#777' }}
        href="/songs">
        &laquo; Songs
      </Link>
      <PageContainer>{children}</PageContainer>
    </>
  );
}
