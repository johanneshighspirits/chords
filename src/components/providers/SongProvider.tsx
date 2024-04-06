'use client';

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
import {
  Timing,
  addDurations,
  calculateOffset,
  getBarEnd,
  getCurrentPart,
  getNumberOfBeats,
  getPartEnd,
  getPartLength,
  getPositionFromBeats,
  isTimingEarlier,
  moveChordBy,
  moveTiming,
} from '@/helpers/timing';
import { generateId } from '@/helpers/common';
import { useDB } from './DBProvider';

type SongState = SongMeta & {
  currentSongUID: string;
  parts: PartType[];
  currentPart: PartType;
  colorsByPattern?: Record<string, Color>;
  masterPosition: Duration;
  pendingPosition: Duration | null;
};

type Action =
  | { type: 'openSong'; song: Song }
  | { type: 'updateChords'; chords: Chord[]; partId: string } // DB ✅
  | { type: 'updateParts'; parts: PartType[] } // DB ✅
  // | { type: 'addChord'; chord: Chord; partId: string }
  // | { type: 'removeChord'; uid: string; partId: string }
  // | { type: 'removeChords'; chordIds: string[]; partId: string }
  | { type: 'addPart'; part: PartType }
  | { type: 'removePart'; uid: string }
  | { type: 'setPartTitle'; title: string; partId: string }
  | { type: 'setPartColor'; color: Color; partId: string }
  | { type: 'setPendingPosition'; pendingPosition: Duration | null }
  | { type: 'setMasterPosition'; position: Duration; partId: string };
type Dispatch = (action: Action) => void;

const SongContext = createContext<
  { state: SongState; dispatch: Dispatch } | undefined
>(undefined);

