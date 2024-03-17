import { Duration, Timing } from '@/types';
import styles from './PendingPlayhead.module.css';
import { usePlayhead } from './providers/SongProvider';
import {
  getBarEnd,
  isDurationEqual,
  isPositionEarlier,
  isTimingEarlier,
} from '@/helpers/timing';
import clsx from 'clsx';

export type PendingPlayheadProps = { timing: Timing };

export const PendingPlayhead = ({ timing }: PendingPlayheadProps) => {
  const { pendingPosition } = usePlayhead();
  if (!pendingPosition || isPositionEarlier(pendingPosition, timing.position)) {
    return null;
  }
  const showPlayheadBeforeThisBar =
    timing.position.bar % 4 === 0 &&
    isDurationEqual(pendingPosition, timing.position);

  const showPlayheadAfterThisBar = isDurationEqual(
    pendingPosition,
    getBarEnd(timing)
  );

  return (
    <div
      className={clsx({
        [styles.PendingPlayhead]:
          showPlayheadBeforeThisBar || showPlayheadAfterThisBar,
        [styles.PendingLeft]: showPlayheadBeforeThisBar,
        [styles.PendingRight]: showPlayheadAfterThisBar,
      })}></div>
  );
};
