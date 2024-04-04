'use client';

import { PropsWithChildren, useEffect, useRef } from 'react';

type DialogProps = PropsWithChildren<{
  open: boolean;
  onClose?: (event?: any) => void;
}>;

export const Dialog = ({ open, onClose, children }: DialogProps) => {
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (open && !ref.current?.open) {
      ref.current?.showModal();
    } else if (!open && ref.current?.open) {
      ref.current?.close();
      onClose?.(ref.current.returnValue);
    }
  }, [open, onClose]);

  return (
    <dialog ref={ref} onClose={onClose}>
      {children}
    </dialog>
  );
};
