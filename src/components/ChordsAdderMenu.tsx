import clsx from 'clsx';
import { AddChord } from './AddChord';
import { AddPart } from './AddPart';
import styles from './ChordsAdderMenu.module.css';
import { Container } from './layout/PageContainer';
import { Display } from './Display';
import { StickyMenuProvider } from './providers/StickyMenuProvider';
import { VolumeControl } from './VolumeControl';

export const ChordsAdderMenu = () => {
  return (
    <StickyMenuProvider
      className={clsx('print-hidden', styles.ChordsAdderMenu)}
      classNameIsStuck={styles.IsStuck}
      classNameNotStuck={styles.NotStuck}>
      <Container className={styles.ChordsAdder}>
        <Display className="mobile-hidden" />
        <AddChord />
        <VolumeControl />
        <AddPart className="mobile-hidden" />
      </Container>
    </StickyMenuProvider>
  );
};
