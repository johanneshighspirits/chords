import { Header } from '@/components/Header';
import { Welcome } from '@/components/auth/Welcome';
import { Center } from '@/components/layout/Center';
import { Container } from '@/components/layout/PageContainer';
import { Suspense } from 'react';

export default function Home() {
  return (
    <>
      <Header />
      <Center>
        <Suspense fallback={<div>...</div>}>
          <Welcome />
        </Suspense>
      </Center>
      <footer>
        <Container>&copy; {new Date().getFullYear()}</Container>
      </footer>
    </>
  );
}
