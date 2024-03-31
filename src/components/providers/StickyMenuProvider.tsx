'use client';

import clsx from 'clsx';
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

const StickyContext = createContext({ isStuck: false });

export const StickyMenuProvider = ({
  className,
  classNameIsStuck,
  classNameNotStuck,
  children,
}: PropsWithChildren<{
  className?: string;
  classNameIsStuck?: string;
  classNameNotStuck?: string;
}>) => {
  const [isStuck, setIsStuck] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver>();

  useEffect(() => {
    if (ref.current && !observerRef.current) {
      const rootMargin = `0px 0px -${globalThis.window.innerHeight - 1}px 0px`;
      observerRef.current = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            setIsStuck(entry.isIntersecting);
          }
        },
        {
          threshold: 0,
          rootMargin,
        }
      );
      observerRef.current.observe(ref.current);
    }
  }, []);
  return (
    <StickyContext.Provider value={{ isStuck }}>
      <div
        ref={ref}
        className={clsx(
          className,
          isStuck ? classNameIsStuck : classNameNotStuck
        )}>
        {children}
      </div>
    </StickyContext.Provider>
  );
};

export const useStickyMenu = () => {
  const ctx = useContext(StickyContext);
  return ctx;
};
