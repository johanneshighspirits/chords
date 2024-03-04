import { Duration, Timing } from '@/types';
import { describe, expect, it } from 'vitest';
import { getTotalDuration, moveChordBy, moveTiming } from './timing';

describe('timing', () => {
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
        bar: 2,
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
        bar: 1,
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
});
