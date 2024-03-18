export const generateId = () => crypto.randomUUID();

export const debounce = <F extends (...args: any[]) => any>(
  fn: F,
  delay = 1000
) => {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<F>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      clearTimeout(timer);
      fn(...args);
    }, delay);
  };
};
