import { Song } from '@/types';
import { AddChord } from './AddChord';
import { SongProvider } from './providers/SongProvider';
import { PartsView } from './PartsView';
import styles from './SongView.module.css';
import { ArrangementView } from './ArrangementView';
import { AddPart } from './AddPart';
import { Display } from './Display';
import clsx from 'clsx';

type SongViewProps = {
  song: Song;
};

export const SongView = ({ song }: SongViewProps) => {
  const { title, artist } = song;
  console.log('Song uid:', song.uid);
  return (
    <SongProvider initialSong={song}>
      <div className={styles.SongView}>
        <div className={styles.songHeader}>
          <p>{artist}</p>
          <h2>{title}</h2>
        </div>

        {/* <Display /> */}
        <div className={clsx('print-hidden', styles.chordsAdder)}>
          <p>Add chords</p>
          <AddChord />
          <AddPart />
        </div>

        <PartsView />
        <ArrangementView className={styles.ArrangementView} />
      </div>
    </SongProvider>
  );
};
