import { getSong } from '@/actions/song';
import { SongView } from '@/components/SongView';

type SongPageProps = {
  params: {
    slug: string;
  };
};

export default async function SongPage({ params: { slug } }: SongPageProps) {
  const song = await getSong(slug);
  return <SongView song={song} />;
}
