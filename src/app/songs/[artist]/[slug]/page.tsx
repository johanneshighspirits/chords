import { SongView } from '@/components/SongView';
import { querySong } from '@/db/actions';

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
  return <SongView song={song} />;
}
