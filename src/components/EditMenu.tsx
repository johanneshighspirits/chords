import { PropsWithChildren } from 'react';
import styles from './EditMenu.module.css';
import clsx from 'clsx';

export const EditMenu = ({ children }: PropsWithChildren) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={clsx('edit-menu touch-hidden', styles.EditMenu)}>
      {children}
    </div>
  );
};
