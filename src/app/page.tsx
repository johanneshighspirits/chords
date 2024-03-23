import { Center } from '@/components/layout/Center';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="wrapper">
      <Center>
        <Link href={'/songs'}>Open songs</Link>
      </Center>
    </div>
  );
}
