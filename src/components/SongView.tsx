import { Song } from '@/types';
import { AddChord } from './AddChord';
import { SongProvider } from './providers/SongProvider';
import { PartsView } from './PartsView';

type SongViewProps = {
  song: Song;
};

export const SongView = ({ song }: SongViewProps) => {
  const { title } = song;
  return (
    <SongProvider>
      <h1>{title}</h1>

      <p>Add chords</p>
      <AddChord />

      <PartsView />
    </SongProvider>
  );
};
