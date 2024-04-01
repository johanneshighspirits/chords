import clsx from 'clsx';
import { AddChord } from './AddChord';
import { AddPart } from './AddPart';
import styles from './ChordsAdder.module.css';
import { Container } from './layout/PageContainer';
import { Display } from './Display';
import { StickyMenuProvider } from './providers/StickyMenuProvider';
import { VolumeControl } from './VolumeControl';

export const ChordsAdder = () => {
  return (
    <StickyMenuProvider
      className={clsx('print-hidden', styles.ChordsAdderMenu)}
      classNameIsStuck={styles.IsStuck}
      classNameNotStuck={styles.NotStuck}>
      <Container className={styles.ChordsAdder}>
        <Display />
        <AddChord />
        <VolumeControl />
        <AddPart />
      </Container>
    </StickyMenuProvider>
  );
};
