import { Header } from '@/components/Header';
import { Center } from '@/components/layout/Center';
import { Container } from '@/components/layout/PageContainer';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Header />
      <Center>
        <Link href={'/songs'}>Open songs</Link>
      </Center>
      <footer>
        <Container>&copy; {new Date().getFullYear()}</Container>
      </footer>
    </>
  );
}
