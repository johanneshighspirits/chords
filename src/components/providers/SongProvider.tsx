'use client';

import { getRandomColor } from '@/helpers/color';
import { getChordLines, getChordPattern } from '@/helpers/part';
import { Part, Chord, Song, Color } from '@/types';
import {
  createContext,
  useContext,
  useReducer,
  PropsWithChildren,
} from 'react';

type SongState = {
  title: string;
  parts: Part[];
  currentPartId?: string;
  colorsByPattern?: Record<string, Color>;
};

type Action =
  | { type: 'openSong'; song: Song }
  | { type: 'addChord'; chord: Chord; partId?: string }
  | { type: 'removeChord'; id: string; partId: string }
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
        const colorsByPattern = {
          [getChordPattern(chords)]: color,
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

  return <SongContext.Provider value={value}>{children}</SongContext.Provider>;
};

export function useSong() {
  const ctx = useContext(SongContext);
  if (!ctx) {
    throw new Error('useSong must be used within a SongContext Provider');
  }

  return ctx;
}

export function useSongParts() {
  const song = useSong();
  return {
    currentPartId: song.state.currentPartId,
    parts: song.state.parts,
  };
}
