import { describe, expect, it } from 'vitest';
import { DBActionPayload, mergePayloads } from './actions';
import { Timing } from '@/helpers/timing';
import { Part } from '@/helpers/part';

describe('mergePayloads', () => {
  it('should merge two chord payloads with same chord id', () => {
    const part = Part.new([]);
    const payloads: DBActionPayload[] = [
      {
        action: 'upsertChords',
        songId: 'song-id',
        part,
        entries: [
          {
            note: 'C',
            major: true,
            timing: Timing.init(),
            uid: 'chord-1',
            sign: '&#9837;',
          },
        ],
      },
      {
        action: 'upsertChords',
        songId: 'song-id',
        part,
        entries: [
          {
            note: 'F',
            major: true,
            timing: Timing.init(),
            uid: 'chord-1',
            sign: undefined,
          },
        ],
      },
    ];

    expect(mergePayloads(payloads)).toEqual([
      {
        action: 'upsertChords',
        songId: 'song-id',
        part,
        entries: [
          {
            note: 'F',
            major: true,
            timing: Timing.init(),
            uid: 'chord-1',
            sign: undefined,
          },
        ],
      },
    ]);
  });
  it('should not merge two chord payloads with different parts', () => {
    const part = Part.new([]);
    const part2 = Part.new([]);
    const payloads: DBActionPayload[] = [
      {
        action: 'upsertChords',
        songId: 'song-id',
        part,
        entries: [
          {
            note: 'C',
            major: true,
            timing: Timing.init(),
            uid: 'chord-1',
            sign: '&#9837;',
          },
        ],
      },
      {
        action: 'upsertChords',
        songId: 'song-id',
        part: part2,
        entries: [
          {
            note: 'F',
            major: true,
            timing: Timing.init(),
            uid: 'chord-2',
            sign: undefined,
          },
        ],
      },
    ];

    expect(mergePayloads(payloads)).toEqual([
      {
        action: 'upsertChords',
        songId: 'song-id',
        part,
        entries: [
          {
            note: 'C',
            major: true,
            timing: Timing.init(),
            uid: 'chord-1',
            sign: '&#9837;',
          },
        ],
      },
      {
        action: 'upsertChords',
        songId: 'song-id',
        part: part2,
        entries: [
          {
            note: 'F',
            major: true,
            timing: Timing.init(),
            uid: 'chord-2',
            sign: undefined,
          },
        ],
      },
    ]);
  });
  it('should merge two chord payloads with different chord id', () => {
    const part = Part.new([]);
    const payloads: DBActionPayload[] = [
      {
        action: 'upsertChords',
        songId: 'song-id',
        part,
        entries: [
          {
            note: 'C',
            major: true,
            timing: Timing.init(),
            uid: 'chord-1',
            sign: '&#9837;',
          },
        ],
      },
      {
        action: 'upsertChords',
        songId: 'song-id',
        part,
        entries: [
          {
            note: 'F',
            major: true,
            timing: Timing.init(),
            uid: 'chord-2',
            sign: undefined,
          },
        ],
      },
    ];

    expect(mergePayloads(payloads)).toEqual([
      {
        action: 'upsertChords',
        songId: 'song-id',
        part,
        entries: [
          {
            note: 'C',
            major: true,
            timing: Timing.init(),
            uid: 'chord-1',
            sign: '&#9837;',
          },
          {
            note: 'F',
            major: true,
            timing: Timing.init(),
            uid: 'chord-2',
            sign: undefined,
          },
        ],
      },
    ]);
  });
  it('should merge two chord payloads with removed uids and make them unique', () => {
    const part = Part.new([]);
    const payloads: DBActionPayload[] = [
      {
        action: 'upsertChords',
        songId: 'song-id',
        part,
        entries: [],
        removedEntryUids: ['a', 'c', 'e', 'f'],
      },
      {
        action: 'upsertChords',
        songId: 'song-id',
        part,
        entries: [],
        removedEntryUids: ['c', 'g'],
      },
    ];

    expect(mergePayloads(payloads)).toEqual([
      {
        action: 'upsertChords',
        songId: 'song-id',
        part,
        entries: [],
        removedEntryUids: ['a', 'c', 'e', 'f', 'g'],
      },
    ]);
  });

  it('should merge two part payloads', () => {
    const part1 = Part.new([]);
    part1.title = 'Part 1';
    const part2 = Part.new([
      {
        note: 'F',
        major: true,
        timing: Timing.init(),
        uid: 'chord-1',
        sign: '',
      },
    ]);
    const payloads: DBActionPayload[] = [
      {
        action: 'upsertParts',
        songId: 'song-id',
        entries: [part1, part2],
      },
      {
        action: 'upsertParts',
        songId: 'song-id',
        entries: [{ ...part1, title: 'Renamed Part 1' }],
      },
    ];

    expect(mergePayloads(payloads)).toEqual([
      {
        action: 'upsertParts',
        songId: 'song-id',
        entries: [part2, { ...part1, title: 'Renamed Part 1' }],
      },
    ]);
  });
});
