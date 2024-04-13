'use client';

import { useSongParts } from './providers/SongProvider';
import partsStyles from './parts.module.css';
import styles from './ArrangementView.module.css';
import clsx from 'clsx';
import { Editable } from './Editable';
import { Part } from '@/types';
import { colorToCssVars } from '@/helpers/color';

export const ArrangementView = ({ className }: { className?: string }) => {
  const { parts, duplicatePart } = useSongParts();
  const uniquePartTitles = [...new Set(parts.map((part) => part.title))];
  return (
    <aside className={clsx('print-hidden', styles.Arrangement, className)}>
      {parts.map((part, index) => {
        const similarPreviousParts = parts.filter(
          (p) =>
            p.title === part.title && p.uid !== part.uid && p.index < part.index
        );
        const repeatCount = similarPreviousParts.length;
        return (
          <ArrangementItem
            key={part.uid}
            repeatCount={repeatCount}
            isFirst={index === 0}
            isLast={index === parts.length - 1}
            part={part}
          />
        );
      })}

      <div className={styles.DuplicatePartButtons}>
        {uniquePartTitles.map((title) => {
          return (
            <button
              onClick={() => {
                const part = parts.find((p) => p.title === title);
                if (part) {
                  duplicatePart(part);
                }
              }}
              key={title}>
              {title} +
            </button>
          );
        })}
      </div>
    </aside>
  );
};

const ArrangementItem = ({
  part,
  repeatCount,
  isFirst,
  isLast,
}: {
  part: Part;
  repeatCount: number;
  isFirst: boolean;
  isLast: boolean;
}) => {
  const { movePart, setPartTitle } = useSongParts();
  const { color, title } = part;

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
      style={colorToCssVars(color, 'part')}>
      <span>
        <Editable onEdit={handleEditTitle}>{title}</Editable>
        {repeatCount > 0 ? (
          <span style={{ paddingLeft: '0.5em', userSelect: 'none' }}>
            ({repeatCount + 1})
          </span>
        ) : (
          ''
        )}
      </span>
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
