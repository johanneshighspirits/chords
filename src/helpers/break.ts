import { Duration, Timing } from '@/types';
import { generateId } from './common';

export type BreakType = { uid: string; type: 'break'; timing: Timing };

function createBreak(timing: Timing): BreakType;
function createBreak(position: Duration, duration: Duration): BreakType;
function createBreak(
  timingOrPosition: Duration | Timing,
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
};
