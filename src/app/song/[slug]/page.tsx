import { SongView } from '@/components/SongView';
import { querySong } from '@/db/actions';

type SongPageProps = {
  params: {
    slug: string;
  };
};

export default async function SongPage({ params: { slug } }: SongPageProps) {
  const song = await querySong(slug);
  return <SongView song={song} />;
}
