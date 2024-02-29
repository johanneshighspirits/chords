import { createSong } from '@/actions/song';
import styles from './NewSongForm.module.css';
import { SubmitButton } from './SubmitButton';

export const NewSongForm = () => {
  return (
    <form action={createSong} className={styles.form}>
      <input
        type="text"
        name="title"
        required
        placeholder="New Song Title"></input>
      <SubmitButton>Create new song</SubmitButton>
    </form>
  );
};
