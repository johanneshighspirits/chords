import { NewSongForm } from '@/components/forms/NewSongForm';
import { SongsList, SongsListSkeleton } from '@/components/SongsList';
import { PageContainer } from '@/components/layout/PageContainer';
import { Suspense } from 'react';

export default async function SongsPage() {
  return (
    <PageContainer>
      <NewSongForm />
      <Suspense fallback={<SongsListSkeleton></SongsListSkeleton>}>
        <SongsList />
      </Suspense>
    </PageContainer>
  );
}
