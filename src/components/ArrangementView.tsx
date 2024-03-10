'use client';

import { CSSProperties } from 'react';
import { useSongParts } from './providers/SongProvider';
import partsStyles from './parts.module.css';
import styles from './arrangement.module.css';

export const ArrangementView = () => {
  const { parts } = useSongParts();
  return (
    <aside className={styles.arrangement}>
      {parts.map((part) => {
        const {
          color: { h, s, l, a },
          title,
        } = part;
        return (
          <li
            key={part.uid}
            className={partsStyles.part}
            style={
              {
                '--part-color': `hsl(${h} ${s}% ${l}% / ${a})`,
              } as CSSProperties
            }>
            {title}
          </li>
        );
      })}
    </aside>
  );
};
