import { Duration } from '@/types';
import styles from './TimingBar.module.css';
import { usePlayhead } from './providers/SongProvider';
import { CSSProperties } from 'react';

export type TimingBarProps = {
  partId: string;
  lineIndex: number;
  isDuplicate?: boolean;
};

export const TimingBar = ({
  partId,
  lineIndex,
  isDuplicate,
}: TimingBarProps) => {
  const { setPendingPosition } = usePlayhead();
  const barPositions = Array.from({ length: 4 }, (_, b) => ({
    bar: b + lineIndex * 4,
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
          <Bar
            key={`${partId}_${position.bar}_${position.beat}`}
            partId={partId}
            position={position}
          />
        );
      })}
    </div>
  );
};

const Bar = ({ partId, position }: { partId: string; position: Duration }) => {
  const { setPendingPosition, setPosition } = usePlayhead();
  const beats = Array.from({ length: 4 }, (_, b) => b);
  const getTargetBar = (beat: number) =>
    beat >= 2 ? { ...position, bar: position.bar + 1 } : position;

  const handleMouseOver = (beat: number) => () => {
    const targetBar = getTargetBar(beat);
    setPendingPosition(targetBar);
  };
  const handleBeatClick = (beat: number) => () => {
    const targetBar = getTargetBar(beat);
    setPosition(targetBar);
  };

  return (
    <div
      data-bar-id={`part_${partId}_${position.bar}.${position.beat}`}
      className={styles.bar}>
      {beats.map((beat) => (
        <span
          key={beat}
          className={styles.beat}
          onMouseOver={handleMouseOver(beat)}
          onClick={handleBeatClick(beat)}></span>
      ))}
    </div>
  );
};
