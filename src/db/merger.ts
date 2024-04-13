import { Chord, ChordMeta, Part } from '@/types';
import { DBActionPayload, UpsertChordsProps, UpsertPartsProps } from './types';

export const mergePayloads = (payloads: DBActionPayload[]) => {
  const mergedChordPayloads: Record<string, UpsertChordsProps> = {};
  const chordsDictionary: Record<string, Chord | ChordMeta> = {};

  const mergedPartPayloads: Record<string, UpsertPartsProps> = {};
  const partsDictionary: Record<string, Part> = {};

  for (const payload of payloads) {
    const key = getPayloadKey(payload);
    if (payload.action === 'upsertChords') {
      if (!mergedChordPayloads[key]) {
        mergedChordPayloads[key] = payload;
      } else {
        mergedChordPayloads[key].entries.push(...payload.entries);
        if (payload.removedEntryUids) {
          mergedChordPayloads[key].removedEntryUids?.push(
            ...payload.removedEntryUids
          );
        }
      }

      for (const entry of payload.entries) {
        if (!chordsDictionary[entry.uid]) {
          chordsDictionary[entry.uid] = entry;
        } else {
          chordsDictionary[entry.uid] = {
            ...chordsDictionary[entry.uid],
            ...entry,
          };
        }
      }
    }

    if (payload.action === 'upsertParts') {
      if (!mergedPartPayloads[key]) {
        mergedPartPayloads[key] = payload;
      } else {
        mergedPartPayloads[key].entries.push(...payload.entries);
        if (payload.removedEntryUids) {
          mergedPartPayloads[key].removedEntryUids?.push(
            ...payload.removedEntryUids
          );
        }
      }

      for (const entry of payload.entries) {
        if (!partsDictionary[entry.uid]) {
          partsDictionary[entry.uid] = entry;
        } else {
          partsDictionary[entry.uid] = {
            ...partsDictionary[entry.uid],
            ...entry,
          };
        }
      }
    }
  }

  const chordPayloads = Object.values(mergedChordPayloads).map((payload) => {
    const existingUids = new Set<string>();
    payload.entries = payload.entries
      .toReversed()
      .map((entry) => {
        if (existingUids.has(entry.uid)) {
          return null;
        }
        existingUids.add(entry.uid);
        if (chordsDictionary[entry.uid]) {
          return {
            ...entry,
            ...chordsDictionary[entry.uid],
          };
        }
        return entry;
      })
      .filter((e): e is Chord | ChordMeta => e !== null)
      .toReversed();
    if (payload.removedEntryUids) {
      payload.removedEntryUids = [...new Set(payload.removedEntryUids)];
    }
    return payload;
  });

  const partPayloads = Object.values(mergedPartPayloads).map((payload) => {
    const existingUids = new Set<string>();
    payload.entries = payload.entries
      .toReversed()
      .map((entry) => {
        if (existingUids.has(entry.uid)) {
          return null;
        }
        existingUids.add(entry.uid);
        if (partsDictionary[entry.uid]) {
          return {
            ...entry,
            ...partsDictionary[entry.uid],
          };
        }
        return entry;
      })
      .filter((e): e is Part => e !== null)
      .toReversed();
    if (payload.removedEntryUids) {
      payload.removedEntryUids = [...new Set(payload.removedEntryUids)];
    }
    return payload;
  });

  return [...chordPayloads, ...partPayloads];
};

const getPayloadKey = (payload: DBActionPayload) => {
  const segments = [payload.action, payload.songId];
  if (payload.action === 'upsertChords') {
    segments.push(payload.part.uid);
  }
  return segments.join('|');
};
