import clsx from 'clsx';
import { Dialog } from './Dialog';
import { PropsWithChildren, useState } from 'react';
import styles from './forms/Form.module.css';

export const EditableDialog = <T extends string | string[]>({
  defaultValue,
  onEdit,
  className,
  children,
}: PropsWithChildren<{
  className?: string;
  defaultValue: T;
  onEdit: (value: T) => void;
}>) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [inputValue, setInputValue] = useState<T>(defaultValue);
  return (
    <>
      <div onClick={() => setIsEditMode(true)}>
        {/* 
      <button
        className={clsx('blank', className)}
        ✎
      </button> */}
        {children}
      </div>
      <Dialog
        open={isEditMode}
        onClose={(e) => {
          if (e.target.returnValue === 'OK') {
            onEdit(inputValue);
          }
          setIsEditMode(false);
          if (Array.isArray(defaultValue)) {
            setInputValue([] as unknown as T);
          } else {
            setInputValue('' as unknown as T);
          }
        }}>
        <form method="dialog" className={styles.Form}>
          {Array.isArray(defaultValue) ? (
            <div>
              {defaultValue.map((val, index) => {
                return (
                  <input
                    key={index}
                    type="text"
                    value={inputValue[index]}
                    style={{ textAlign: 'center', fontSize: 'larger' }}
                    onChange={(e) => {
                      const value = e.currentTarget.value;
                      setInputValue((state) => {
                        if (Array.isArray(state)) {
                          return state.map((v, i) => {
                            if (i === index) {
                              return value;
                            }
                            return v;
                          }) as T;
                        }
                        return state;
                      });
                    }}
                    name={`controlled-input-${index}`}></input>
                );
              })}
            </div>
          ) : (
            <input
              type="text"
              value={inputValue}
              style={{ textAlign: 'center', fontSize: 'larger' }}
              onChange={(e) => setInputValue(e.currentTarget.value as T)}
              name="controlled-input"></input>
          )}
          <button value="cancel">Cancel</button>
          <button type="submit" value="OK">
            Save
          </button>
        </form>
      </Dialog>
    </>
  );
};
