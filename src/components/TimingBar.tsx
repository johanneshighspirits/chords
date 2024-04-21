import { Chord, Duration } from '@/types';
import styles from './TimingBar.module.css';
import { useMasterPosition } from './providers/SongProvider';
import { CSSProperties, MouseEvent } from 'react';
import { BreakType } from '@/helpers/break';
import { usePendingPosition } from './providers/PendingPositionProvider';

export type TimingBarProps = {
  partId: string;
  barOffset: number;
  chords: (Chord | BreakType)[];
  isDuplicate?: boolean;
};

export const TimingBar = ({
  partId,
  chords,
  barOffset,
  isDuplicate,
}: TimingBarProps) => {
  const { setPendingPosition } = usePendingPosition();
  if (!chords.length) {
    return null;
  }
  const startBar = barOffset + chords[0].timing.position.bar;
  const barPositions = Array.from({ length: 4 }, (_, b) => ({
    bar: b + startBar,
    beat: 0,
  }));
  return (
    <div
      style={
        {
          ['--timing-line-height']: isDuplicate ? '6px' : '12px',
        } as CSSProperties
      }
      className={styles.TimingBar}
      onMouseOut={() => setPendingPosition(null)}>
      {barPositions.map((position) => {
        return (
          <Bar key={getBarId(position)} partId={partId} position={position} />
        );
      })}
    </div>
  );
};

const Bar = ({ position, partId }: { position: Duration; partId: string }) => {
  const { setPosition } = useMasterPosition();
  const { setPendingPosition } = usePendingPosition();
  const beats = Array.from({ length: 4 }, (_, b) => b);

  const getTargetDuration = (beat: number) => ({
    bar: position.bar,
    beat,
  });
  // const getTargetBar = (beat: number) =>
  //   beat >= 2 ? { ...position, bar: position.bar + 1 } : position;

  const getTarget = (beat: number, event: MouseEvent) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX;
    const isLeftHalf = mouseX < left + width / 2;
    if (isLeftHalf) {
      return {
        bar: position.bar,
        beat,
      };
    }
    return {
      bar: beat === 3 ? position.bar + 1 : position.bar,
      beat: beat === 3 ? 0 : beat + 1,
    };
  };

  const handleMouseOver = (beat: number) => (e: MouseEvent) => {
    const target = getTarget(beat, e);
    setPendingPosition(target);
  };

  const handleBeatClick = (beat: number) => (e: MouseEvent) => {
    const target = getTarget(beat, e);
    setPosition(target, partId);
  };

  return (
    <div data-bar-id={getBarId(position)} className={styles.bar}>
      {beats.map((beat) => (
        <span
          key={beat}
          data-beat-id={getBeatId({ ...position, beat })}
          className={styles.beat}
          onMouseOver={handleMouseOver(beat)}
          onClick={handleBeatClick(beat)}>
          {/* {position.bar}:{beat} */}
        </span>
      ))}
    </div>
  );
};

export const getBarId = (position: Duration) =>
  `bar_${position.bar}.${position.beat}`;

export const getBeatId = (position: Duration) =>
  `beat_${position.bar}.${position.beat}`;
