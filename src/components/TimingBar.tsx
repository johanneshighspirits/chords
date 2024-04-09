import { Chord, Duration } from '@/types';
import styles from './TimingBar.module.css';
import { useMasterPosition } from './providers/SongProvider';
import { CSSProperties } from 'react';
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
  const getTargetBar = (beat: number) =>
    beat >= 2 ? { ...position, bar: position.bar + 1 } : position;

  const handleMouseOver = (beat: number) => () => {
    const targetBar = getTargetBar(beat);
    setPendingPosition(targetBar);
  };
  const handleBeatClick = (beat: number) => () => {
    const targetBar = getTargetBar(beat);
    setPosition(targetBar, partId);
  };

  return (
    <div data-bar-id={getBarId(position)} className={styles.bar}>
      {beats.map((beat) => (
        <span
          key={beat}
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
