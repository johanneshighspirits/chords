import { PropsWithChildren } from 'react';
import { useStickyMenu } from './providers/StickyMenuProvider';

export const StickyChordsAdderMenu = ({ children }: PropsWithChildren) => {
  const { isStuck } = useStickyMenu();

  return <>{children}</>;
};
