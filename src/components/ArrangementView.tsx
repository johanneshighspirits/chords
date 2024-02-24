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
          color: { h, s, l },
          title,
        } = part;
        return (
          <li
            key={part.id}
            className={partsStyles.part}
            style={
              {
                '--part-color': `hsl(${h} ${s}% ${l}%)`,
              } as CSSProperties
            }>
            {title}
          </li>
        );
      })}
    </aside>
  );
};