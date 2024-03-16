import { FormEventHandler, PropsWithChildren, useRef } from 'react';
import styles from './Editable.module.css';

export const Editable = ({
  onEdit,
  children,
}: PropsWithChildren<{ onEdit: (value: string) => void }>) => {
  const ref = useRef<HTMLSpanElement | null>(null);

  const handleBlur: FormEventHandler<HTMLSpanElement> = () => {
    const text = ref.current?.innerText;
    onEdit(text ?? '');
    ref.current?.blur();
  };

  return (
    <span
      className={styles.Editable}
      ref={ref}
      contentEditable={true}
      suppressContentEditableWarning={true}
      onBlur={handleBlur}>
      {children}
    </span>
  );
};
