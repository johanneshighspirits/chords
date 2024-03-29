import { Color } from '@/types';
import { CSSProperties } from 'react';

export const getRandomColor = (): Color => ({
  h: Math.round(Math.random() * 360),
  s: 10 + Math.round(Math.random() * 30),
  l: 40 + Math.round(Math.random() * 20),
  a: 1,
});

export const getGradient = (color: Color) => {
  const { h, s, l } = color;
  const secondH = (h + 20) % 360;
  const secondS = Math.round(Math.min(100, s * 1.1));
  const secondL = Math.round(Math.max(0, l * 0.95));
  return `linear-gradient(167deg, hsl(${h} ${s}% ${l}%), hsl(${secondH} ${secondS}% ${secondL}%) 90%)`;
};

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

export const colorToHex = (color: Color, withAlpha = false) => {
  let { h, s, l, a } = color;
  h /= 360;
  s /= 100;
  l /= 100;

  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const x = chroma * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = l - chroma / 2;

  let tempR, tempG, tempB;

  switch (true) {
    case h < 1:
      tempR = 0;
      tempG = chroma;
      tempB = x;
      break;
    case h < 2:
      tempR = 0;
      tempG = x;
      tempB = chroma;
      break;
    case h < 3:
      tempR = x;
      tempG = 0;
      tempB = chroma;
      break;
    case h < 4:
      tempR = chroma;
      tempG = 0;
      tempB = x;
      break;
    case h < 5:
      tempR = chroma;
      tempG = x;
      tempB = 0;
      break;
    default:
      tempR = x;
      tempG = chroma;
      tempB = 0;
      break;
  }

  const r = Math.round((tempR + m) * 255);
  const g = Math.round((tempG + m) * 255);
  const b = Math.round((tempB + m) * 255);

  const hexR = r.toString(16).padStart(2, '0');
  const hexG = g.toString(16).padStart(2, '0');
  const hexB = b.toString(16).padStart(2, '0');

  if (withAlpha) {
    const hexA = Math.round(a * 255)
      .toString(16)
      .padStart(2, '0');
    return `#${hexR}${hexG}${hexB}${hexA}`;
  }
  return `#${hexR}${hexG}${hexB}`;
};

export const colorToRgb = (color: Color, withAlpha = false) => {
  let { h, s, l, a } = color;
  h /= 360;
  s /= 100;
  l /= 100;

  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const x = chroma * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = l - chroma / 2;

  let tempR, tempG, tempB;

  switch (true) {
    case h < 1:
      tempR = 0;
      tempG = chroma;
      tempB = x;
      break;
    case h < 2:
      tempR = 0;
      tempG = x;
      tempB = chroma;
      break;
    case h < 3:
      tempR = x;
      tempG = 0;
      tempB = chroma;
      break;
    case h < 4:
      tempR = chroma;
      tempG = 0;
      tempB = x;
      break;
    case h < 5:
      tempR = chroma;
      tempG = x;
      tempB = 0;
      break;
    default:
      tempR = x;
      tempG = chroma;
      tempB = 0;
      break;
  }

  const r = Math.round((tempR + m) * 255);
  const g = Math.round((tempG + m) * 255);
  const b = Math.round((tempB + m) * 255);

  return { r, g, b, a };
};

export const hexToColor = (hex: string) => {
  if (hex.startsWith('#')) {
    hex = hex.slice(1);
  }

  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l: Math.round(l * 100), a: 1 };
  }

  let h, s;
  const delta = max - min;

  if (l > 0.5) {
    s = delta / (2 - max - min);
  } else {
    s = delta / (max + min);
  }

  switch (max) {
    case r:
      h = (g - b) / delta + (g < b ? 6 : 0);
      break;
    case g:
      h = (b - r) / delta + 2;
      break;
    case b:
      h = (r - g) / delta + 4;
      break;
  }

  h! *= 60;

  return {
    h: Math.round(h!),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
    a: 1,
  };
};

export const colorToCssVars = (color: Color, prefix = ''): CSSProperties => {
  const { h, s, l, a } = color;
  return {
    [`--${prefix}-h`]: h,
    [`--${prefix}-s`]: s,
    [`--${prefix}-l`]: l,
    [`--${prefix}-a`]: a,
    [`--${prefix}-gradient`]: getGradient(color),
  };
};
