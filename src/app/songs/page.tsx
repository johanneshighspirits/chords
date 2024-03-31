import { NewSongForm } from '@/components/forms/NewSongForm';
import { SongsList, SongsListSkeleton } from '@/components/SongsList';
import { PageContainer } from '@/components/layout/PageContainer';
import { Suspense } from 'react';
import { Header } from '@/components/Header';
import Link from 'next/link';

export default async function SongsPage() {
  return (
    <>
      <Header />
      <PageContainer>
        <NewSongForm />
        <Suspense fallback={<SongsListSkeleton></SongsListSkeleton>}>
          <SongsList />
        </Suspense>
      </PageContainer>
    </>
  );
}
