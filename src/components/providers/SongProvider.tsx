'use client';

import { getRandomColor } from '@/helpers/color';
import { Part, getChordLines, getChordPattern } from '@/helpers/part';
import { Part as PartType, Chord, Song, Color, SongMeta } from '@/types';
import {
  createContext,
  useContext,
  useReducer,
  PropsWithChildren,
  useMemo,
} from 'react';
import { SongSaver } from './SongSaver';
import {
  Timing,
  getNumberOfBeats,
  moveChordBy,
  moveTiming,
} from '@/helpers/timing';
import { generateId } from '@/helpers/common';

type SongState = SongMeta & {
  parts: PartType[];
  currentPartUID?: string;
  colorsByPattern?: Record<string, Color>;
};

type Action =
  | { type: 'openSong'; song: Song }
  | { type: 'addChord'; chord: Chord; partId?: string }
  | {
      type: 'addChords';
      chords: Chord[];
      partId?: string;
      afterChordId?: string;
    }
  | {
      type: 'editChord';
      uid: string;
      chord: Partial<Chord>;
      change: 'durationChange' | 'positionChange';
    }
  | { type: 'removeChord'; uid: string; partId: string }
  | { type: 'removeChords'; chordIds: string[]; partId: string }
  | { type: 'addPart'; title?: string; chords?: Chord[] }
  | { type: 'removePart'; uid: string }
  | { type: 'setPartTitle'; title: string; partId: string }
  | { type: 'setActivePart'; partId: string };
type Dispatch = (action: Action) => void;

const SongContext = createContext<
  { state: SongState; dispatch: Dispatch } | undefined
>(undefined);

function reducer(state: SongState, action: Action): SongState {
  switch (action.type) {
    case 'addChord': {
      if (state.parts.length === 0) {
        const newPart = Part.new([action.chord]);
        const colorsByPattern = {
          [newPart.pattern!]: newPart.color,
        };
        return {
          ...state,
          colorsByPattern,
          parts: [newPart],
          currentPartUID: newPart.uid,
        };
      }
      const currentPartId =
        action.partId || state.currentPartUID || state.parts[0]?.uid;
      return {
        ...state,
        parts: state.parts.map((part) => {
          if (part.uid === currentPartId) {
            const lastChordTiming =
              part.chords[part.chords.length - 1]?.timing ?? Timing.init();
            const lastChordBeatOffset =
              (lastChordTiming.position.beat + lastChordTiming.duration.beat) %
              4;
            return {
              ...part,
              chords: [
                ...part.chords,
                {
                  ...action.chord,
                  timing: {
                    ...action.chord.timing,
                    duration: {
                      ...(lastChordBeatOffset > 0
                        ? {
                            bar: 0,
                            beat: 4 - lastChordBeatOffset,
                          }
                        : action.chord.timing.duration),
                    },
                    position: {
                      ...(lastChordBeatOffset > 0
                        ? {
                            bar: lastChordTiming.position.bar,
                            beat: lastChordBeatOffset,
                          }
                        : {
                            bar: part.chords[part.chords.length - 1]
                              ? lastChordTiming.position.bar + 1
                              : 0,
                            beat: 0,
                          }),
                    },
                  },
                },
              ],
            };
          }
          return part;
        }),
        currentPartUID: currentPartId,
      };
    }
    case 'addChords': {
      return {
        ...state,
        parts: state.parts.map((part) => {
          if (part.uid === action.partId) {
            const index =
              part.chords.findIndex((c) => c.uid === action.afterChordId) ||
              part.chords.length;
            const newChords = [
              ...part.chords.slice(0, index + 1),
              ...action.chords.map((chord) => ({
                ...chord,
                id: generateId(),
                timing: moveTiming(
                  chord.timing,
                  {
                    bar: 4,
                    beat: 0,
                  },
                  'later'
                ),
              })),
              ...part.chords
                .slice(index + 1)
                .map(moveChordBy({ bar: 4, beat: 0 }, 'later')),
            ];
            return {
              ...part,
              chords: newChords,
            };
          }
          return part;
        }),
      };
    }
    case 'editChord': {
      return {
        ...state,
        parts: state.parts.map((part) => {
          const chordIndex = part.chords.findIndex(
            (chord) => chord.uid === action.uid
          );
          if (chordIndex > -1) {
            const oldChord = part.chords[chordIndex];
            const newChord = {
              ...oldChord,
              ...action.chord,
            };
            switch (action.change) {
              case 'durationChange': {
                const change =
                  getNumberOfBeats(newChord.timing.duration) -
                  getNumberOfBeats(oldChord.timing.duration);
                console.log('duration change in beats', change);
                return {
                  ...part,
                  chords: [
                    ...part.chords.slice(0, chordIndex),
                    newChord,
                    ...part.chords.slice(chordIndex + 1).map((c) => ({
                      ...c,
                      // timing: moveTiming(c.timing, {bar:0, beat: change}, change > 0 ? 'later' : 'earlier')
                    })),
                  ],
                };
              }
              case 'positionChange': {
                const change =
                  getNumberOfBeats(newChord.timing.position) -
                  getNumberOfBeats(oldChord.timing.position);
                console.log('position change in beats', change);
                return {
                  ...part,
                  chords: [
                    ...part.chords.slice(0, chordIndex),
                    newChord,
                    ...part.chords.slice(chordIndex + 1).map((c) => ({
                      ...c,
                      // timing: moveTiming(c.timing, {bar:0, beat: change}, change > 0 ? 'later' : 'earlier')
                    })),
                  ],
                };
              }

              default: {
                return part;
              }
            }
          }
          return part;
        }),
      };
    }
    case 'removeChord': {
      return {
        ...state,
        parts: state.parts.map((part) => {
          if (part.uid === action.partId) {
            const chordToRemoveIndex = part.chords.findIndex(
              (c) => c.uid === action.uid
            );
            const chordToRemove = part.chords[chordToRemoveIndex];
            const newChords = [
              ...part.chords.slice(0, chordToRemoveIndex),
              ...part.chords
                .slice(chordToRemoveIndex + 1)
                .map(moveChordBy(chordToRemove.timing.duration, 'earlier')),
            ];
            return {
              ...part,
              chords: newChords,
            };
          }
          return part;
        }),
      };
    }
    case 'removeChords': {
      return {
        ...state,
        parts: state.parts.map((part) => {
          if (part.uid === action.partId) {
            return {
              ...part,
              chords: part.chords.filter(
                (c) => !action.chordIds.includes(c.uid)
              ),
            };
          }
          return part;
        }),
      };
    }
    case 'addPart': {
      const prevPart = state.parts[state.parts.length - 1];
      const prevTiming = prevPart ? prevPart.timing : Timing.init();
      return {
        ...state,
        parts: [
          ...state.parts,
          {
            uid: generateId(),
            title: `Part ${state.parts.length + 1}`,
            chords: [],
            color: getRandomColor(),
            timing: Timing.init(prevTiming.offset + prevTiming.duration.bar),
          },
        ],
      };
    }
    case 'removePart': {
      return {
        ...state,
        parts: state.parts.filter((part) => part.uid !== action.uid),
      };
    }
    case 'setPartTitle': {
      return {
        ...state,
        parts: state.parts.map((part) => {
          if (part.uid === action.partId) {
            return {
              ...part,
              title: action.title,
            };
          }
          return part;
        }),
      };
    }
    case 'setActivePart': {
      return {
        ...state,
        currentPartUID: action.partId,
      };
    }
    case 'openSong': {
      const { title, parts } = action.song;
      return {
        ...state,
        title,
        parts,
        currentPartUID: parts[parts.length - 1].uid,
      };
    }
    default: {
      console.warn(`Action ${(action as any).type} not implemented yet`);
      return state;
    }
  }
}

