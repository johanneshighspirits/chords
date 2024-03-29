'use client';

import { getRandomColor } from '@/helpers/color';
import { Part, getChordLines, getChordPattern } from '@/helpers/part';
import {
  Part as PartType,
  Chord,
  Song,
  Color,
  SongMeta,
  ChordDetails,
  Duration,
} from '@/types';
import {
  createContext,
  useContext,
  useReducer,
  PropsWithChildren,
  useMemo,
} from 'react';
// import { SongSaver } from './SongSaver';
import {
  Timing,
  getBarEnd,
  getNumberOfBeats,
  isTimingEarlier,
  moveChordBy,
  moveTiming,
} from '@/helpers/timing';
import { generateId } from '@/helpers/common';
import { saveToDB } from '@/db/actions';

type SongState = SongMeta & {
  currentSongUID: string;
  parts: PartType[];
  currentPartUID: string;
  colorsByPattern?: Record<string, Color>;
  position: Duration;
  pendingPosition: Duration | null;
};

type Action =
  | { type: 'openSong'; song: Song }
  | { type: 'updateChords'; chords: Chord[]; partId: string } // DB ✅
  // | { type: 'addChord'; chord: Chord; partId: string }
  // | { type: 'removeChord'; uid: string; partId: string }
  // | { type: 'removeChords'; chordIds: string[]; partId: string }
  | { type: 'addPart'; title?: string; chords?: Chord[] }
  | { type: 'removePart'; uid: string }
  | { type: 'setPartTitle'; title: string; partId: string }
  | { type: 'setPartColor'; color: Color; partId: string }
  | { type: 'setActivePart'; partId: string }
  | { type: 'setPendingPosition'; pendingPosition: Duration | null }
  | { type: 'setPosition'; position: Duration };
type Dispatch = (action: Action) => void;

const SongContext = createContext<
  { state: SongState; dispatch: Dispatch } | undefined
>(undefined);

