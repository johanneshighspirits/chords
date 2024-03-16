import { Duration } from '@/types';
import styles from './TimingBar.module.css';
import clsx from 'clsx';
import { usePlayhead } from './providers/SongProvider';

export type TimingBarProps = { partId: string; lineIndex: number };

export const TimingBar = ({ partId, lineIndex }: TimingBarProps) => {
  const { setPendingPosition } = usePlayhead();
  const barPositions = Array.from({ length: 4 }, (_, b) => ({
    bar: b + lineIndex * 4,
    beat: 0,
  }));
  return (
    <div
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
  const { pendingPosition, setPendingPosition, setPosition } = usePlayhead();
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
    // console.log(
    //   'Move cursor to bar',
    //   beat >= 2 ? position.bar + 1 : position.bar,
    //   '\n',
    //   partId
    // );
  };

  const isPendingBefore = pendingPosition?.bar === position.bar;
  const isPendingAfter =
    pendingPosition?.bar === position.bar + 1 && (position.bar + 1) % 4 === 0;
  return (
    <div
      data-bar-id={`part_${partId}_${position.bar}.${position.beat}`}
      className={clsx(styles.bar, {
        [styles.isPendingBefore]: isPendingBefore,
        [styles.isPendingAfter]: isPendingAfter,
      })}>
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
