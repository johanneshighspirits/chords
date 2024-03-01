'use client';

import { useEffect, useRef } from 'react';
import { useSong } from './SongProvider';
import { updateSong } from '@/actions/song';

export const SongSaver = () => {
  const { id, slug, title, parts } = useSong();
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      updateSong({ id, slug, title, parts });
    }, 3000);
  }, [id, slug, title, parts]);
  return null;
};
