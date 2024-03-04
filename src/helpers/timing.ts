import { Chord, Duration, type Timing as TimingType } from '@/types';

export const Timing = {
  init: (offset = 0): TimingType => ({
    offset,
    position: { bar: 0, beat: 0 },
    duration: { bar: 1, beat: 0 },
  }),
  withBarLength: (barLength = 1, offset = 0): TimingType => ({
    offset,
    position: { bar: 0, beat: 0 },
    duration: {
      bar: barLength,
      beat: 0,
    },
  }),
};

export const positionAsString = (position: Duration): string =>
  `${position.bar}.${position.beat}.0`;

export const getPartLength = (chords: Chord[]): Duration =>
  chords.reduce(
    (result, chord) => {
      result.bar += chord.timing.duration.bar;
      result.beat += chord.timing.duration.beat;
      return result;
    },
    { bar: 0, beat: 0 } as Duration
  );

export const getNumberOfBeats = (position: Duration) => {
  return position.bar * 4 + position.beat;
};

export const getPositionFromBeats = (beats: number): Duration => {
  return {
    bar: Math.floor(beats / 4),
    beat: beats % 4,
  };
};

export const getTotalDuration = (items: { timing: TimingType }[]): Duration => {
  const totalBeats = items.reduce(
    (sum, item) => sum + getNumberOfBeats(item.timing.duration),
    0
  );
  return {
    bar: Math.floor(totalBeats / 4),
    beat: totalBeats % 4,
  };
};

export const moveChordBy =
  (moveBy: Duration, direction: 'earlier' | 'later') =>
  (chord: Chord): Chord => {
    return {
      ...chord,
      timing: moveTiming(chord.timing, moveBy, direction),
    };
  };

export const moveTiming = (
  timing: TimingType,
  moveBy: Duration,
  direction: 'earlier' | 'later'
): TimingType => {
  const multiplier = direction === 'earlier' ? -1 : 1;
  const beats = getNumberOfBeats(timing.position);
  const moveByBeats = getNumberOfBeats(moveBy);
  const movedBeats = beats + multiplier * moveByBeats;
  const position = {
    bar: Math.max(0, Math.floor(movedBeats / 4)),
    beat: Math.max(0, movedBeats % 4),
  };
  return {
    ...timing,
    position,
  };
};
