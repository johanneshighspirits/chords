import Link from 'next/link';
import styles from './SongsList.module.css';
import { DeleteSongButton } from './forms/DeleteButton';
import { querySongsMeta } from '@/db/actions';
import { SkeletonContainer, SkeletonText } from './skeleton/SkeletonText';

export const SongsList = async () => {
  const songs = await querySongsMeta();
  return (
    <ul className={styles.SongsList}>
      {songs.map((song) => {
        const { title, slug, uid } = song;
        return (
          <li key={song.uid} className={styles.song}>
            <Link href={`/song/${slug}`}>{title}</Link>
            <DeleteSongButton title={title} songId={uid}>
              X
            </DeleteSongButton>
          </li>
        );
      })}
    </ul>
  );
};

export const SongsListSkeleton = () => (
  <ul className={styles.SongsList}>
    {Array.from({ length: 3 }).map((_, i) => {
      return (
        <SkeletonContainer key={i} className={styles.song}>
          <SkeletonText />
        </SkeletonContainer>
      );
    })}
  </ul>
);
