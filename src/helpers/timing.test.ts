import { Duration, Timing } from '@/types';
import { describe, expect, it } from 'vitest';
import {
  getNextBarStart,
  getDurationBetweenPositions,
  getTotalDuration,
  moveChordBy,
  moveTiming,
  updateTimingPositions,
} from './timing';

describe('timing', () => {
  describe('getBarEnd', () => {
    it('should return a Duration object representing the end of a bar', () => {
      const barTiming: Timing = {
        position: {
          bar: 2,
          beat: 1,
        },
        duration: {
          bar: 1,
          beat: 3,
        },
        offset: 0,
      };
      expect(getNextBarStart(barTiming)).toEqual({
        bar: 4,
        beat: 0,
      });
    });
  });
  describe('move position', () => {
    it('should decrease timing by 1.1', () => {
      const moveBy: Duration = {
        bar: 1,
        beat: 1,
      };
      const timing: Timing = {
        position: {
          bar: 8,
          beat: 2,
        },
        duration: {
          bar: 1,
          beat: 2,
        },
        offset: 0,
      };

      const result = moveTiming(timing, moveBy, 'earlier');
      expect(result.position).toEqual({
        bar: 7,
        beat: 1,
      });
    });
    it('should decrease timing by 2.3', () => {
      const moveBy: Duration = {
        bar: 2,
        beat: 3,
      };
      const timing: Timing = {
        position: {
          bar: 8,
          beat: 2,
        },
        duration: {
          bar: 1,
          beat: 2,
        },
        offset: 0,
      };

      const result = moveTiming(timing, moveBy, 'earlier');
      expect(result.position).toEqual({
        bar: 5,
        beat: 3,
      });
    });
    it('should increase timing by 1.1', () => {
      const moveBy: Duration = {
        bar: 1,
        beat: 1,
      };
      const timing: Timing = {
        position: {
          bar: 8,
          beat: 2,
        },
        duration: {
          bar: 1,
          beat: 2,
        },
        offset: 0,
      };

      const result = moveTiming(timing, moveBy, 'later');
      expect(result.position).toEqual({
        bar: 9,
        beat: 3,
      });
    });
    it('should increase timing by 2.3', () => {
      const moveBy: Duration = {
        bar: 2,
        beat: 3,
      };
      const timing: Timing = {
        position: {
          bar: 8,
          beat: 2,
        },
        duration: {
          bar: 1,
          beat: 2,
        },
        offset: 0,
      };

      const result = moveTiming(timing, moveBy, 'later');
      expect(result.position).toEqual({
        bar: 11,
        beat: 1,
      });
    });
    it('should never go below zero', () => {
      const moveBy: Duration = {
        bar: 3,
        beat: 3,
      };
      const timing: Timing = {
        position: {
          bar: 1,
          beat: 2,
        },
        duration: {
          bar: 1,
          beat: 2,
        },
        offset: 0,
      };

      const result = moveTiming(timing, moveBy, 'earlier');
      expect(result.position).toEqual({
        bar: 0,
        beat: 0,
      });
    });
  });
  describe('length', () => {
    it('should sum an array of timings', () => {
      const items: { timing: Timing }[] = [
        {
          timing: {
            position: {
              bar: 0,
              beat: 0,
            },
            duration: {
              bar: 1,
              beat: 0,
            },
            offset: 0,
          },
        },
        {
          timing: {
            position: {
              bar: 0,
              beat: 0,
            },
            duration: {
              bar: 8,
              beat: 3,
            },
            offset: 0,
          },
        },
        {
          timing: {
            position: {
              bar: 0,
              beat: 0,
            },
            duration: {
              bar: 2,
              beat: 3,
            },
            offset: 0,
          },
        },
      ];
      expect(getTotalDuration(items)).toEqual({
        bar: 12,
        beat: 2,
      });
    });
  });
  describe('updateTimingPositions', () => {
    it('should update timings in a sorted array', () => {
      const items = [
        {
          timing: {
            position: {
              bar: 2,
              beat: 1,
            },
            duration: {
              bar: 1,
              beat: 0,
            },
            offset: 0,
          },
        },
        {
          timing: {
            position: {
              bar: 2,
              beat: 1,
            },
            duration: {
              bar: 4,
              beat: 0,
            },
            offset: 0,
          },
        },
        {
          timing: {
            position: {
              bar: 5,
              beat: 1,
            },
            duration: {
              bar: 8,
              beat: 2,
            },
            offset: 0,
          },
        },
      ];
      expect(updateTimingPositions(items)).toEqual([
        {
          timing: {
            position: {
              bar: 0,
              beat: 0,
            },
            duration: {
              bar: 1,
              beat: 0,
            },
            offset: 0,
          },
        },
        {
          timing: {
            position: {
              bar: 1,
              beat: 0,
            },
            duration: {
              bar: 4,
              beat: 0,
            },
            offset: 0,
          },
        },
        {
          timing: {
            position: {
              bar: 5,
              beat: 0,
            },
            duration: {
              bar: 8,
              beat: 2,
            },
            offset: 0,
          },
        },
      ]);
    });
  });
  describe('getDurationBetweenPositions', () => {
    it('should return a distance between two positions', () => {
      const from = {
        bar: 10,
        beat: 2,
      };
      const to = {
        bar: 13,
        beat: 1,
      };
      expect(getDurationBetweenPositions(from, to)).toEqual({
        bar: 2,
        beat: 3,
      });
    });
    it('should return a distance between two positions in the same bar', () => {
      const from = {
        bar: 8,
        beat: 0,
      };
      const to = {
        bar: 8,
        beat: 3,
      };
      expect(getDurationBetweenPositions(from, to)).toEqual({
        bar: 0,
        beat: 3,
      });
    });
  });
});
