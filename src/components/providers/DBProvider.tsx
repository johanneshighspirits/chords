'use client';

import { DBActionPayload, saveToDB } from '@/db/actions';
import {
  PropsWithChildren,
  createContext,
  useContext,
  useRef,
  useState,
} from 'react';

type DBState = {
  addToQueue: (payload: DBActionPayload[]) => void;
};

const DBContext = createContext<DBState | undefined>(undefined);

export const DBProvider = ({ children }: PropsWithChildren) => {
  const timerRef = useRef<NodeJS.Timeout | undefined>();
  const queue = useRef<DBActionPayload[]>([]);

  const updateDB = () => {
    console.log('emptying Q', queue.current);
    if (queue.current.length) {
      clearTimeout(timerRef.current);
      saveToDB(queue.current).then(() => {
        queue.current = [];
      });
    }
  };

  const addToQueue = (payload: DBActionPayload[]) => {
    console.log('adding to Q', payload);
    clearTimeout(timerRef.current);
    queue.current.push(...payload);
    timerRef.current = setTimeout(updateDB, 3000);
  };

  const value = {
    addToQueue,
  };

  return <DBContext.Provider value={value}>{children}</DBContext.Provider>;
};

export const useDB = () => {
  const ctx = useContext(DBContext);
  if (!ctx) {
    throw new Error('Must be inside DBProvider');
  }
  return { addToQueue: ctx.addToQueue };
};
