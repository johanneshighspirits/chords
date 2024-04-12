import { auth, signIn } from '@/auth';
import { SignOut } from './SignOut';
import styles from './SignIn.module.css';

export const SignIn = async () => {
  const session = await auth();
  if (session?.user?.name) {
    return (
      <div className={styles.LoginMenu}>
        <span>{session.user.name}</span>
        <SignOut />
      </div>
    );
  }
  return (
    <form
      action={async () => {
        'use server';
        await signIn('google', { redirectTo: '/songs' });
      }}>
      <button type="submit">Login</button>
    </form>
  );
};
