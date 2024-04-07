import { MidiNote } from './midi';

type PlayNoteOptions = { type?: OscillatorType; volume?: number };

export const AudioApi = (ctx: AudioContext) => {
  const playNote = (
    tone: MidiNote,
    options?: PlayNoteOptions
  ): Promise<boolean> => {
    return new Promise((res) => {
      const osc = ctx.createOscillator();
      osc.type = options?.type ?? 'triangle';
      osc.frequency.setValueAtTime(tone.freq, ctx.currentTime);

      const gain = ctx.createGain();
      const requestedVolume = options?.volume ?? 0.5;
      gain.gain.value = requestedVolume;

      const compressor = ctx.createDynamicsCompressor();
      compressor.ratio.value = 12;
      compressor.threshold.value = -50;
      compressor.attack.value = 0;
      compressor.release.value = 0.5;
      compressor.knee.value = 40;

      osc.connect(compressor).connect(gain).connect(ctx.destination);

      osc.start();
      gain.gain.setTargetAtTime(0.01, ctx.currentTime + 0.1, 0.5);

      setTimeout(() => {
        osc.stop();
        res(true);
      }, 1500);
    });
  };
  return {
    playNote,
  };
};
