import {
  Chord,
  type Duration as DurationType,
  Part,
  type Timing as TimingType,
} from '@/types';

export const Duration = {
  zero: (): DurationType => ({ bar: 0, beat: 0 }),
};

export const Timing = {
  /**
   * Zero position, 1 bar duration
   */
  init: (offset = 0): TimingType => ({
    offset,
    position: { bar: 0, beat: 0 },
    duration: { bar: 1, beat: 0 },
  }),
  /**
   * Zero position, custom bar duration
   */
  withBarLength: (barLength = 1, offset = 0): TimingType => ({
    offset,
    position: { bar: 0, beat: 0 },
    duration: {
      bar: barLength,
      beat: 0,
    },
  }),
};

export const positionAsString = (position: DurationType): string =>
  `${position.bar}.${position.beat}.0`;

export const getPartLength = (chords: Chord[]): DurationType => {
  const firstChord = chords[0];
  const lastChord = chords.findLast((c) => c.type === 'chord');
  if (!firstChord || !lastChord) {
    return Duration.zero();
  }

  if (firstChord === lastChord) {
    const barEnd = getBarEnd(firstChord.timing);
    return {
      bar: barEnd.bar + 1,
      beat: 0,
    };
  }
  const barLength =
    lastChord.timing.position.bar +
    lastChord.timing.duration.bar -
    firstChord.timing.position.bar;
  return {
    bar: barLength,
    beat: 0,
  };
};

export const getPartEnd = (part?: Part): DurationType | undefined => {
  const lastChord = part?.chords.at(-1);
  if (lastChord) {
    return getBarEnd(lastChord.timing);
  }
  return undefined;
};

export const getNumberOfBeats = (position: DurationType) => {
  return position.bar * 4 + position.beat;
};

export const getPositionFromBeats = (beats: number): DurationType => {
  return {
    bar: Math.floor(beats / 4),
    beat: beats % 4,
  };
};

export const getTotalDuration = (
  items: { timing: TimingType }[]
): DurationType => {
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
  (moveBy: DurationType, direction: 'earlier' | 'later') =>
  (chord: Chord): Chord => {
    return {
      ...chord,
      timing: moveTiming(chord.timing, moveBy, direction),
    };
  };

export const moveTiming = (
  timing: TimingType,
  moveBy: DurationType,
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

export const isTimingEarlier = (
  timing: TimingType,
  compareWith: TimingType
) => {
  return isPositionEarlier(timing.position, compareWith.position);
};

export const isPositionEarlier = (
  position: DurationType,
  compareWith: DurationType
) => {
  if (position.bar < compareWith.bar) {
    return true;
  }
  if (position.bar === compareWith.bar && position.beat < compareWith.beat) {
    return true;
  }
  return false;
};

export const getDurationBetweenPositions = (
  fromPosition: DurationType,
  toPosition: DurationType
) => {
  const from = getNumberOfBeats(fromPosition);
  const to = getNumberOfBeats(toPosition);
  return getPositionFromBeats(to - from);
};

export const isDurationEqual = (
  duration: DurationType,
  compareWith: DurationType
) => duration.bar === compareWith.bar && duration.beat === compareWith.beat;

export const addDurations = (durations: DurationType[]) => {
  const beats = durations.reduce((sum, duration) => {
    return sum + getNumberOfBeats(duration);
  }, 0);
  return getPositionFromBeats(beats);
};

export const getBarEnd = (timing?: TimingType) => {
  if (!timing) {
    return Timing.init().position;
  }
  const pos = getNumberOfBeats(timing.position);
  const dur = getNumberOfBeats(timing.duration);
  return getPositionFromBeats(pos + dur);
};

export const calculateOffset = (parts: Part[]) => {
  let prevPartOffset = 0;
  return parts.map((part) => {
    const barOffset = prevPartOffset;
    prevPartOffset += getPartLength(part.chords).bar;
    return {
      ...part,
      barOffset,
    };
  });
};

export const getCurrentPart = (parts: Part[], masterPosition: DurationType) => {
  return (
    parts.find((p, i) => {
      const nextPart = parts[i + 1];
      if (!nextPart) {
        return true;
      }
      return (
        masterPosition.bar >= p.barOffset &&
        masterPosition.bar <= nextPart.barOffset
      );
    }) ?? parts[0]
  );
};
export const updateTimingPositions = <T extends { timing: TimingType }>(
  items: T[],
  initialOffset = Timing.init()
): T[] => {
  return items.reduce((result, item) => {
    if (result.length === 0) {
      return [{ ...item, timing: initialOffset }];
    }
    const lastItem = result.at(-1);
    if (!lastItem) {
      return result;
    }
    return [
      ...result,
      {
        ...item,
        timing: {
          ...item.timing,
          position: getBarEnd(lastItem.timing),
        },
      },
    ];
  }, [] as T[]);
};

export const serializeTiming = (timing: TimingType): SerializedTiming => {
  const { position, duration, offset } = timing;
  return {
    position: serializeDuration(position),
    duration: serializeDuration(duration),
    offset,
  };
};
type SerializedTiming = { position: number; duration: number; offset: number };

export const deserializeTiming = (t: SerializedTiming): TimingType => {
  return {
    position: deserializeDuration(t.position),
    duration: deserializeDuration(t.duration),
    offset: t.offset,
  };
};

export const serializeDuration = (duration: DurationType) =>
  (duration.bar << 4) + duration.beat;

export const deserializeDuration = (input: number): DurationType => ({
  bar: input >> 4,
  beat: input % 16,
});
