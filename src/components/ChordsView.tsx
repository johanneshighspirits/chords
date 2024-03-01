import { Chord } from '@/types';
import styles from './chords.module.css';
import { RemoveChord } from './RemoveChord';
import clsx from 'clsx';
import { useChords } from './providers/SongProvider';
import { MouseEventHandler, useRef } from 'react';
import { ChordsLineEditor } from './forms/ChordsLineEditor';

type ChordsViewProps = {
  partId: string;
  chords: Chord[];
  repeatCount?: number;
  isDuplicate?: boolean;
};

export const ChordsView = ({
  partId,
  chords,
  repeatCount = 0,
  isDuplicate,
}: ChordsViewProps) => {
  return (
    <div className={styles.chordsLine}>
      <ul className={clsx(styles.chords, isDuplicate && styles.duplicate)}>
        {repeatCount > 0 && (
          <span className={styles.repeatCount}>{repeatCount}x</span>
        )}
        {chords.map((chord) => (
          <ChordView chord={chord} key={chord.id} partId={partId} />
        ))}
      </ul>
      <ChordsLineEditor chords={chords} partId={partId}></ChordsLineEditor>
    </div>
  );
};

type ChordViewProps = {
  chord: Chord;
  partId: string;
};

const ChordView = ({ partId, chord }: ChordViewProps) => {
  const { editChord } = useChords();
  const xRef = useRef<{ x: number; width: number } | null>(null);
  const chordRef = useRef<HTMLLIElement | null>(null);

  const calculateBeats = (clientX: number) => {
    if (xRef.current) {
      const distanceX = clientX - xRef.current.x;
      const newWidth = xRef.current.width + distanceX;
      const beats = chord.bar / 0.25;
      const beatWidth = xRef.current.width / beats;
      return Math.round(newWidth / beatWidth);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (chordRef.current && xRef.current !== null) {
      const newBeats = calculateBeats(e.clientX);
      if (newBeats) {
        chordRef.current.style.gridColumn = `span ${newBeats}`;
      }
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    if (xRef.current !== null) {
      const newBeats = calculateBeats(e.clientX);
      if (newBeats) {
        editChord(chord.id, { bar: newBeats * 0.25 });
      }
      xRef.current = null;
    }
  };

  const handleMouseDown: MouseEventHandler<HTMLButtonElement> = (e) => {
    const width = chordRef.current?.getBoundingClientRect().width;
    if (width !== undefined) {
      xRef.current = {
        x: e.clientX,
        width,
      };
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
  };

  return (
    <li
      ref={chordRef}
      className={styles.chord}
      style={{
        gridColumn: `span ${chord.bar * 4}`,
      }}>
      <RemoveChord
        id={chord.id}
        partId={partId}
        className={styles.removeChord}
      />
      <FormattedChord className={styles.display} {...chord}></FormattedChord>
      {/* <button
        className={styles.dragHandleLeft}
        onMouseDown={handleMouseDown}
        onClick={handleClick(false)}></button> */}
      <button
        className={styles.dragHandleRight}
        onMouseDown={handleMouseDown}></button>
    </li>
  );
};

export const FormattedChord = ({
  className,
  note,
  sign,
  major,
  modifier,
}: Chord & {
  className?: string;
}) => {
  return (
    <span className={className}>
      {note}
      {sign && (
        <span
          style={{ fontFamily: 'math' }}
          dangerouslySetInnerHTML={{ __html: sign }}></span>
      )}
      {!major && 'm'}
      {modifier && <sup>{modifier}</sup>}
    </span>
  );
};
