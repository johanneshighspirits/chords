import { Duration, Timing as TimingType } from '@/types';
import { generateId } from './common';
import { Timing } from './timing';

export type BreakType = {
  uid: string;
  type: 'break' | 'blank';
  timing: TimingType;
};

function createBreak(timing: TimingType): BreakType;
function createBreak(position: Duration, duration: Duration): BreakType;
function createBreak(
  timingOrPosition: Duration | TimingType,
  duration?: Duration
): BreakType {
  if ('position' in timingOrPosition) {
    return { uid: generateId(), type: 'break', timing: timingOrPosition };
  }
  return {
    type: 'break',
    uid: generateId(),
    timing: {
      position: timingOrPosition,
      duration: duration ?? { bar: 1, beat: 0 },
      offset: 0,
    },
  };
}

export const Break = {
  new: createBreak,
  blank: (): BreakType => ({
    type: 'blank',
    uid: generateId(),
    timing: Timing.withBarLength(1),
  }),
};
