import { auth, signOut } from '@/auth';

export const SignOut = async () => {
  const session = await auth();
  if (!session) {
    return null;
  }
  return (
    <form
      action={async () => {
        'use server';
        await signOut({
          redirectTo: '/',
        });
      }}>
      <button title={session.user?.name ?? ''} type="submit">
        Logout
      </button>
    </form>
  );
};