const emptyState: SongState = {
  uid: generateId(),
  slug: '',
  title: 'New Song',
  parts: [Part.new([])],
};

export const SongProvider = ({
  initialSong,
  children,
}: PropsWithChildren<{ initialSong?: Song }>) => {
  const [state, dispatch] = useReducer(reducer, initialSong ?? emptyState);
  const value = {
    state,
    dispatch,
  };
  // console.log('----');
  // state.parts.forEach((part) => {
  //   console.log(part.timing);
  //   part.chords.forEach((chord) => {
  //     console.table({ display: chord.display, ...chord.timing });
  //   });
  // });
  return (
    <SongContext.Provider value={value}>
      <SongSaver />
      {children}
    </SongContext.Provider>
  );
};

export function useSong() {
  const ctx = useContext(SongContext);
  if (!ctx) {
    throw new Error('useSong must be used within a SongContext Provider');
  }
  const { state, dispatch } = ctx;

  const parts = useMemo(
    () =>
      ctx.state.parts.map((part) => {
        return {
          ...part,
          chordLines: getChordLines(part.chords),
          pattern: getChordPattern(part.chords),
        };
      }),
    [ctx.state.parts]
  );

  return { ...state, parts, dispatch };
}

export function useSongParts() {
  const song = useSong();
  return {
    currentPartId: song.currentPartUID,
    parts: song.parts,
  };
}

export function useChords() {
  const song = useSong();
  const editChord = (
    uid: string,
    chord: Partial<Chord>,
    change: 'durationChange' | 'positionChange'
  ) => {
    song.dispatch({ type: 'editChord', uid, chord, change });
  };
  return {
    editChord,
  };
}
