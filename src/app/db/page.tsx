import { Debug } from '@/components/debug/Debug';
import { db } from '@/db';
import { songs } from '@/db/schema';

export default async function DBPage() {
  const result = await db.select().from(songs);
  return (
    <div>
      <Debug toJson={result}></Debug>
    </div>
  );
}
