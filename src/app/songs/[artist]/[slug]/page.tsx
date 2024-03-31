import { SongView } from '@/components/SongView';
import { Container } from '@/components/layout/PageContainer';
import { querySong } from '@/db/actions';
import Link from 'next/link';

type SongPageProps = {
  params: {
    artist: string;
    slug: string;
  };
};

export default async function SongPage({
  params: { artist, slug },
}: SongPageProps) {
  const song = await querySong({ artistSlug: artist, slug });
  return (
    <>
      <Container>
        <Link
          style={{
            display: 'block',
            margin: '1rem auto 1rem 0',
            color: '#777',
          }}
          href="/songs">
          &laquo; Songs
        </Link>
      </Container>
      <SongView song={song} />;
    </>
  );
}
