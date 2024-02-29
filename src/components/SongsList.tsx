import Link from 'next/link';
import styles from './SongsList.module.css';
import { DeleteButton } from './forms/DeleteButton';
import { getSongs } from '@/actions/song';

export const SongsList = async () => {
  const songs = await getSongs().then((d) => {
    if (!d.success) {
      throw d.error;
    }
    return d.data;
  });

  return (
    <ul className={styles.SongsList}>
      {songs.map((song) => {
        const { title, slug } = song;
        return (
          <li key={song.id} className={styles.song}>
            <Link href={`/song/${slug}`}>{title}</Link>
            <DeleteButton title={title} slug={slug}>
              X
            </DeleteButton>
          </li>
        );
      })}
    </ul>
  );
};
