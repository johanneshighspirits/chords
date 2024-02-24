import { Chord } from '@/types';

export const parseChord = (input: string): Chord | null => {
  const display = input.trim();
  if (!display) {
    return null;
  }
  const id = crypto.randomUUID().substring(0, 8);
  return {
    id,
    display,
  };
};
