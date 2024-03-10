'use client';

import { useEffect, useRef } from 'react';
import { useSong } from './SongProvider';
import { updateSong } from '@/actions/song';

export const SongSaver = () => {
  return null;
  const { uid, slug, title, parts } = useSong();
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      updateSong({ uid, slug, title, parts });
    }, 3000);
  }, [uid, slug, title, parts]);
  return null;
};
