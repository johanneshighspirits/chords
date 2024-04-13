import Link from 'next/link';
import styles from './SongsList.module.css';
import { DeleteSongButton } from './forms/DeleteButton';
import { querySongsMeta } from '@/db/actions';
import { SkeletonContainer, SkeletonText } from './skeleton/SkeletonText';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const SongsList = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    console.log(`SongsList no session`, session);
    redirect('/');
  }
  console.log('SongsList', session);
  const songs = await querySongsMeta(session.user.id);
  return (
    <ul className={styles.SongsList}>
      {songs.map((song) => {
        const { uid, title, slug, artist, artistSlug } = song;
        return (
          <li key={song.uid} className={styles.song}>
            <Link href={`/songs/${artistSlug}/${slug}`}>
              <span className={styles.artist}>{artist}</span> - {title}
            </Link>
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
