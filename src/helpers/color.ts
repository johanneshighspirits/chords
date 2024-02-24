import { Color } from '@/types';

export const getRandomColor = (): Color => ({
  h: Math.round(Math.random() * 360),
  s: 10 + Math.round(Math.random() * 30),
  l: 40 + Math.round(Math.random() * 20),
});
