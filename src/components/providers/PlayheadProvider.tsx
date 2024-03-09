'use client';

import { Duration } from '@/types';
import {
  createContext,
  Dispatch,
  SetStateAction,
  PropsWithChildren,
  useState,
  useContext,
} from 'react';
import { useSong } from './SongProvider';
import { Debug } from '../debug/Debug';

type Context = {
  currentPartId?: string;
  position: Duration;
  setPosition: Dispatch<SetStateAction<Duration>>;
};
const PlayheadContext = createContext<Context | undefined>(undefined);

export const PlayheadProvider = ({ children }: PropsWithChildren) => {
  const [position, setPosition] = useState<Duration>({ bar: 0, beat: 0 });
  const { currentPartId } = useSong();
  const value = {
    currentPartId,
    position,
    setPosition,
  };
  return (
    <PlayheadContext.Provider value={value}>
      {/* <Debug>{JSON.stringify(position, null, 2)}</Debug> */}
      {children}
    </PlayheadContext.Provider>
  );
};

export const usePlayhead = () => {
  const ctx = useContext(PlayheadContext);
  if (!ctx) {
    throw new Error('No PlayheadProvider');
  }
  return ctx;
};
