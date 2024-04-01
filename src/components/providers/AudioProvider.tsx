'use client';

import { AudioApi } from '@/helpers/audio';
import { formatChord } from '@/helpers/chord';
import { getMidiNotes } from '@/helpers/midi';
import { Chord, ChordDetails } from '@/types';
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

type AudioState = {
  resumeAudioContext: () => void;
} & (
  | {
      audioCtxLoaded: false;
    }
  | {
      audioCtx: AudioContext;
      audioCtxLoaded: true;
    }
);

const AudioStateContext = createContext<AudioState | undefined>(undefined);

export const AudioProvider = ({ children }: PropsWithChildren) => {
  const ctxRef = useRef<AudioContext | undefined>();
  const [audioCtxLoaded, setAudioCtxLoaded] = useState(false);

  const resumeAudioContext = () => {
    if (ctxRef.current) {
      ctxRef.current.resume();
    } else {
      ctxRef.current = new AudioContext();
    }
    setAudioCtxLoaded(true);
  };

  return (
    <AudioStateContext.Provider
      value={
        audioCtxLoaded
          ? { audioCtx: ctxRef.current!, audioCtxLoaded, resumeAudioContext }
          : { audioCtxLoaded: false, resumeAudioContext }
      }>
      {children}
    </AudioStateContext.Provider>
  );
};

export const useAudio = () => {
  const ctx = useContext(AudioStateContext);
  if (!ctx) {
    throw new Error('useAudio must be used inside an AudioProvider');
  }
  if (!ctx.audioCtxLoaded) {
    return {
      ...ctx,
      playChord: () => ctx.resumeAudioContext(),
    };
  }
  const { audioCtx } = ctx;
  const { playNote } = AudioApi(audioCtx);

  const playChord = (chord: ChordDetails) => {
    const midiNotes = getMidiNotes(chord);
    console.log(`\nCHORD ${formatChord(chord)}`);
    console.log(`NOTEs: ${midiNotes.map((n) => n.midi).join(',')}`);
    console.log(`FREQs:\n${midiNotes.map((n) => n.freq).join('\n')}`);
    for (const note of midiNotes) {
      playNote(note);
    }
  };

  return { audioCtx, playChord };
};