function reducer(state: SongState, action: Action): SongState {
  switch (action.type) {
    case 'updateChords': {
      return {
        ...state,
        parts: calculateOffset(
          state.parts.map((part) => {
            if (part.uid === action.partId) {
              return {
                ...part,
                chords: action.chords,
              };
            }
            return part;
          })
        ),
      };
    }
    case 'updateParts': {
      return {
        ...state,
        parts: calculateOffset([...action.parts]),
      };
    }
    case 'addPart': {
      return {
        ...state,
        parts: calculateOffset([...state.parts, action.part]),
        masterPosition: {
          bar: 0,
          beat: 0,
        },
      };
    }
    case 'removePart': {
      return {
        ...state,
        parts: calculateOffset(
          state.parts.filter((part) => part.uid !== action.uid)
        ),
      };
    }
    case 'setPartTitle': {
      return {
        ...state,
        parts: calculateOffset(
          state.parts.map((part) => {
            if (part.uid === action.partId) {
              return {
                ...part,
                title: action.title,
              };
            }
            return part;
          })
        ),
      };
    }
    case 'setPartColor': {
      return {
        ...state,
        parts: calculateOffset(
          state.parts.map((part) => {
            if (part.uid === action.partId) {
              return {
                ...part,
                color: action.color,
              };
            }
            return part;
          })
        ),
      };
    }
    case 'openSong': {
      const { uid, title } = action.song;
      const parts = calculateOffset(action.song.parts);
      const masterPosition = Timing.init().position;

      return {
        ...state,
        title,
        parts,
        currentSongUID: uid,
        currentPart: parts[0],
        masterPosition,
      };
    }
    case 'setMasterPosition': {
      // const currentPart = getCurrentPart(state.parts, action.position);
      const currentPart =
        state.parts.find((p) => p.uid === action.partId) ??
        getCurrentPart(state.parts, action.position);

      return {
        ...state,
        masterPosition: action.position,
        currentPart,
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
    uid: generateId(),
    slug: '',
    title: 'New Song',
    artist: 'Artist',
    artistSlug: 'artist',
    parts: [newPart],
    currentPart: newPart,
    masterPosition: Timing.init().position,
    pendingPosition: null,
  };
};

export const SongProvider = ({
  initialSong,
  children,
}: PropsWithChildren<{ initialSong?: Song }>) => {
  const defaultState = emptyState();
  const parts = calculateOffset(initialSong?.parts || []);

  const [state, dispatch] = useReducer(
    reducer,
    initialSong
      ? {
          ...defaultState,
          ...initialSong,
          parts,
          currentSongUID: initialSong?.uid ?? '',
          currentPart: parts[0] ?? defaultState.currentPart,
          masterPosition: Timing.init().position,
        }
      : emptyState()
  );
  const value = {
    state,
    dispatch,
  };

  return <SongContext.Provider value={value}>{children}</SongContext.Provider>;
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
  const { parts, currentPart, currentSongUID, dispatch } = useSong();
  const { addToQueue } = useDB();

  const addPart = async (part: PartType) => {
    dispatch({ type: 'addPart', part });
    addToQueue([
      {
        action: 'upsertParts',
        songId: currentSongUID,
        entries: [part],
      },
    ]);
  };

  const movePart = (direction: 'before' | 'after', partId: string) => {
    const currentIndex = parts.findIndex((p) => p.uid === partId);
    if (currentIndex === -1) {
      return;
    }
    const part = parts.find((p) => p.uid === partId);
    if (!part) {
      return;
    }
    const targetIndex = currentIndex + (direction === 'before' ? -1 : 2);
    const newParts = [
      ...parts.slice(0, targetIndex).filter((p) => p.uid !== partId),
      part,
      ...parts.slice(targetIndex).filter((p) => p.uid !== partId),
    ].map((part, index) => ({ ...part, index }));

    dispatch({ type: 'updateParts', parts: newParts });
    addToQueue([
      {
        action: 'upsertParts',
        songId: currentSongUID,
        entries: newParts,
      },
    ]);
  };

  const setPartTitle = (part: PartType, title: string) => {
    dispatch({ type: 'setPartTitle', title, partId: part.uid });
    addToQueue([
      {
        action: 'upsertParts',
        songId: currentSongUID,
        entries: [{ ...part, title }],
      },
    ]);
  };

  const removePart = (uid: string) => {
    dispatch({ type: 'removePart', uid });
    addToQueue([
      {
        action: 'upsertParts',
        songId: currentSongUID,
        entries: [],
        removedEntryUids: [uid],
      },
    ]);
  };
  return {
    currentPart,
    parts,
    addPart,
    movePart,
    removePart,
    setPartTitle,
  };
}

export function useChords() {
  const {
    currentSongUID,
    currentPart,
    parts,
    masterPosition: playheadPosition,
    dispatch,
  } = useSong();
  const { addToQueue } = useDB();

  const addChord = (chordDetails: ChordDetails) => {
    const barOffset = playheadPosition.beat % 4;
    const duration = {
      bar: barOffset > 0 ? 0 : 1,
      beat: barOffset > 0 ? 4 - barOffset : 0,
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
    const beforeChords = currentPart.chords.filter((c) =>
      isTimingEarlier(c.timing, chord.timing)
    );
    const afterChords = currentPart.chords
      .filter((c): c is Chord => !isTimingEarlier(c.timing, chord.timing))
      .map((c) => ({
        ...c,
        timing: moveTiming(c.timing, chord.timing.duration, 'later'),
      }));

    const chords = [...beforeChords, chord, ...afterChords];
    dispatch({ type: 'updateChords', chords, partId: currentPart.uid });
    dispatch({
      type: 'setMasterPosition',
      position: getBarEnd(chord.timing),
      partId: currentPart.uid,
    });
    addToQueue([
      {
        action: 'upsertChords',
        songId: currentSongUID,
        part: currentPart,
        entries: [chord, ...afterChords],
      },
    ]);
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
          type: 'setMasterPosition',
          position: getBarEnd(lastChord.timing),
          partId: part.uid,
        });
      }
      addToQueue([
        {
          action: 'upsertChords',
          songId: currentSongUID,
          part,
          entries: [...newChords, ...modifiedChords],
        },
      ]);

      return { newChords, modifiedChords };
    }
  };

  const editChord = (
    uid: string,
    chord: Partial<Chord>,
    change: 'durationChange' | 'positionChange' | 'chordChange'
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
        addToQueue([
          {
            action: 'upsertChords',
            songId: currentSongUID,
            part,
            entries: [newChord.modifiedChord],
          },
        ]);

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
      addToQueue([
        {
          action: 'upsertChords',
          songId: currentSongUID,
          part,
          entries: newChords,
          removedEntryUids: chordIds,
        },
      ]);
      return newChords;
    }
  };

  return {
    addChord,
    editChord,
    duplicateChords,
    removeChords,
  };
}

const modifyChord = (
  uid: string,
  chord: Partial<Chord>,
  change: 'durationChange' | 'positionChange' | 'chordChange',
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
      case 'chordChange': {
        console.log('Changing chord from', oldChord, newChord);
      }
    }
    return {
      modifiedChord: newChord,
      chordIndex,
    };
  }
};

export function usePlayhead() {
  const ctx = useContext(SongContext);
  if (!ctx) {
    throw new Error('No context');
  }
  const {
    state: { currentPart, masterPosition, pendingPosition },
    dispatch,
  } = ctx;

  const setPosition = (position: Duration, partId: string) => {
    dispatch({ type: 'setMasterPosition', position, partId });
  };
  const setPendingPosition = (pendingPosition: Duration | null) => {
    dispatch({ type: 'setPendingPosition', pendingPosition });
  };

  return {
    currentPart,
    masterPosition,
    pendingPosition,
    setPendingPosition,
    setPosition,
  };
}
