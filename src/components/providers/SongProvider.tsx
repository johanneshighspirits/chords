'use client';

import { Part, Chord } from '@/types';
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
};

type Action =
  | { type: 'addChord'; chord: Chord; partId?: string }
  | { type: 'addPart'; title?: string; chords?: Chord[] }
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
        return {
          ...state,
          parts: [
            {
              id,
              color: {
                h: Math.round(Math.random() * 360),
                s: Math.round(Math.random() * 100),
                l: Math.round(Math.random() * 100),
              },
              title: 'New Part',
              chords: [action.chord],
            },
          ],
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
    case 'addPart': {
      return {
        ...state,
      };
    }
    case 'setActivePart': {
      return {
        ...state,
        currentPartId: action.partId,
      };
    }
    default: {
      console.warn(`Action ${(action as any).type} not implemented yet`);
      return state;
    }
  }
}

const initialState: SongState = {
  title: 'New song',
  parts: [
    {
      id: 'p-1',
      title: 'Part one',
      color: {
        h: 140,
        s: 30,
        l: 30,
      },

      chords: [
        {
          id: 'c-1',
          display: 'F#m',
        },
        {
          id: 'c-2',
          display: 'A',
        },
        {
          id: 'c-3',
          display: 'D7',
        },
      ],
    },
    {
      id: 'p-1-2',
      title: 'Part two',
      color: {
        h: 200,
        s: 34,
        l: 30,
      },
      chords: [
        {
          id: 'c-1-2',
          display: 'F#m',
        },
        {
          id: 'c-2-2',
          display: 'A',
        },
        {
          id: 'c-3-2',
          display: 'D7',
        },
        {
          id: 'c-4-2',
          display: 'A',
        },
        {
          id: 'c-5-2',
          display: 'D7',
        },
        {
          id: 'c-6-2',
          display: 'A',
        },
        {
          id: 'c-7-2',
          display: 'D7',
        },
      ],
    },
  ],
};

export const SongProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, initialState);
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

  return ctx;
}

export function useSongParts() {
  const song = useSong();
  return {
    currentPartId: song.state.currentPartId,
    parts: song.state.parts,
  };
}
