import { FormEventHandler, PropsWithChildren, useEffect, useRef } from 'react';

export const Editable = ({
  onEdit,
  children,
}: PropsWithChildren<{ onEdit: (value: string) => void }>) => {
  const ref = useRef<HTMLSpanElement | null>(null);

  const handleBlur: FormEventHandler<HTMLSpanElement> = () => {
    const text = ref.current?.innerText;
    onEdit(text ?? '');
  };

  return (
    <span
      ref={ref}
      contentEditable={true}
      suppressContentEditableWarning={true}
      onBlur={handleBlur}>
      {children}
    </span>
  );
};
