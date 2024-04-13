import { auth } from '@/auth';
import Link from 'next/link';
import { SignIn } from './SignIn';
import styles from './Welcome.module.css';

export const Welcome = async () => {
  const session = await auth();
  if (!session) {
    return (
      <div className={styles.Welcome}>
        <h2>Hello music lovers!</h2>
        <SignIn />
      </div>
    );
  }
  return <Link href={'/songs'}>Open songs</Link>;
};
