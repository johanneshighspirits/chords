import { getSong } from '@/actions/song';
import { SongView } from '@/components/SongView';
import { PageContainer } from '@/components/layout/PageContainer';

type SongPageProps = {
  params: {
    slug: string;
  };
};

export default async function SongPage({ params: { slug } }: SongPageProps) {
  const song = await getSong(slug);
  return (
    <PageContainer>
      <SongView song={song} />;
    </PageContainer>
  );
}
