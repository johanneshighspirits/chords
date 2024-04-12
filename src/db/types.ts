import { Chord, ChordMeta, Part } from '@/types';

export type UpsertChordsProps = {
  action: 'upsertChords';
  songId: string;
  part: Part;
  entries: (Chord | ChordMeta)[];
  removedEntryUids?: string[];
};

export type UpsertPartsProps = {
  action: 'upsertParts';
  songId: string;
  entries: Part[];
  removedEntryUids?: string[];
};

export type DBActionPayload = UpsertChordsProps | UpsertPartsProps;
