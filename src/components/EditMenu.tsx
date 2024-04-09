import { PropsWithChildren } from 'react';
import styles from './EditMenu.module.css';
import clsx from 'clsx';

export const EditMenu = ({ children }: PropsWithChildren) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={clsx('edit-menu', styles.EditMenu)}>
      {children}
    </div>
  );
};