function reducer(state: SongState, action: Action): SongState {
  switch (action.type) {
    case 'updateChords': {
      return {
        ...state,
        parts: state.parts.map((part) => {
          if (part.uid === action.partId) {
            return {
              ...part,
              chords: action.chords,
            };
          }
          return part;
        }),
      };
    }
    // case 'addChord': {
    //   return {
    //     ...state,
    //     parts: state.parts.map((part) => {
    //       if (part.uid === action.partId) {
    //         const beforeChords = part.chords.filter((c) =>
    //           isTimingEarlier(c.timing, action.chord.timing)
    //         );
    //         const afterChords = part.chords
    //           .filter(
    //             (c): c is Chord =>
    //               !isTimingEarlier(c.timing, action.chord.timing)
    //           )
    //           .map((c) => ({
    //             ...c,
    //             timing: moveTiming(
    //               c.timing,
    //               action.chord.timing.duration,
    //               'later'
    //             ),
    //           }));
    //         return {
    //           ...part,
    //           chords: [
    //             ...beforeChords,
    //             {
    //               ...action.chord,
    //             },
    //             ...afterChords,
    //           ],
    //         };
    //       }
    //       return part;
    //     }),
    //   };
    // }
    // case 'removeChord': {
    //   return {
    //     ...state,
    //     parts: state.parts.map((part) => {
    //       if (part.uid === action.partId) {
    //         const chordToRemoveIndex = part.chords.findIndex(
    //           (c) => c.uid === action.uid
    //         );
    //         const chordToRemove = part.chords[chordToRemoveIndex];
    //         const newChords = [
    //           ...part.chords.slice(0, chordToRemoveIndex),
    //           ...part.chords
    //             .slice(chordToRemoveIndex + 1)
    //             .map(moveChordBy(chordToRemove.timing.duration, 'earlier')),
    //         ];
    //         return {
    //           ...part,
    //           chords: newChords,
    //         };
    //       }
    //       return part;
    //     }),
    //   };
    // }
    case 'addPart': {
      const prevPart = state.parts[state.parts.length - 1];
      const prevTiming = prevPart ? prevPart.timing : Timing.init();
      const newPart = Part.new();
      return {
        ...state,
        parts: [
          ...state.parts,
          {
            ...newPart,
            title: `Part ${state.parts.length + 1}`,
            timing: Timing.init(prevTiming.offset + prevTiming.duration.bar),
          },
        ],
        currentPartUID: newPart.uid,
      };
    }
    case 'removePart': {
      const partToRemoveIndex = state.parts.findIndex(
        (p) => p.uid === action.uid
      );
      const currentPartUID =
        state.currentPartUID === action.uid
          ? state.parts[Math.max(0, partToRemoveIndex - 1)].uid
          : state.parts[0].uid;
      return {
        ...state,
        parts: state.parts.filter((part) => part.uid !== action.uid),
        currentPartUID,
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
    case 'setPartColor': {
      return {
        ...state,
        parts: state.parts.map((part) => {
          if (part.uid === action.partId) {
            return {
              ...part,
              color: action.color,
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
      const { uid, title, parts } = action.song;
      return {
        ...state,
        title,
        parts,
        currentSongUID: uid,
        currentPartUID: parts[parts.length - 1].uid,
      };
    }
    case 'setPosition': {
      return {
        ...state,
        position: action.position,
      };
    }
    case 'setPendingPosition': {
      return {
        ...state,
        pendingPosition: action.pendingPosition,
      };
    }
    default: {
      console.warn(`Action ${(action as any).type} not implemented yet`);
      return state;
    }
  }
}

const emptyState = (): SongState => {
  const newPart = Part.new([]);
  return {
    currentSongUID: generateId(),
    currentPartUID: newPart.uid,
    uid: generateId(),
    slug: '',
    title: 'New Song',
    artist: 'Artist',
    artistSlug: 'artist',
    parts: [newPart],
    position: { bar: 0, beat: 0 },
    pendingPosition: null,
  };
};

export const SongProvider = ({
  initialSong,
  children,
}: PropsWithChildren<{ initialSong?: Song }>) => {
  const [state, dispatch] = useReducer(
    reducer,
    initialSong
      ? {
          ...emptyState(),
          ...initialSong,
          currentPartUID: initialSong.parts[0]?.uid ?? '',
        }
      : emptyState()
  );
  const value = {
    state,
    dispatch,
  };
  // console.log('----');
  // state.parts.forEach((part) => {
  //   console.log(part.timing);
  //   part.chords.forEach((chord) => {
  //     console.table({ timing: chord.note, ...chord.timing });
  //   });
  // });
  return (
    <SongContext.Provider value={value}>
      {/* <SongSaver /> */}
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
  const {
    currentSongUID,
    currentPartUID,
    parts,
    position: playheadPosition,
    dispatch,
  } = useSong();

  const addChord = (chordDetails: ChordDetails) => {
    const part = parts.find((p) => p.uid === currentPartUID);
    if (!part) {
      throw new Error('No active part selected');
    }
    const beatOffset = playheadPosition.beat % 4;
    const duration = {
      bar: beatOffset > 0 ? 0 : 1,
      beat: beatOffset > 0 ? 4 - beatOffset : 0,
    };
    const position = {
      ...playheadPosition,
    };
    const chord: Chord = {
      ...chordDetails,
      uid: generateId(),
      timing: {
        duration,
        position,
        offset: 0,
      },
    };
    const beforeChords = part.chords.filter((c) =>
      isTimingEarlier(c.timing, chord.timing)
    );
    const afterChords = part.chords
      .filter((c): c is Chord => !isTimingEarlier(c.timing, chord.timing))
      .map((c) => ({
        ...c,
        timing: moveTiming(c.timing, chord.timing.duration, 'later'),
      }));

    const chords = [...beforeChords, chord, ...afterChords];
    dispatch({ type: 'updateChords', chords, partId: currentPartUID });
    dispatch({ type: 'setPosition', position: getBarEnd(chord.timing) });
    saveToDB('upsertChords', {
      songId: currentSongUID,
      part,
      entries: [chord, ...afterChords],
    });
    return chord;
  };

  const duplicateChords = (
    partId: string,
    chordsToDuplicate: Chord[],
    afterChordId: string
  ) => {
    const part = parts.find((p) => p.uid === partId);
    if (part) {
      const index =
        part.chords.findIndex((c) => c.uid === afterChordId) ||
        part.chords.length;
      const newChords = chordsToDuplicate.map((chord) => ({
        ...chord,
        uid: generateId(),
        timing: moveTiming(
          chord.timing,
          {
            bar: 4,
            beat: 0,
          },
          'later'
        ),
      }));

      const modifiedChords = part.chords
        .slice(index + 1)
        .map(moveChordBy({ bar: 4, beat: 0 }, 'later'));

      const chords = [
        ...part.chords.slice(0, index + 1),
        ...newChords,
        ...modifiedChords,
      ];

      dispatch({
        type: 'updateChords',
        partId: part.uid,
        chords,
      });
      const lastChord = newChords.at(-1);
      if (lastChord) {
        dispatch({
          type: 'setPosition',
          position: getBarEnd(lastChord.timing),
        });
      }
      saveToDB('upsertChords', {
        songId: currentSongUID,
        part,
        entries: [...newChords, ...modifiedChords],
      });

      return { newChords, modifiedChords };
    }
  };

  const editChord = (
    uid: string,
    chord: Partial<Chord>,
    change: 'durationChange' | 'positionChange'
  ): Chord | undefined => {
    const part = parts.find((p) => p.chords.some((c) => c.uid === uid));
    if (part) {
      const newChord = modifyChord(uid, chord, change, part.chords);
      if (newChord) {
        const chords = [
          ...part.chords.slice(0, newChord.chordIndex),
          newChord.modifiedChord,
          ...part.chords.slice(newChord.chordIndex + 1),
        ];
        dispatch({
          type: 'updateChords',
          partId: part.uid,
          chords,
        });
        saveToDB('upsertChords', {
          songId: currentSongUID,
          part,
          entries: [newChord.modifiedChord],
        });

        return newChord.modifiedChord;
      }
    }
  };

  const removeChords = (
    chordIds: string[],
    partId: string
  ): Chord[] | undefined => {
    const part = parts.find((p) => p.uid === partId);
    if (part) {
      let newChords = [...part.chords];
      for (const chordId of chordIds) {
        const chordToRemoveIndex = newChords.findIndex(
          (c) => c.uid === chordId
        );
        const chordToRemove = newChords[chordToRemoveIndex];
        newChords = [
          ...newChords.slice(0, chordToRemoveIndex),
          ...newChords
            .slice(chordToRemoveIndex + 1)
            .map(moveChordBy(chordToRemove.timing.duration, 'earlier')),
        ];
      }
      dispatch({
        type: 'updateChords',
        partId: part.uid,
        chords: newChords,
      });
      saveToDB('upsertChords', {
        songId: currentSongUID,
        part,
        entries: newChords,
        removedEntryUids: chordIds,
      });
      return newChords;
    }
  };

  return {
    currentPartUID,
    addChord,
    editChord,
    duplicateChords,
    removeChords,
  };
}

const modifyChord = (
  uid: string,
  chord: Partial<Chord>,
  change: 'durationChange' | 'positionChange',
  chords: Chord[]
) => {
  const chordIndex = chords.findIndex((chord) => chord.uid === uid);
  if (chordIndex > -1) {
    const oldChord = chords[chordIndex];
    const newChord: Chord = {
      ...oldChord,
      ...chord,
    };
    switch (change) {
      case 'durationChange': {
        const durationChange =
          getNumberOfBeats(newChord.timing.duration) -
          getNumberOfBeats(oldChord.timing.duration);
        console.log('duration change in beats', durationChange);
      }
      case 'positionChange': {
        const positionChange =
          getNumberOfBeats(newChord.timing.position) -
          getNumberOfBeats(oldChord.timing.position);
        console.log('position change in beats', positionChange);
      }
    }
    return {
      modifiedChord: newChord,
      chordIndex,
    };
  }
};

export function usePlayhead() {
  const { currentPartUID, position, pendingPosition, dispatch } = useSong();

  const setPosition = (position: Duration) => {
    dispatch({ type: 'setPosition', position });
  };
  const setPendingPosition = (pendingPosition: Duration | null) => {
    dispatch({ type: 'setPendingPosition', pendingPosition });
  };

  return {
    currentPartUID,
    position,
    pendingPosition,
    setPendingPosition,
    setPosition,
  };
}
