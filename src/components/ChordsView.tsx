import { Chord, Sign as SignType } from '@/types';
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
import { updateChordTiming } from '@/db/actions';
import { TimingBar } from './TimingBar';

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
    <div className={clsx(styles.chordsLine)}>
      <TimingBar partId={partId} lineIndex={lineIndex} />
      <ul className={clsx(styles.chords, isDuplicate && styles.duplicate)}>
        {repeatCount > 0 && (
          <span className={styles.repeatCount}>{repeatCount}x</span>
        )}
        {chords.map((chord) => (
          <ChordView
            chord={chord}
            key={chord.uid}
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
  const tempRef = useRef<{
    chordLeft: number;
    colStart: number;
    beatWidth: number;
  } | null>(null);
  const chordRef = useRef<HTMLLIElement | null>(null);

  const calculateBeatsMoved = (clientX: number) => {
    if (tempRef.current) {
      const distance = clientX - tempRef.current.chordLeft;
      const numberOfBeats = distance / tempRef.current.beatWidth;
      return Math.round(numberOfBeats);
    }
  };
  const handlePositionMouseMove = (e: MouseEvent) => {
    if (chordRef.current && tempRef.current !== null) {
      const distanceMoved = calculateBeatsMoved(e.clientX);
      if (distanceMoved !== undefined) {
        console.log(
          'distanceMoved',
          distanceMoved,
          `colStart: ${tempRef.current.colStart}`
        );
        chordRef.current.style.gridColumnStart = `${
          tempRef.current.colStart + distanceMoved
        }`;
      }
    }
  };
  const handlePositionMouseUp = (e: MouseEvent) => {
    window.removeEventListener('mousemove', handlePositionMouseMove);
    window.removeEventListener('mouseup', handlePositionMouseUp);
    if (tempRef.current !== null) {
      const newBeats = calculateBeatsMoved(e.clientX);
      if (newBeats !== 0 && newBeats !== undefined) {
        const editedChord = editChord(
          chord.uid,
          {
            timing: moveTiming(
              chord.timing,
              { bar: 0, beat: Math.abs(newBeats) },
              newBeats > 0 ? 'later' : 'earlier'
            ),
          },
          'positionChange'
        );
        if (editedChord) {
          updateChordTiming(editedChord);
        }
      }
      tempRef.current = null;
    }
  };

  const calculateDurationBeats = (clientX: number) => {
    if (tempRef.current) {
      const newWidth = clientX - tempRef.current.chordLeft;
      const numberOfBeats = newWidth / tempRef.current.beatWidth;
      return Math.round(numberOfBeats);
    }
  };
  const handleDurationMouseMove = (e: MouseEvent) => {
    if (chordRef.current && tempRef.current !== null) {
      const newBeats = calculateDurationBeats(e.clientX);
      if (newBeats) {
        chordRef.current.style.gridColumnEnd = `span ${newBeats}`;
      }
    }
  };
  const handleDurationMouseUp = (e: MouseEvent) => {
    window.removeEventListener('mousemove', handleDurationMouseMove);
    window.removeEventListener('mouseup', handleDurationMouseUp);
    if (tempRef.current !== null) {
      const newBeats = calculateDurationBeats(e.clientX);
      if (newBeats) {
        const editedChord = editChord(
          chord.uid,
          {
            timing: {
              ...chord.timing,
              duration: getPositionFromBeats(newBeats),
            },
          },
          'durationChange'
        );
        if (editedChord) {
          updateChordTiming(editedChord);
        }
      }
      tempRef.current = null;
    }
  };

  const handlePositionMouseDown: MouseEventHandler<HTMLButtonElement> = (e) => {
    const rect = chordRef.current?.getBoundingClientRect();
    if (rect) {
      const { x, width } = rect;
      tempRef.current = {
        chordLeft: x,
        colStart: gridColumnStart,
        beatWidth: width / getNumberOfBeats(chord.timing.duration),
      };
      window.addEventListener('mousemove', handlePositionMouseMove);
      window.addEventListener('mouseup', handlePositionMouseUp);
    }
  };

  const handleDurationMouseDown: MouseEventHandler<HTMLButtonElement> = (e) => {
    const rect = chordRef.current?.getBoundingClientRect();
    if (rect) {
      const { x, width } = rect;
      tempRef.current = {
        chordLeft: x,
        colStart: gridColumnStart,
        beatWidth: width / getNumberOfBeats(chord.timing.duration),
      };
      window.addEventListener('mousemove', handleDurationMouseMove);
      window.addEventListener('mouseup', handleDurationMouseUp);
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
        uid={chord.uid}
        partId={partId}
        className={clsx(styles.removeChord, styles.inset)}
      />
      <FormattedChord className={styles.display} {...chord}></FormattedChord>
      {/* <Debug>
        Id: {chord.uid}
        <br />
        Pos: {chord.timing.position.bar}.{chord.timing.position.beat}.0
        <br />
        Len: {chord.timing.duration.bar}.{chord.timing.duration.beat}.0
      </Debug> */}
      <button
        className={styles.dragHandleLeft}
        onMouseDown={handlePositionMouseDown}></button>
      <button
        className={styles.dragHandleRight}
        onMouseDown={handleDurationMouseDown}></button>
    </li>
  );
};

export const FormattedChord = ({
  className,
  note,
  sign,
  major,
  modifier,
  bass,
  bassSign,
}: Chord & {
  className?: string;
}) => {
  return (
    <span className={className}>
      {note}
      <Sign sign={sign} />
      {!major && 'm'}
      {modifier && <sup>{modifier}</sup>}
      {bass && (
        <span style={{ opacity: 0.8 }}>
          &nbsp;/&nbsp;{bass}
          <Sign sign={bassSign} />
        </span>
      )}
    </span>
  );
};

const Sign = ({ sign }: { sign?: SignType }) =>
  sign ? (
    <span
      style={{ fontFamily: 'math' }}
      dangerouslySetInnerHTML={{ __html: sign }}></span>
  ) : null;
