'use client';

import { Duration } from '@/types';
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

type PendingPositionState = {
  pendingPosition: Duration | null;
  setPendingPosition: Dispatch<SetStateAction<Duration | null>>;
};

const PendingPositionContext = createContext<PendingPositionState | undefined>(
  undefined
);

export const PendingPositionProvider = ({ children }: PropsWithChildren) => {
  const [pendingPosition, setPendingPosition] = useState<Duration | null>(null);
  const value = {
    pendingPosition,
    setPendingPosition,
  };
  return (
    <PendingPositionContext.Provider value={value}>
      {children}
    </PendingPositionContext.Provider>
  );
};

export const usePendingPosition = () => {
  const ctx = useContext(PendingPositionContext);
  if (!ctx) {
    throw new Error(
      'usePendingPosition must be used inside a PendingPositionProvider'
    );
  }

  return ctx;
};
