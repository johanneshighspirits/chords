'use client';

import { EditableDialog } from './EditableDialog';
import { Chord } from '@/types';
import styles from './chords.module.css';
import { FormattedDuration } from './Display';
import { useChords } from './providers/SongProvider';

export const EditDuration = ({ chord }: { chord: Chord }) => {
  const { editChord } = useChords();
  const onEdit = (value: string[]) => {
    editChord(
      chord.uid,
      {
        timing: {
          ...chord.timing,
          duration: {
            bar: parseInt(value[0]),
            beat: parseInt(value[1]),
          },
        },
      },
      'durationChange'
    );
  };
  const { bar, beat } = chord.timing.duration;
  return (
    <EditableDialog
      onEdit={onEdit}
      defaultValue={[bar.toString(10), beat.toString(10)]}>
      <div className={styles.info}>
        <span className={styles.timingLabel}>Duration</span>
        <FormattedDuration
          className={styles.timing}
          duration={chord.timing.duration}
        />
      </div>
    </EditableDialog>
  );
};
