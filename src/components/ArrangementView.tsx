'use client';

import { CSSProperties } from 'react';
import { useSongParts } from './providers/SongProvider';
import partsStyles from './parts.module.css';
import styles from './ArrangementView.module.css';
import clsx from 'clsx';
import { Editable } from './Editable';
import { Part } from '@/types';

export const ArrangementView = ({ className }: { className?: string }) => {
  const { parts } = useSongParts();
  return (
    <aside className={clsx('print-hidden', styles.Arrangement, className)}>
      {parts.map((part, index) => {
        return (
          <ArrangementItem
            key={part.uid}
            isFirst={index === 0}
            isLast={index === parts.length - 1}
            part={part}
          />
        );
      })}
    </aside>
  );
};

const ArrangementItem = ({
  part,
  isFirst,
  isLast,
}: {
  part: Part;
  isFirst: boolean;
  isLast: boolean;
}) => {
  const { movePart, setPartTitle } = useSongParts();
  const {
    color: { h, s, l, a },
    title,
  } = part;

  const handleEditTitle = (title: string) => {
    if (title !== part.title) {
      setPartTitle(part, title);
    }
  };

  const handleMovePart = (direction: 'before' | 'after') => () => {
    movePart(direction, part.uid);
  };

  return (
    <li
      key={part.uid}
      className={clsx(partsStyles.part, styles.ArrangementItem)}
      style={
        {
          '--part-color': `hsl(${h} ${s}% ${l}% / ${a})`,
        } as CSSProperties
      }>
      <Editable onEdit={handleEditTitle}>{title}</Editable>
      {!isFirst && (
        <button
          className={clsx('blank', styles.MoveButton, styles.MoveButtonUp)}
          onClick={handleMovePart('before')}>
          ↑
        </button>
      )}
      {!isLast && (
        <button
          className={clsx('blank', styles.MoveButton, styles.MoveButtonDown)}
          onClick={handleMovePart('after')}>
          ↓
        </button>
      )}
    </li>
  );
};
