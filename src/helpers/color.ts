import { Color } from '@/types';

export const getRandomColor = (): Color => ({
  h: Math.round(Math.random() * 360),
  s: 10 + Math.round(Math.random() * 30),
  l: 40 + Math.round(Math.random() * 20),
  a: 1,
});

export const serializeColor = (color?: Color) => {
  if (!color) {
    return '0:0:0:1';
  }
  const { h, s, l, a } = color;
  return [h, s, l, a].join(':');
};

export const deserializeColor = (data: string | null) => {
  if (data === null) {
    return {
      h: 0,
      s: 0,
      l: 0,
      a: 1,
    };
  }
  const [h, s, l, a] = data.split(':').map(parseFloat);
  return { h, s, l, a };
};
