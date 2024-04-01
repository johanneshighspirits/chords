import { MidiNote } from './midi';

type PlayNoteOptions = { type?: OscillatorType; volume?: number };

export const AudioApi = (ctx: AudioContext) => {
  const playNote = (tone: MidiNote, options?: PlayNoteOptions) => {
    const osc = ctx.createOscillator();
    osc.type = options?.type ?? 'triangle';
    osc.frequency.setValueAtTime(tone.freq, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.value = options?.volume ?? 0.5;

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();

    gain.gain.setTargetAtTime(0.01, ctx.currentTime + 0.1, 0.5);

    setTimeout(() => {
      osc.stop();
    }, 1500);
  };
  return {
    playNote,
  };
};
