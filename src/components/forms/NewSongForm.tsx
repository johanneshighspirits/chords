'use client';

import { createSong } from '@/actions/song';
import styles from './NewSongForm.module.css';
import { SubmitButton } from './SubmitButton';
import { useFormState } from 'react-dom';
import { DetailedHTMLProps, InputHTMLAttributes } from 'react';

export const NewSongForm = () => {
  const [state, formAction] = useFormState(createSong, { errors: {} });

  return (
    <form action={formAction} className={styles.form}>
      <Input
        type="text"
        name="title"
        errors={state.errors}
        autoFocus
        required
        placeholder="New Song Title"
      />
      <input type="text" name="artist" required placeholder="Artist"></input>
      <SubmitButton
        pendingComponent={(data: FormData) =>
          `Creating song "${data.get('title')}" by ${data.get('artist')}...`
        }>
        Create new song
      </SubmitButton>
    </form>
  );
};

const Input = ({
  errors,
  labelText,
  name,
  ...props
}: DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & { name: string; errors: Record<string, string[]>; labelText?: string }) => {
  const messages = errors[name];
  return (
    <>
      {labelText && <label>{labelText}</label>}
      <input {...props} name={name}></input>
      {messages?.length > 0 ? (
        <ul className={styles.errorMessages}>
          {messages.map((message) => (
            <div key={message}>💥 {message} 👆</div>
          ))}
        </ul>
      ) : null}
    </>
  );
};
