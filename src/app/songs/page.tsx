import { NewSongForm } from '@/components/forms/NewSongForm';
import { SongsList, SongsListSkeleton } from '@/components/SongsList';
import { PageContainer } from '@/components/layout/PageContainer';
import { Suspense } from 'react';
import { Header } from '@/components/Header';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function SongsPage() {
  const session = await auth();
  if (!session) {
    redirect('/');
  }
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
