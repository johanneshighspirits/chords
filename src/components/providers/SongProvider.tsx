'use client';

import { getRandomColor } from '@/helpers/color';
import { getChordLines, getChordPattern } from '@/helpers/part';
import { Part, Chord, Song, Color, SongMeta } from '@/types';
import {
  createContext,
  useContext,
  useReducer,
  PropsWithChildren,
  useMemo,
} from 'react';
import { SongSaver } from './SongSaver';

type SongState = SongMeta & {
  parts: Part[];
  currentPartId?: string;
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
  | { type: 'editChord'; id: string; chord: Partial<Chord> }
  | { type: 'removeChord'; id: string; partId: string }
  | { type: 'removeChords'; chordIds: string[]; partId: string }
  | { type: 'addPart'; title?: string; chords?: Chord[] }
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
        const id = crypto.randomUUID().substring(0, 4);
        const chords = [action.chord];
        const color = getRandomColor();
        const pattern = getChordPattern(chords);
        const colorsByPattern = {
          [pattern]: color,
        };
        const newPart = {
          id,
          color,
          title: 'New Part',
          chords,
        };

        return {
          ...state,
          colorsByPattern,
          parts: [newPart],
          currentPartId: id,
        };
      }
      const currentPartId =
        action.partId || state.currentPartId || state.parts[0]?.id;
      return {
        ...state,
        parts: state.parts.map((part) => {
          if (part.id === currentPartId) {
            return {
              ...part,
              chords: [...part.chords, action.chord],
            };
          }
          return part;
        }),
        currentPartId,
      };
    }
    case 'addChords': {
      return {
        ...state,
        parts: state.parts.map((part) => {
          if (part.id === action.partId) {
            const index =
              part.chords.findIndex((c) => c.id === action.afterChordId) ||
              part.chords.length;
            const newChords = [
              ...part.chords.slice(0, index + 1),
              ...action.chords.map((chord) => ({
                ...chord,
                id: chord.id + 'x',
              })),
              ...part.chords.slice(index + 1),
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
          return {
            ...part,
            chords: part.chords.map((chord) => {
              if (chord.id === action.id) {
                return {
                  ...chord,
                  ...action.chord,
                };
              }
              return chord;
            }),
          };
        }),
      };
    }
    case 'removeChord': {
      return {
        ...state,
        parts: state.parts.map((part) => {
          if (part.id === action.partId) {
            return {
              ...part,
              chords: part.chords.filter((c) => c.id !== action.id),
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
          if (part.id === action.partId) {
            return {
              ...part,
              chords: part.chords.filter(
                (c) => !action.chordIds.includes(c.id)
              ),
            };
          }
          return part;
        }),
      };
    }
    case 'addPart': {
      return {
        ...state,
        parts: [
          ...state.parts,
          {
            id: crypto.randomUUID().slice(0, 8),
            title: `Part ${state.parts.length + 1}`,
            chords: [],
            color: getRandomColor(),
          },
        ],
      };
    }
    case 'setPartTitle': {
      return {
        ...state,
        parts: state.parts.map((part) => {
          if (part.id === action.partId) {
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
        currentPartId: action.partId,
      };
    }
    case 'openSong': {
      const { title, parts } = action.song;
      return {
        ...state,
        title,
        parts,
        currentPartId: parts[parts.length - 1].id,
      };
    }
    default: {
      console.warn(`Action ${(action as any).type} not implemented yet`);
      return state;
    }
  }
}

const emptyState: SongState = {
  id: '',
  slug: '',
  title: 'New Song',
  parts: [],
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
  // state.parts.forEach((part) => {
  //   console.log(getChordPattern(part.chords));
  //   console.log(getChordLines(part.chords));
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
    currentPartId: song.currentPartId,
    parts: song.parts,
  };
}

export function useChords() {
  const song = useSong();
  const editChord = (id: string, chord: Partial<Chord>) => {
    song.dispatch({ type: 'editChord', id, chord });
  };
  return {
    editChord,
  };
}
