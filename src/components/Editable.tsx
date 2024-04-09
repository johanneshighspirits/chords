import {
  FormEventHandler,
  KeyboardEventHandler,
  PropsWithChildren,
  useRef,
} from 'react';
import styles from './Editable.module.css';

export const Editable = ({
  onEdit,
  children,
}: PropsWithChildren<{ onEdit: (value: string) => void }>) => {
  const ref = useRef<HTMLSpanElement | null>(null);

  const handleKeyDown: KeyboardEventHandler<HTMLSpanElement> = (e) => {
    if (e.key === 'Enter') {
      const text = ref.current?.innerText;
      onEdit(text ?? '');
      ref.current?.blur();
      e.stopPropagation();
    }
  };

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
      onClick={(e) => e.stopPropagation()}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}>
      {children}
    </span>
  );
};
