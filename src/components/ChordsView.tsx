import { Chord } from '@/types';
import styles from './chords.module.css';
import { RemoveChord } from './RemoveChord';
import clsx from 'clsx';
import { useChords } from './providers/SongProvider';
import { MouseEventHandler, useRef } from 'react';
import { ChordsLineEditor } from './forms/ChordsLineEditor';
import { Debug } from './debug/Debug';
import {
  getNumberOfBeats,
  getPositionFromBeats,
  moveTiming,
} from '@/helpers/timing';

type ChordsViewProps = {
  partId: string;
  chords: Chord[];
  lineIndex: number;
  repeatCount?: number;
  isDuplicate?: boolean;
};

export const ChordsView = ({
  partId,
  chords,
  lineIndex,
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
          <ChordView
            chord={chord}
            key={chord.id}
            lineIndex={lineIndex}
            partId={partId}
          />
        ))}
      </ul>
      <ChordsLineEditor chords={chords} partId={partId}></ChordsLineEditor>
    </div>
  );
};

type ChordViewProps = {
  chord: Chord;
  lineIndex: number;
  partId: string;
};

const ChordView = ({ partId, chord, lineIndex }: ChordViewProps) => {
  const { editChord } = useChords();
  const xRef = useRef<{ chordX: number; beatWidth: number } | null>(null);
  const chordRef = useRef<HTMLLIElement | null>(null);

  const calculateBeats = (clientX: number) => {
    if (xRef.current) {
      const newWidth = clientX - xRef.current.chordX;
      const numberOfBeats = newWidth / xRef.current.beatWidth;
      return Math.round(numberOfBeats);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (chordRef.current && xRef.current !== null) {
      const newBeats = calculateBeats(e.clientX);
      if (newBeats) {
        chordRef.current.style.gridColumnEnd = `span ${newBeats}`;
      }
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    if (xRef.current !== null) {
      const newBeats = calculateBeats(e.clientX);
      if (newBeats) {
        editChord(
          chord.id,
          {
            timing: {
              ...chord.timing,
              duration: getPositionFromBeats(newBeats),
            },
          },
          'durationChange'
        );
      }
      xRef.current = null;
    }
  };

  const handleMouseDown: MouseEventHandler<HTMLButtonElement> = (e) => {
    const rect = chordRef.current?.getBoundingClientRect();
    if (rect) {
      const { x, width } = rect;
      xRef.current = {
        chordX: x,
        beatWidth: width / getNumberOfBeats(chord.timing.duration),
      };
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
  };

  const gridColumnStart =
    1 +
    chord.timing.position.bar * 4 +
    chord.timing.position.beat -
    lineIndex * 16;
  return (
    <li
      ref={chordRef}
      className={styles.chord}
      style={{
        gridColumnStart,
        gridColumnEnd: `span ${getNumberOfBeats(chord.timing.duration)}`,
      }}>
      <RemoveChord
        id={chord.id}
        partId={partId}
        className={styles.removeChord}
      />
      <FormattedChord className={styles.display} {...chord}></FormattedChord>
      <Debug>
        Pos: {chord.timing.position.bar}.{chord.timing.position.beat}.0
        <br />
        Len: {chord.timing.duration.bar}.{chord.timing.duration.beat}.0
      </Debug>
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
