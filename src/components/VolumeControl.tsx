'use client';

import { useAudio } from './providers/AudioProvider';
import styles from './VolumeControl.module.css';

export const VolumeControl = () => {
  const { setVolume, volume } = useAudio();

  return (
    <div className={styles.VolumeControl}>
      <input
        type="range"
        value={volume}
        min={0.0}
        max={1.0}
        step={0.0001}
        onChange={(e) => {
          const val = parseFloat(e.target.value);
          if (!isNaN(val)) {
            const newVolume = Math.min(1.0, Math.max(0, val));
            setVolume(newVolume);
          }
        }}></input>
      {Math.round(volume * 100)}
    </div>
  );
};
