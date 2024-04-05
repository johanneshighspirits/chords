'use client';

import { ChordsView } from './ChordsView';
import { useSong, useSongParts } from './providers/SongProvider';
import { Color, Part } from '@/types';
import styles from './parts.module.css';
import clsx from 'clsx';
import { Editable } from './Editable';
import { AddPart } from './AddPart';
import { RemovePart } from './RemovePart';
import { Playhead } from './Playhead';
import { updatePart } from '@/db/actions';
import { colorToCssVars, serializeColor } from '@/helpers/color';
import { ColorPicker } from './ColorPicker';
import { debounce } from '@/helpers/common';
import { EditMenu } from './EditMenu';

export const PartsView = () => {
  const { currentPart, parts } = useSongParts();
  return (
    <section className={styles.parts}>
      {parts.map((part) => {
        return (
          <PartView
            key={part.uid}
            isActive={currentPart.uid === part.uid}
            part={part}
          />
        );
      })}
      <AddPart />
    </section>
  );
};

const debouncedUpdate = debounce((part: Part, color: Color) => {
  updatePart({ ...part, color });
});

export const PartView = ({
  isActive,
  part,
}: {
  isActive: boolean;
  part: Part;
}) => {
  const { dispatch } = useSong();
  const { chordLines = [] } = part;
  const { color } = part;

  const handleEditTitle = (title: string) => {
    if (title !== part.title) {
      updatePart({ ...part, title });
      dispatch({ type: 'setPartTitle', title, partId: part.uid });
    }
  };

  const handleEditColor = (color: Color) => {
    if (serializeColor(color) !== serializeColor(part.color)) {
      dispatch({ type: 'setPartColor', color, partId: part.uid });
      debouncedUpdate(part, color);
    }
  };

  return (
    <article
      className={clsx(styles.part, isActive && styles.isActive)}
      style={colorToCssVars(color, 'part')}>
      <div className={styles.header}>
        <h3>
          <Editable onEdit={handleEditTitle}>{part.title}</Editable>
          {part.barOffset}
          <ColorPicker
            className={styles.ColorPicker}
            color={part.color}
            onEdit={handleEditColor}></ColorPicker>
        </h3>
        <EditMenu>
          <RemovePart uid={part.uid}></RemovePart>
        </EditMenu>
      </div>
      {/* <Debug>{part.pattern}</Debug> */}
      {chordLines.length > 0 ? (
        <Playhead partId={part.uid} className={styles.chordLinesContainer}>
          {chordLines.map((line, i) => {
            return (
              <ChordsView
                key={line.pattern + i}
                lineIndex={i}
                part={part}
                {...line}
              />
            );
          })}
        </Playhead>
      ) : null}
    </article>
  );
};
