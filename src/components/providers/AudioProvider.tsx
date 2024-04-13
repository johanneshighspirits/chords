'use client';

import { AudioApi } from '@/helpers/audio';
import { formatChord } from '@/helpers/chord';
import { getMidiNotes } from '@/helpers/midi';
import { Chord, ChordDetails } from '@/types';
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type AudioState = {
  resumeAudioContext: () => void;
  volume: number;
  setVolume: Dispatch<SetStateAction<number>>;
  setOscillatorType: Dispatch<SetStateAction<OscillatorType>>;
  playingChords: Set<string>;
  setPlayingChords: Dispatch<SetStateAction<Set<string>>>;
  oscillatorType: OscillatorType;
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
  const [volume, setVolume] = useState(0.5);
  const [oscillatorType, setOscillatorType] =
    useState<OscillatorType>('triangle');
  const [playingChords, setPlayingChords] = useState<Set<string>>(new Set());
  const resumeAudioContext = () => {
    if (ctxRef.current) {
      ctxRef.current.resume();
    } else {
      ctxRef.current = new AudioContext();
    }
    setAudioCtxLoaded(true);
  };

  const value = useMemo<AudioState>(() => {
    const common = {
      volume,
      setVolume,
      oscillatorType,
      setOscillatorType,
      resumeAudioContext,
      playingChords,
      setPlayingChords,
    };
    return audioCtxLoaded
      ? { ...common, audioCtx: ctxRef.current!, audioCtxLoaded: true }
      : { ...common, audioCtxLoaded: false };
  }, [audioCtxLoaded, volume, oscillatorType, playingChords]);

  return (
    <AudioStateContext.Provider value={value}>
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
      playChord: async () => ctx.resumeAudioContext(),
    };
  }
  const {
    audioCtx,
    volume,
    oscillatorType,
    setVolume,
    setOscillatorType,
    playingChords,
    setPlayingChords,
  } = ctx;
  const { playNote } = AudioApi(audioCtx);

  const playChord = async (chord: Chord) => {
    const midiNotes = getMidiNotes(chord);
    setPlayingChords((state) => {
      state.add(chord.uid);
      return new Set(state);
    });
    await Promise.all(
      midiNotes.map((note) => playNote(note, { volume, type: oscillatorType }))
    );
    setPlayingChords((state) => {
      state.delete(chord.uid);
      return new Set(state);
    });
  };

  return {
    audioCtx,
    playChord,
    volume,
    setVolume,
    oscillatorType,
    setOscillatorType,
    playingChords,
  };
};
