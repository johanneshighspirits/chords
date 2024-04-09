import { Timing } from '@/types';
import styles from './PendingPlayhead.module.css';
import {
  addDurations,
  getNextBarStart,
  isDurationEqual,
} from '@/helpers/timing';
import clsx from 'clsx';
import { usePendingPosition } from './providers/PendingPositionProvider';

export type PendingPlayheadProps = { timing: Timing; barOffset: number };

export const PendingPlayhead = ({
  timing,
  barOffset,
}: PendingPlayheadProps) => {
  const { pendingPosition } = usePendingPosition();
  const timingWithOffset = {
    ...timing,
    position: addDurations([{ bar: barOffset, beat: 0 }, timing.position]),
  };

  if (!pendingPosition) {
    return null;
  }
  const showPlayheadBeforeThisBar =
    timing.position.bar % 4 === 0 &&
    isDurationEqual(pendingPosition, timingWithOffset.position);

  const showPlayheadAfterThisBar = isDurationEqual(
    pendingPosition,
    getNextBarStart(timingWithOffset)
  );
  return (
    <div
      className={clsx('pending-playhead', {
        [styles.PendingPlayhead]:
          showPlayheadBeforeThisBar || showPlayheadAfterThisBar,
        [styles.PendingLeft]: showPlayheadBeforeThisBar,
        [styles.PendingRight]: showPlayheadAfterThisBar,
      })}></div>
  );
};
