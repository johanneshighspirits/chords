'use client';

import { Duration } from '@/types';
import styles from './Display.module.css';
import { useMasterPosition } from './providers/SongProvider';
import clsx from 'clsx';
import { colorToCssVars } from '@/helpers/color';
import { Editable } from './Editable';

export const Display = () => {
  const { masterPosition, setPosition, currentPart } = useMasterPosition();
  return (
    <div
      style={colorToCssVars(currentPart.color, 'title-bg')}
      className={styles.Display}>
      <Editable
        onEdit={(e) => {
          const [bar, beat, zero] = e
            .split('.')
            .map((digit) => (digit?.trim() ? parseInt(digit, 10) : 0));
          if (!isNaN(bar)) {
            setPosition({ bar, beat: !isNaN(beat) ? beat : 0 });
          }
        }}>
        <FormattedDuration duration={masterPosition} />
      </Editable>
      <span className={styles.PartTitle}>{currentPart.title}</span>
    </div>
  );
};

export const FormattedPosition = ({
  position: { bar, beat },
  ...props
}: {
  position: Duration;
  className?: string;
}) => {
  return <Formatted duration={{ bar: bar + 1, beat: beat + 1 }} {...props} />;
};

export const FormattedDuration = (props: {
  duration: Duration;
  className?: string;
}) => {
  return <Formatted {...props} />;
};

export const Formatted = ({
  duration,
  className,
}: {
  duration: Duration;
  className?: string;
}) => {
  return (
    <span className={clsx(styles.Display, className)}>
      {duration.bar}.{duration.beat}.0
    </span>
  );
};
