import Link from 'next/link';

export default function Home() {
  return (
    <div className="wrapper">
      <Link href={'/songs'}>Open songs</Link>
    </div>
  );
}
