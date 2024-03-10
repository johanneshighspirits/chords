// import { parseChord } from '@/helpers/chord';
// import { Chord, Color, Duration, Part, Song, Timing } from '@/types';

// export const serializeSong = (song: Song) => {
//   const { parts, ...rest } = song;
//   return JSON.stringify({
//     ...rest,
//     parts: parts.map(serializePart),
//   });
// };
// type SerializedSong = Song & {
//   parts: SerializedPart[];
// };

// export const deserializeSong = (data: SerializedSong) => {
//   const { parts, ...rest } = data;
//   return {
//     ...rest,
//     parts: parts.map(deserializePart),
//   } satisfies Song;
// };

// export const serializePart = (part: Part) => {
//   const { id, chords, timing, color, title } = part;
//   return {
//     id,
//     chords: chords.map(serializeChord),
//     timing: serializeTiming(timing),
//     color: serializeColor(color),
//     title,
//   };
// };
// type SerializedPart = ReturnType<typeof serializePart>;

// export const deserializePart = (data: SerializedPart) => {
//   const { id, chords, timing, color, title } = data;
//   return {
//     id,
//     chords: chords.map(deserializeChord).filter((c) => c !== null) as Chord[],
//     timing: deserializeTiming(timing),
//     color: deserializeColor(color),
//     title,
//   } satisfies Part;
// };

// export const serializeChord = (chord: Chord): SerializedChord => {
//   const { original, id, timing } = chord;
//   return [original, id, serializeTiming(timing)];
// };
// type SerializedChord = [original: string, id: string, timing: SerializedTiming];

// export const deserializeChord = (data: SerializedChord) => {
//   const parsed = parseChord(data[0]);
//   if (!parsed) {
//     return null;
//   }
//   const chord = {
//     ...parsed,
//     id: data[1],
//     timing: deserializeTiming(data[2]),
//   };
//   return chord;
// };

// export const serializeTiming = (timing: Timing): SerializedTiming => {
//   const { position, duration, offset } = timing;
//   return [serializeDuration(position), serializeDuration(duration), offset];
// };
// type SerializedTiming = [position: number, duration: number, offset: number];

// export const deserializeTiming = (t: SerializedTiming): Timing => {
//   return {
//     position: deserializeDuration(t[0]),
//     duration: deserializeDuration(t[1]),
//     offset: t[2],
//   };
// };

// export const serializeDuration = (duration: Duration) =>
//   (duration.bar << 4) + duration.beat;

// export const deserializeDuration = (input: number): Duration => ({
//   bar: input >> 4,
//   beat: input % 16,
// });
