import { Song } from '@/types';
import { AddChord } from './AddChord';
import { SongProvider } from './providers/SongProvider';
import { PartsView } from './PartsView';
import styles from './song.module.css';
import { ArrangementView } from './ArrangementView';
import { AddPart } from './AddPart';

type SongViewProps = {
  song: Song;
};

export const SongView = ({ song }: SongViewProps) => {
  const { title, artist } = song;
  return (
    <SongProvider initialSong={song}>
      <div className={styles.songView}>
        <div className={styles.songHeader}>
          <p>{artist}</p>
          <h1>{title}</h1>
        </div>

        <div className={styles.chordsAdder}>
          <p>Add chords</p>
          <AddChord />
          <AddPart />
        </div>

        <PartsView />
        <ArrangementView />
      </div>
    </SongProvider>
  );
};
