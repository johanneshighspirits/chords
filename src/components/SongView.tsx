import { Song } from '@/types';
import { AddChord } from './AddChord';
import { SongProvider } from './providers/SongProvider';
import { PartsView } from './PartsView';
import styles from './song.module.css';
import { ArrangementView } from './ArrangementView';

type SongViewProps = {
  song: Song;
};

export const SongView = ({ song }: SongViewProps) => {
  const { title } = song;
  return (
    <SongProvider initialSong={song}>
      <div className={styles.songView}>
        <div className={styles.songHeader}>
          <h1>{title}</h1>
        </div>

        <div className={styles.chordsAdder}>
          <p>Add chords</p>
          <AddChord />
        </div>

        <PartsView />
        <ArrangementView />
      </div>
    </SongProvider>
  );
};
