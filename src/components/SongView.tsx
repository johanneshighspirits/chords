import { Song } from '@/types';
import { SongProvider } from './providers/SongProvider';
import { PartsView } from './PartsView';
import styles from './SongView.module.css';
import { ArrangementView } from './ArrangementView';
import { ChordsAdder } from './ChordsAdder';
import { Container } from './layout/PageContainer';
import { AudioProvider } from './providers/AudioProvider';

type SongViewProps = {
  song: Song;
};

export const SongView = ({ song }: SongViewProps) => {
  const { title, artist } = song;

  return (
    <SongProvider initialSong={song}>
      <Container>
        <div className={styles.songHeader}>
          <p>{artist}</p>
          <h2>{title}</h2>
        </div>
      </Container>

      <AudioProvider>
        <ChordsAdder />
      </AudioProvider>

      <Container>
        <div className={styles.SongView}>
          <PartsView />
          <ArrangementView className={styles.ArrangementView} />
        </div>
      </Container>
    </SongProvider>
  );
};
