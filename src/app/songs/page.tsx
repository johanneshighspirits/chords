import { NewSongForm } from '@/components/forms/NewSongForm';
import { SongsList } from '@/components/SongsList';
import { PageContainer } from '@/components/layout/PageContainer';
import { Suspense } from 'react';

export default async function SongsPage() {
  return (
    <PageContainer>
      <NewSongForm />
      <Suspense>
        <SongsList />
      </Suspense>
    </PageContainer>
  );
}
