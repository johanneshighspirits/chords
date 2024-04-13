'use client';

import { EditableDialog } from './EditableDialog';
import { Chord } from '@/types';
import styles from './chords.module.css';
import { FormattedPosition } from './Display';
import { useChords } from './providers/SongProvider';

export const EditPosition = ({ chord }: { chord: Chord }) => {
  const { editChord } = useChords();
  const onEdit = (value: string[]) => {
    editChord(
      chord.uid,
      {
        timing: {
          ...chord.timing,
          position: {
            bar: parseInt(value[0]) - 1,
            beat: parseInt(value[1]) - 1,
          },
        },
      },
      'positionChange'
    );
  };
  const { bar, beat } = chord.timing.position;
  return (
    <EditableDialog
      onEdit={onEdit}
      defaultValue={[(bar + 1).toString(10), (beat + 1).toString(10)]}>
      <div className={styles.info}>
        <span className={styles.timingLabel}>Position</span>
        <FormattedPosition
          className={styles.timing}
          position={chord.timing.position}
        />
      </div>
    </EditableDialog>
  );
};
