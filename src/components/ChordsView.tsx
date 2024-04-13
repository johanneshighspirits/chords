import { Chord, Part, Sign as SignType, isChord } from '@/types';
import styles from './chords.module.css';
import { RemoveChord } from './RemoveChord';
import clsx from 'clsx';
import { useChords } from './providers/SongProvider';
import { MouseEventHandler, useRef } from 'react';
import { ChordsLineEditor } from './forms/ChordsLineEditor';
import {
  getNumberOfBeats,
  getPositionFromBeats,
  moveTiming,
} from '@/helpers/timing';
import { TimingBar } from './TimingBar';
import { FormattedDuration, FormattedPosition } from './Display';
import { PendingPlayhead } from './PendingPlayhead';
import { Break, BreakType } from '@/helpers/break';
import { PlayButton } from './PlayButton';
import { EditChord } from './EditChord';
import { EditMenu } from './EditMenu';
import { flavorToString, modifiersToString } from '@/helpers/chord';
import { EditPosition } from './EditPosition';
import { EditDuration } from './EditDuration';

type ChordsViewProps = {
  chords: (Chord | BreakType)[];
  part: Part;
  lineIndex: number;
  repeatCount?: number;
  isDuplicate?: boolean;
};

export const ChordsView = ({
  part,
  lineIndex,
  chords,
  repeatCount = 0,
  isDuplicate,
}: ChordsViewProps) => {
  const hasChords = chords.some(isChord);
  return (
    <div className={clsx(styles.chordsLine)}>
      <TimingBar
        partId={part.uid}
        barOffset={part.barOffset}
        chords={chords}
        isDuplicate={isDuplicate}
      />
      <ul className={clsx(styles.chords, isDuplicate && styles.duplicate)}>
        {repeatCount > 0 && (
          <span className={styles.repeatCount}>{repeatCount}x</span>
        )}
        {chords.map((chord) => (
          <ChordView
            chord={chord}
            key={chord.uid}
            lineIndex={lineIndex}
            partId={part.uid}
            barOffset={part.barOffset}
          />
        ))}
        {hasChords && (
          <ChordsLineEditor
            chords={chords}
            partId={part.uid}
            isDuplicate={isDuplicate}></ChordsLineEditor>
        )}
      </ul>
    </div>
  );
};

type ChordViewProps = {
  chord: Chord | BreakType;
  lineIndex: number;
  partId: string;
  barOffset: number;
};

const ChordView = ({ partId, barOffset, chord, lineIndex }: ChordViewProps) => {
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
        editChord(
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
        editChord(
          chord.uid,
          {
            timing: {
              ...chord.timing,
              duration: getPositionFromBeats(newBeats),
            },
          },
          'durationChange'
        );
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
    chord.type === 'blank'
      ? 1
      : 1 +
        chord.timing.position.bar * 4 +
        chord.timing.position.beat -
        lineIndex * 16;

  return (
    <>
      {chord.type === 'chord' && (
        <li
          ref={chordRef}
          className={styles.chord}
          style={{
            gridColumnStart,
            gridColumnEnd: `span ${getNumberOfBeats(chord.timing.duration)}`,
          }}>
          <EditMenu>
            <EditChord
              chord={chord}
              className={clsx(styles.editChord, styles.inset)}
            />
            <RemoveChord
              uid={chord.uid}
              partId={partId}
              className={clsx(styles.removeChord, styles.inset)}
            />
          </EditMenu>
          <FormattedChord
            className={styles.display}
            chord={chord}></FormattedChord>
          {/* <Debug>
        Id: {chord.uid}
        <br />
        Pos: {chord.timing.position.bar}.{chord.timing.position.beat}.0
        <br />
        Len: {chord.timing.duration.bar}.{chord.timing.duration.beat}.0
      </Debug> */}
          <div className={clsx(styles.hoverInfo, 'touch-hidden')}>
            <EditPosition chord={chord} />
            <PlayButton
              chord={chord}
              className={styles.PlayButton}></PlayButton>
            <EditDuration chord={chord} />
          </div>
          <div className={clsx('touch-only', styles.PlayButtonContainer)}>
            <PlayButton
              chord={chord}
              className={styles.PlayButton}></PlayButton>
          </div>

          <button
            className={styles.dragHandleLeft}
            onMouseDown={handlePositionMouseDown}></button>
          <button
            className={styles.dragHandleRight}
            onMouseDown={handleDurationMouseDown}></button>
          <PendingPlayhead timing={chord.timing} barOffset={barOffset} />
        </li>
      )}

      {(chord.type === 'break' || chord.type === 'blank') && (
        <li
          ref={chordRef}
          className={styles[chord.type]}
          style={{
            gridColumnStart,
            gridColumnEnd: `span ${getNumberOfBeats(chord.timing.duration)}`,
          }}>
          <FormattedChord
            className={styles.display}
            chord={chord}></FormattedChord>
          <PendingPlayhead timing={chord.timing} barOffset={barOffset} />
        </li>
      )}
    </>
  );
};

export const FormattedChord = ({
  className,
  chord,
}: {
  chord: Chord | BreakType;
  className?: string;
}) => {
  if (chord.type === 'break') {
    return <span className={className}>✷</span>;
  }
  if (chord.type === 'blank') {
    return <span className={className}>&nbsp;</span>;
  }
  if (chord.type === 'chord') {
    const { note, sign, flavor, modifiers, bass, bassSign } = chord;
    return (
      <span className={className}>
        {note}
        <Sign sign={sign} />
        {flavorToString(flavor)}
        {modifiers && <sup>{modifiersToString(modifiers)}</sup>}
        {bass && (
          <span style={{ opacity: 0.8 }}>
            &nbsp;/&nbsp;{bass}
            <Sign sign={bassSign} />
          </span>
        )}
      </span>
    );
  }
  return null;
};

const Sign = ({ sign }: { sign?: SignType }) =>
  sign ? (
    <span
      style={{ fontFamily: 'math' }}
      dangerouslySetInnerHTML={{ __html: sign }}></span>
  ) : null;
