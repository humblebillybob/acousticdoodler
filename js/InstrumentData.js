// Instrument configurations, scales, chords, and musical data
class InstrumentData {
  constructor() {
    // Note names
    this.noteNames = [
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
      "A",
      "A#",
      "B",
    ];

    // Scale intervals (semitones from root)
    this.scaleIntervals = {
      major: [0, 2, 4, 5, 7, 9, 11],
      minor: [0, 2, 3, 5, 7, 8, 10],
      pentatonicMajor: [0, 2, 4, 7, 9],
      pentatonicMinor: [0, 3, 5, 7, 10],
      blues: [0, 3, 5, 6, 7, 10],
      dorian: [0, 2, 3, 5, 7, 9, 10],
      mixolydian: [0, 2, 4, 5, 7, 9, 10],
      lydian: [0, 2, 4, 6, 7, 9, 11],
    };

    // Scale information
    this.scaleInfo = {
      major:
        "The major scale is the foundation of Western music. It has a bright, happy sound and is used in countless songs across all genres.",
      minor:
        "The natural minor scale has a darker, more melancholic sound compared to major. It's essential for rock, blues, and many other styles.",
      pentatonicMajor:
        "The major pentatonic scale removes the 4th and 7th degrees of the major scale, creating a very consonant, easy-to-use scale.",
      pentatonicMinor:
        "The minor pentatonic is the backbone of blues and rock. It's the most commonly used scale for guitar solos and improvisation.",
      blues:
        "The blues scale adds a 'blue note' (♭5) to the minor pentatonic, giving it that characteristic blues sound with extra tension and resolution.",
      dorian:
        "Dorian mode has a minor sound but with a raised 6th degree, giving it a slightly brighter quality than natural minor.",
      mixolydian:
        "Mixolydian is major with a flattened 7th, commonly used in rock, blues, and folk music. Think of it as a 'dominant' sound.",
      lydian:
        "Lydian mode features a raised 4th degree, creating a dreamy, ethereal sound often used in film scores and progressive music.",
    };

    // Instrument configurations
    this.instruments = {
      guitar: {
        name: "Guitar",
        tuning: ["E", "A", "D", "G", "B", "E"],
        openStringFreqs: [82.41, 110.0, 146.83, 196.0, 246.94, 329.63],
        scalePatterns: {
          major: [
            {
              name: "Pattern 1 (Root)",
              frets: [
                [0, 3],
                [0, 2],
                [0, 2],
                [0, 2],
                [0, 3],
                [0, 3],
              ],
            },
            {
              name: "Pattern 2",
              frets: [
                [2, 5],
                [2, 4],
                [1, 4],
                [2, 4],
                [2, 5],
                [2, 5],
              ],
            },
            {
              name: "Pattern 3",
              frets: [
                [4, 7],
                [4, 7],
                [4, 6],
                [4, 6],
                [5, 7],
                [4, 7],
              ],
            },
            {
              name: "Pattern 4",
              frets: [
                [7, 9],
                [7, 9],
                [6, 9],
                [6, 8],
                [7, 10],
                [7, 9],
              ],
            },
            {
              name: "Pattern 5",
              frets: [
                [9, 12],
                [9, 12],
                [9, 11],
                [8, 11],
                [10, 12],
                [9, 12],
              ],
            },
          ],
          minor: [
            {
              name: "Pattern 1 (Root)",
              frets: [
                [0, 3],
                [0, 2],
                [0, 2],
                [0, 2],
                [0, 3],
                [0, 3],
              ],
            },
            {
              name: "Pattern 2",
              frets: [
                [2, 5],
                [2, 4],
                [1, 4],
                [2, 4],
                [2, 5],
                [2, 5],
              ],
            },
            {
              name: "Pattern 3",
              frets: [
                [4, 7],
                [4, 7],
                [4, 6],
                [4, 6],
                [5, 7],
                [4, 7],
              ],
            },
            {
              name: "Pattern 4",
              frets: [
                [7, 9],
                [7, 9],
                [6, 9],
                [6, 8],
                [7, 10],
                [7, 9],
              ],
            },
            {
              name: "Pattern 5",
              frets: [
                [9, 12],
                [9, 12],
                [9, 11],
                [8, 11],
                [10, 12],
                [9, 12],
              ],
            },
          ],
          pentatonicMajor: [
            {
              name: "Pattern 1 (Root)",
              frets: [
                [0, 3],
                [0, 2],
                [0, 2],
                [0, 2],
                [0, 3],
                [0, 3],
              ],
            },
            {
              name: "Pattern 2",
              frets: [
                [2, 5],
                [2, 4],
                [2, 4],
                [2, 4],
                [2, 5],
                [2, 5],
              ],
            },
            {
              name: "Pattern 3",
              frets: [
                [4, 7],
                [4, 7],
                [4, 6],
                [4, 6],
                [5, 7],
                [4, 7],
              ],
            },
            {
              name: "Pattern 4",
              frets: [
                [7, 9],
                [7, 9],
                [6, 9],
                [6, 8],
                [7, 10],
                [7, 9],
              ],
            },
            {
              name: "Pattern 5",
              frets: [
                [9, 12],
                [9, 12],
                [9, 11],
                [8, 11],
                [10, 12],
                [9, 12],
              ],
            },
          ],
          pentatonicMinor: [
            {
              name: "Box 1 (Root)",
              frets: [
                [0, 3],
                [0, 3],
                [0, 2],
                [0, 2],
                [0, 3],
                [0, 3],
              ],
            },
            {
              name: "Box 2",
              frets: [
                [3, 5],
                [2, 5],
                [2, 4],
                [2, 4],
                [3, 5],
                [3, 5],
              ],
            },
            {
              name: "Box 3",
              frets: [
                [5, 8],
                [5, 7],
                [4, 7],
                [4, 7],
                [5, 8],
                [5, 8],
              ],
            },
            {
              name: "Box 4",
              frets: [
                [8, 10],
                [7, 10],
                [7, 9],
                [7, 9],
                [8, 10],
                [8, 10],
              ],
            },
            {
              name: "Box 5",
              frets: [
                [10, 12],
                [10, 12],
                [9, 12],
                [9, 12],
                [10, 12],
                [10, 12],
              ],
            },
          ],
          blues: [
            {
              name: "Pattern 1 (Root)",
              frets: [
                [0, 3],
                [0, 3],
                [0, 2],
                [0, 2],
                [0, 3],
                [0, 3],
              ],
            },
            {
              name: "Pattern 2",
              frets: [
                [3, 5],
                [2, 5],
                [2, 4],
                [2, 4],
                [3, 5],
                [3, 5],
              ],
            },
            {
              name: "Pattern 3",
              frets: [
                [5, 8],
                [5, 7],
                [4, 7],
                [4, 7],
                [5, 8],
                [5, 8],
              ],
            },
          ],
          dorian: [
            {
              name: "Pattern 1 (Root)",
              frets: [
                [0, 3],
                [0, 2],
                [0, 2],
                [0, 2],
                [0, 3],
                [0, 3],
              ],
            },
            {
              name: "Pattern 2",
              frets: [
                [2, 5],
                [2, 4],
                [1, 4],
                [2, 4],
                [2, 5],
                [2, 5],
              ],
            },
            {
              name: "Pattern 3",
              frets: [
                [4, 7],
                [4, 7],
                [4, 6],
                [4, 6],
                [5, 7],
                [4, 7],
              ],
            },
          ],
          mixolydian: [
            {
              name: "Pattern 1 (Root)",
              frets: [
                [0, 3],
                [0, 2],
                [0, 2],
                [0, 2],
                [0, 3],
                [0, 3],
              ],
            },
            {
              name: "Pattern 2",
              frets: [
                [2, 5],
                [2, 4],
                [1, 4],
                [2, 4],
                [2, 5],
                [2, 5],
              ],
            },
            {
              name: "Pattern 3",
              frets: [
                [4, 7],
                [4, 7],
                [4, 6],
                [4, 6],
                [5, 7],
                [4, 7],
              ],
            },
          ],
          lydian: [
            {
              name: "Pattern 1 (Root)",
              frets: [
                [0, 3],
                [0, 2],
                [0, 2],
                [0, 2],
                [0, 3],
                [0, 3],
              ],
            },
            {
              name: "Pattern 2",
              frets: [
                [2, 5],
                [2, 4],
                [1, 4],
                [2, 4],
                [2, 5],
                [2, 5],
              ],
            },
            {
              name: "Pattern 3",
              frets: [
                [4, 7],
                [4, 7],
                [4, 6],
                [4, 6],
                [5, 7],
                [4, 7],
              ],
            },
          ],
        },
        chords: {
          // Major Chords
          C: {
            name: "C",
            fingering: "x32010",
            fingers: [null, 3, 2, null, 1, null],
            description: "C Major",
            variant: "Open Position",
          },
          C_barre: {
            name: "C",
            fingering: "x35553",
            fingers: [null, 1, 3, 3, 3, 1],
            description: "C Major",
            variant: "Barre (3rd fret)",
          },
          C_alt: {
            name: "C",
            fingering: "x32013",
            fingers: [null, 3, 2, null, 1, 4],
            description: "C Major",
            variant: "Alternative",
          },
          D: {
            name: "D",
            fingering: "xx0232",
            fingers: [null, null, null, 1, 3, 2],
            description: "D Major",
            variant: "Open Position",
          },
          D_barre: {
            name: "D",
            fingering: "x57775",
            fingers: [null, 1, 3, 3, 3, 1],
            description: "D Major",
            variant: "Barre (5th fret)",
          },
          E: {
            name: "E",
            fingering: "022100",
            fingers: [null, 2, 2, 1, null, null],
            description: "E Major",
            variant: "Open Position",
          },
          E_alt: {
            name: "E",
            fingering: "079997",
            fingers: [null, 1, 3, 3, 3, 1],
            description: "E Major",
            variant: "Barre (7th fret)",
          },
          F: {
            name: "F",
            fingering: "133211",
            fingers: [1, 3, 3, 2, 1, 1],
            description: "F Major",
            variant: "Barre (1st fret)",
          },
          F_open: {
            name: "F",
            fingering: "xx3211",
            fingers: [null, null, 3, 2, 1, 1],
            description: "F Major",
            variant: "Partial Barre",
          },
          G: {
            name: "G",
            fingering: "320003",
            fingers: [3, 2, null, null, null, 3],
            description: "G Major",
            variant: "Open Position",
          },
          G_barre: {
            name: "G",
            fingering: "355433",
            fingers: [1, 3, 4, 3, 3, 3],
            description: "G Major",
            variant: "Barre (3rd fret)",
          },
          G_alt: {
            name: "G",
            fingering: "320033",
            fingers: [3, 2, null, null, 3, 4],
            description: "G Major",
            variant: "Alternative",
          },
          A: {
            name: "A",
            fingering: "x02220",
            fingers: [null, null, 2, 2, 2, null],
            description: "A Major",
            variant: "Open Position",
          },
          A_barre: {
            name: "A",
            fingering: "577655",
            fingers: [1, 3, 3, 2, 1, 1],
            description: "A Major",
            variant: "Barre (5th fret)",
          },
          B: {
            name: "B",
            fingering: "x24442",
            fingers: [null, 2, 4, 4, 4, 2],
            description: "B Major",
            variant: "Barre (2nd fret)",
          },
          Bb: {
            name: "Bb",
            fingering: "x13331",
            fingers: [null, 1, 3, 3, 3, 1],
            description: "B♭ Major",
            variant: "Barre (1st fret)",
          },

          // Minor Chords
          Am: {
            name: "Am",
            fingering: "x02210",
            fingers: [null, null, 2, 2, 1, null],
            description: "A Minor",
            variant: "Open Position",
          },
          Am_barre: {
            name: "Am",
            fingering: "577555",
            fingers: [1, 3, 3, 1, 1, 1],
            description: "A Minor",
            variant: "Barre (5th fret)",
          },
          Dm: {
            name: "Dm",
            fingering: "xx0231",
            fingers: [null, null, null, 2, 3, 1],
            description: "D Minor",
            variant: "Open Position",
          },
          Dm_barre: {
            name: "Dm",
            fingering: "x57765",
            fingers: [null, 1, 3, 4, 2, 1],
            description: "D Minor",
            variant: "Barre (5th fret)",
          },
          Em: {
            name: "Em",
            fingering: "022000",
            fingers: [null, 2, 2, null, null, null],
            description: "E Minor",
            variant: "Open Position",
          },
          Em_barre: {
            name: "Em",
            fingering: "079987",
            fingers: [null, 1, 3, 3, 2, 1],
            description: "E Minor",
            variant: "Barre (7th fret)",
          },
          Fm: {
            name: "Fm",
            fingering: "133111",
            fingers: [1, 3, 3, 1, 1, 1],
            description: "F Minor",
            variant: "Barre (1st fret)",
          },
          Gm: {
            name: "Gm",
            fingering: "355333",
            fingers: [1, 3, 4, 3, 3, 3],
            description: "G Minor",
            variant: "Barre (3rd fret)",
          },
          Bm: {
            name: "Bm",
            fingering: "x24432",
            fingers: [null, 2, 4, 4, 3, 2],
            description: "B Minor",
            variant: "Barre (2nd fret)",
          },
          Cm: {
            name: "Cm",
            fingering: "x35543",
            fingers: [null, 1, 3, 4, 2, 1],
            description: "C Minor",
            variant: "Barre (3rd fret)",
          },

          // 7th Chords
          C7: {
            name: "C7",
            fingering: "x32310",
            fingers: [null, 3, 2, 3, 1, null],
            description: "C Dominant 7th",
            variant: "Open Position",
          },
          C7_barre: {
            name: "C7",
            fingering: "x35353",
            fingers: [null, 1, 3, 1, 4, 1],
            description: "C Dominant 7th",
            variant: "Barre (3rd fret)",
          },
          D7: {
            name: "D7",
            fingering: "xx0212",
            fingers: [null, null, null, 2, 1, 2],
            description: "D Dominant 7th",
            variant: "Open Position",
          },
          E7: {
            name: "E7",
            fingering: "020100",
            fingers: [null, 2, null, 1, null, null],
            description: "E Dominant 7th",
            variant: "Open Position",
          },
          F7: {
            name: "F7",
            fingering: "131211",
            fingers: [1, 3, 1, 2, 1, 1],
            description: "F Dominant 7th",
            variant: "Barre (1st fret)",
          },
          G7: {
            name: "G7",
            fingering: "320001",
            fingers: [3, 2, null, null, null, 1],
            description: "G Dominant 7th",
            variant: "Open Position",
          },
          A7: {
            name: "A7",
            fingering: "x02020",
            fingers: [null, null, 2, null, 2, null],
            description: "A Dominant 7th",
            variant: "Open Position",
          },
          B7: {
            name: "B7",
            fingering: "x21202",
            fingers: [null, 2, 1, 2, null, 2],
            description: "B Dominant 7th",
            variant: "Open Position",
          },

          // Minor 7th Chords
          Am7: {
            name: "Am7",
            fingering: "x02010",
            fingers: [null, null, 2, null, 1, null],
            description: "A Minor 7th",
            variant: "Open Position",
          },
          Dm7: {
            name: "Dm7",
            fingering: "xx0211",
            fingers: [null, null, null, 2, 1, 1],
            description: "D Minor 7th",
            variant: "Open Position",
          },
          Em7: {
            name: "Em7",
            fingering: "022030",
            fingers: [null, 2, 2, null, 3, null],
            description: "E Minor 7th",
            variant: "Open Position",
          },
          Fm7: {
            name: "Fm7",
            fingering: "131141",
            fingers: [1, 3, 1, 1, 4, 1],
            description: "F Minor 7th",
            variant: "Barre (1st fret)",
          },
          Gm7: {
            name: "Gm7",
            fingering: "353363",
            fingers: [1, 3, 1, 1, 4, 1],
            description: "G Minor 7th",
            variant: "Barre (3rd fret)",
          },

          // Major 7th Chords
          Cmaj7: {
            name: "Cmaj7",
            fingering: "x32000",
            fingers: [null, 3, 2, null, null, null],
            description: "C Major 7th",
            variant: "Open Position",
          },
          Dmaj7: {
            name: "Dmaj7",
            fingering: "xx0222",
            fingers: [null, null, null, 1, 1, 1],
            description: "D Major 7th",
            variant: "Open Position",
          },
          Emaj7: {
            name: "Emaj7",
            fingering: "021100",
            fingers: [null, 2, 1, 1, null, null],
            description: "E Major 7th",
            variant: "Open Position",
          },
          Fmaj7: {
            name: "Fmaj7",
            fingering: "xx3210",
            fingers: [null, null, 3, 2, 1, null],
            description: "F Major 7th",
            variant: "Open Position",
          },
          Gmaj7: {
            name: "Gmaj7",
            fingering: "320002",
            fingers: [3, 2, null, null, null, 2],
            description: "G Major 7th",
            variant: "Open Position",
          },
          Amaj7: {
            name: "Amaj7",
            fingering: "x02120",
            fingers: [null, null, 2, 1, 2, null],
            description: "A Major 7th",
            variant: "Open Position",
          },

          // Sus Chords
          Csus2: {
            name: "Csus2",
            fingering: "x30010",
            fingers: [null, 3, null, null, 1, null],
            description: "C Suspended 2nd",
            variant: "Open Position",
          },
          Csus4: {
            name: "Csus4",
            fingering: "x33010",
            fingers: [null, 3, 3, null, 1, null],
            description: "C Suspended 4th",
            variant: "Open Position",
          },
          Dsus2: {
            name: "Dsus2",
            fingering: "xx0230",
            fingers: [null, null, null, 2, 3, null],
            description: "D Suspended 2nd",
            variant: "Open Position",
          },
          Dsus4: {
            name: "Dsus4",
            fingering: "xx0233",
            fingers: [null, null, null, 2, 3, 3],
            description: "D Suspended 4th",
            variant: "Open Position",
          },
          Esus4: {
            name: "Esus4",
            fingering: "022200",
            fingers: [null, 2, 2, 2, null, null],
            description: "E Suspended 4th",
            variant: "Open Position",
          },
          Fsus2: {
            name: "Fsus2",
            fingering: "xx3011",
            fingers: [null, null, 3, null, 1, 1],
            description: "F Suspended 2nd",
            variant: "Open Position",
          },
          Gsus2: {
            name: "Gsus2",
            fingering: "300003",
            fingers: [3, null, null, null, null, 3],
            description: "G Suspended 2nd",
            variant: "Open Position",
          },
          Gsus4: {
            name: "Gsus4",
            fingering: "320013",
            fingers: [3, 2, null, null, 1, 4],
            description: "G Suspended 4th",
            variant: "Open Position",
          },
          Asus2: {
            name: "Asus2",
            fingering: "x02200",
            fingers: [null, null, 2, 2, null, null],
            description: "A Suspended 2nd",
            variant: "Open Position",
          },
          Asus4: {
            name: "Asus4",
            fingering: "x02230",
            fingers: [null, null, 2, 2, 3, null],
            description: "A Suspended 4th",
            variant: "Open Position",
          },

          // Diminished & Augmented
          Adim: {
            name: "Adim",
            fingering: "x01212",
            fingers: [null, null, 1, 2, 1, 2],
            description: "A Diminished",
            variant: "Open Position",
          },
          Bdim: {
            name: "Bdim",
            fingering: "x23434",
            fingers: [null, 1, 2, 3, 4, 4],
            description: "B Diminished",
            variant: "2nd fret",
          },
          Caug: {
            name: "Caug",
            fingering: "x32110",
            fingers: [null, 3, 2, 1, 1, null],
            description: "C Augmented",
            variant: "Open Position",
          },
          Gaug: {
            name: "Gaug",
            fingering: "321003",
            fingers: [3, 2, 1, null, null, 4],
            description: "G Augmented",
            variant: "Open Position",
          },

          // 9th chords
          C9: {
            name: "C9",
            fingering: "x32333",
            fingers: [null, 1, 2, 3, 3, 3],
            description: "C Dominant 9th",
            variant: "3rd fret",
          },
          D9: {
            name: "D9",
            fingering: "x54555",
            fingers: [null, 1, 2, 1, 1, 1],
            description: "D Dominant 9th",
            variant: "5th fret",
          },
          E9: {
            name: "E9",
            fingering: "020102",
            fingers: [null, 2, null, 1, null, 2],
            description: "E Dominant 9th",
            variant: "Open Position",
          },
          G9: {
            name: "G9",
            fingering: "300001",
            fingers: [3, null, null, null, null, 1],
            description: "G Dominant 9th",
            variant: "Open Position",
          },

          // Minor 9th
          Am9: {
            name: "Am9",
            fingering: "x02000",
            fingers: [null, null, 2, null, null, null],
            description: "A Minor 9th",
            variant: "Open Position",
          },
          Em9: {
            name: "Em9",
            fingering: "022002",
            fingers: [null, 2, 2, null, null, 2],
            description: "E Minor 9th",
            variant: "Open Position",
          },

          // 6th Chords
          C6: {
            name: "C6",
            fingering: "x32210",
            fingers: [null, 3, 2, 2, 1, null],
            description: "C Major 6th",
            variant: "Open Position",
          },
          D6: {
            name: "D6",
            fingering: "xx0202",
            fingers: [null, null, null, 2, null, 2],
            description: "D Major 6th",
            variant: "Open Position",
          },
          F6: {
            name: "F6",
            fingering: "xx3231",
            fingers: [null, null, 3, 2, 3, 1],
            description: "F Major 6th",
            variant: "Open Position",
          },
          G6: {
            name: "G6",
            fingering: "320000",
            fingers: [3, 2, null, null, null, null],
            description: "G Major 6th",
            variant: "Open Position",
          },
          Am6: {
            name: "Am6",
            fingering: "x02212",
            fingers: [null, null, 2, 2, 1, 2],
            description: "A Minor 6th",
            variant: "Open Position",
          },
        },
        tips: [
          {
            title: "Guitar Basics",
            content:
              "Start with open chords like G, C, D, Em, and Am. These form the foundation of thousands of songs.",
          },
          {
            title: "Barre Chords",
            content:
              "Once comfortable with open chords, learn F and Bm barre chords to unlock playing in all keys.",
          },
        ],
      },
      ukulele: {
        name: "Tenor Ukulele",
        tuning: ["G", "C", "E", "A"],
        openStringFreqs: [196.0, 261.63, 329.63, 440.0],
        scalePatterns: {
          major: [
            {
              name: "Pattern 1 (Root)",
              frets: [
                [0, 2],
                [0, 3],
                [0, 2],
                [0, 2],
              ],
            },
            {
              name: "Pattern 2",
              frets: [
                [2, 5],
                [3, 5],
                [2, 4],
                [2, 5],
              ],
            },
            {
              name: "Pattern 3",
              frets: [
                [5, 7],
                [5, 7],
                [4, 7],
                [5, 7],
              ],
            },
            {
              name: "Pattern 4",
              frets: [
                [7, 10],
                [7, 10],
                [7, 9],
                [7, 10],
              ],
            },
            {
              name: "Pattern 5",
              frets: [
                [10, 12],
                [10, 12],
                [9, 12],
                [10, 12],
              ],
            },
          ],
          minor: [
            {
              name: "Pattern 1 (Root)",
              frets: [
                [0, 3],
                [0, 3],
                [0, 2],
                [0, 2],
              ],
            },
            {
              name: "Pattern 2",
              frets: [
                [3, 5],
                [3, 5],
                [2, 5],
                [2, 5],
              ],
            },
            {
              name: "Pattern 3",
              frets: [
                [5, 8],
                [5, 8],
                [5, 7],
                [5, 7],
              ],
            },
          ],
          pentatonicMajor: [
            {
              name: "Pattern 1 (Root)",
              frets: [
                [0, 2],
                [0, 3],
                [0, 2],
                [0, 2],
              ],
            },
            {
              name: "Pattern 2",
              frets: [
                [2, 5],
                [3, 5],
                [2, 4],
                [2, 5],
              ],
            },
          ],
          pentatonicMinor: [
            {
              name: "Box 1 (Root)",
              frets: [
                [0, 3],
                [0, 3],
                [0, 2],
                [0, 3],
              ],
            },
            {
              name: "Box 2",
              frets: [
                [3, 5],
                [3, 5],
                [2, 5],
                [3, 5],
              ],
            },
            {
              name: "Box 3",
              frets: [
                [5, 8],
                [5, 8],
                [5, 7],
                [5, 8],
              ],
            },
            {
              name: "Box 4",
              frets: [
                [8, 10],
                [8, 10],
                [7, 10],
                [8, 10],
              ],
            },
            {
              name: "Box 5",
              frets: [
                [10, 12],
                [10, 12],
                [10, 12],
                [10, 12],
              ],
            },
          ],
          blues: [
            {
              name: "Pattern 1 (Root)",
              frets: [
                [0, 3],
                [0, 3],
                [0, 2],
                [0, 3],
              ],
            },
            {
              name: "Pattern 2",
              frets: [
                [3, 5],
                [3, 5],
                [2, 5],
                [3, 5],
              ],
            },
          ],
          dorian: [
            {
              name: "Pattern 1 (Root)",
              frets: [
                [0, 3],
                [0, 3],
                [0, 2],
                [0, 2],
              ],
            },
          ],
          mixolydian: [
            {
              name: "Pattern 1 (Root)",
              frets: [
                [0, 2],
                [0, 3],
                [0, 2],
                [0, 2],
              ],
            },
          ],
          lydian: [
            {
              name: "Pattern 1 (Root)",
              frets: [
                [0, 2],
                [0, 3],
                [0, 2],
                [0, 2],
              ],
            },
          ],
        },
        chords: {
          // Major Chords
          C: {
            name: "C",
            fingering: "0003",
            fingers: [null, null, null, 3],
            description: "C Major",
            variant: "Open Position",
          },
          C_alt: {
            name: "C",
            fingering: "5433",
            fingers: [4, 3, 2, 1],
            description: "C Major",
            variant: "5th fret",
          },
          D: {
            name: "D",
            fingering: "2220",
            fingers: [2, 2, 2, null],
            description: "D Major",
            variant: "Open Position",
          },
          D_alt: {
            name: "D",
            fingering: "7655",
            fingers: [4, 2, 1, 1],
            description: "D Major",
            variant: "7th fret",
          },
          E: {
            name: "E",
            fingering: "4442",
            fingers: [3, 3, 3, 1],
            description: "E Major",
            variant: "4th fret",
          },
          E_alt: {
            name: "E",
            fingering: "1402",
            fingers: [1, 3, null, 2],
            description: "E Major",
            variant: "1st fret",
          },
          F: {
            name: "F",
            fingering: "2010",
            fingers: [2, null, 1, null],
            description: "F Major",
            variant: "Open Position",
          },
          F_barre: {
            name: "F",
            fingering: "5558",
            fingers: [1, 1, 1, 4],
            description: "F Major",
            variant: "Barre 5th fret",
          },
          G: {
            name: "G",
            fingering: "0232",
            fingers: [null, 2, 3, 2],
            description: "G Major",
            variant: "Open Position",
          },
          G_alt: {
            name: "G",
            fingering: "0787",
            fingers: [null, 1, 4, 1],
            description: "G Major",
            variant: "7th fret",
          },
          A: {
            name: "A",
            fingering: "2100",
            fingers: [2, 1, null, null],
            description: "A Major",
            variant: "Open Position",
          },
          A_barre: {
            name: "A",
            fingering: "2225",
            fingers: [1, 1, 1, 4],
            description: "A Major",
            variant: "Barre 2nd fret",
          },
          B: {
            name: "B",
            fingering: "4322",
            fingers: [4, 2, 1, 1],
            description: "B Major",
            variant: "4th fret",
          },
          Bb: {
            name: "Bb",
            fingering: "3211",
            fingers: [3, 2, 1, 1],
            description: "B♭ Major",
            variant: "3rd fret",
          },

          // Minor Chords
          Am: {
            name: "Am",
            fingering: "2000",
            fingers: [2, null, null, null],
            description: "A Minor",
            variant: "Open Position",
          },
          Am_alt: {
            name: "Am",
            fingering: "2433",
            fingers: [1, 2, 3, 3],
            description: "A Minor",
            variant: "Alternative",
          },
          Dm: {
            name: "Dm",
            fingering: "2210",
            fingers: [2, 2, 1, null],
            description: "D Minor",
            variant: "Open Position",
          },
          Dm_alt: {
            name: "Dm",
            fingering: "7988",
            fingers: [1, 2, 3, 3],
            description: "D Minor",
            variant: "7th fret",
          },
          Em: {
            name: "Em",
            fingering: "0432",
            fingers: [null, 4, 3, 2],
            description: "E Minor",
            variant: "Open Position",
          },
          Em_alt: {
            name: "Em",
            fingering: "9987",
            fingers: [3, 3, 2, 1],
            description: "E Minor",
            variant: "9th fret",
          },
          Fm: {
            name: "Fm",
            fingering: "1013",
            fingers: [1, null, 1, 3],
            description: "F Minor",
            variant: "Open Position",
          },
          Gm: {
            name: "Gm",
            fingering: "0231",
            fingers: [null, 2, 3, 1],
            description: "G Minor",
            variant: "Open Position",
          },
          Bm: {
            name: "Bm",
            fingering: "4222",
            fingers: [3, 1, 1, 1],
            description: "B Minor",
            variant: "4th fret",
          },
          Cm: {
            name: "Cm",
            fingering: "0333",
            fingers: [null, 1, 2, 3],
            description: "C Minor",
            variant: "Open Position",
          },

          // 7th Chords
          C7: {
            name: "C7",
            fingering: "0001",
            fingers: [null, null, null, 1],
            description: "C Dominant 7th",
            variant: "Open Position",
          },
          C7_alt: {
            name: "C7",
            fingering: "3433",
            fingers: [2, 3, 2, 2],
            description: "C Dominant 7th",
            variant: "3rd fret",
          },
          D7: {
            name: "D7",
            fingering: "2223",
            fingers: [2, 2, 2, 3],
            description: "D Dominant 7th",
            variant: "Open Position",
          },
          E7: {
            name: "E7",
            fingering: "1202",
            fingers: [1, 2, null, 3],
            description: "E Dominant 7th",
            variant: "Open Position",
          },
          F7: {
            name: "F7",
            fingering: "2313",
            fingers: [2, 3, 1, 4],
            description: "F Dominant 7th",
            variant: "Open Position",
          },
          G7: {
            name: "G7",
            fingering: "0212",
            fingers: [null, 2, 1, 3],
            description: "G Dominant 7th",
            variant: "Open Position",
          },
          A7: {
            name: "A7",
            fingering: "0100",
            fingers: [null, 1, null, null],
            description: "A Dominant 7th",
            variant: "Open Position",
          },
          B7: {
            name: "B7",
            fingering: "2322",
            fingers: [2, 3, 1, 1],
            description: "B Dominant 7th",
            variant: "Open Position",
          },

          // Minor 7th Chords
          Am7: {
            name: "Am7",
            fingering: "0000",
            fingers: [null, null, null, null],
            description: "A Minor 7th",
            variant: "Open Position",
          },
          Dm7: {
            name: "Dm7",
            fingering: "2213",
            fingers: [2, 2, 1, 3],
            description: "D Minor 7th",
            variant: "Open Position",
          },
          Em7: {
            name: "Em7",
            fingering: "0202",
            fingers: [null, 2, null, 2],
            description: "E Minor 7th",
            variant: "Open Position",
          },
          Fm7: {
            name: "Fm7",
            fingering: "1313",
            fingers: [1, 3, 1, 3],
            description: "F Minor 7th",
            variant: "1st fret",
          },
          Gm7: {
            name: "Gm7",
            fingering: "0211",
            fingers: [null, 2, 1, 1],
            description: "G Minor 7th",
            variant: "Open Position",
          },
          Cm7: {
            name: "Cm7",
            fingering: "3333",
            fingers: [1, 1, 1, 1],
            description: "C Minor 7th",
            variant: "3rd fret",
          },

          // Major 7th Chords
          Cmaj7: {
            name: "Cmaj7",
            fingering: "0002",
            fingers: [null, null, null, 2],
            description: "C Major 7th",
            variant: "Open Position",
          },
          Dmaj7: {
            name: "Dmaj7",
            fingering: "2224",
            fingers: [1, 1, 1, 2],
            description: "D Major 7th",
            variant: "Open Position",
          },
          Fmaj7: {
            name: "Fmaj7",
            fingering: "2400",
            fingers: [2, 4, null, null],
            description: "F Major 7th",
            variant: "Open Position",
          },
          Gmaj7: {
            name: "Gmaj7",
            fingering: "0222",
            fingers: [null, 1, 2, 3],
            description: "G Major 7th",
            variant: "Open Position",
          },
          Amaj7: {
            name: "Amaj7",
            fingering: "1100",
            fingers: [1, 1, null, null],
            description: "A Major 7th",
            variant: "Open Position",
          },

          // Sus Chords
          Csus2: {
            name: "Csus2",
            fingering: "0233",
            fingers: [null, 2, 3, 3],
            description: "C Suspended 2nd",
            variant: "Open Position",
          },
          Csus4: {
            name: "Csus4",
            fingering: "0013",
            fingers: [null, null, 1, 3],
            description: "C Suspended 4th",
            variant: "Open Position",
          },
          Dsus2: {
            name: "Dsus2",
            fingering: "2200",
            fingers: [2, 2, null, null],
            description: "D Suspended 2nd",
            variant: "Open Position",
          },
          Dsus4: {
            name: "Dsus4",
            fingering: "2230",
            fingers: [2, 2, 3, null],
            description: "D Suspended 4th",
            variant: "Open Position",
          },
          Fsus2: {
            name: "Fsus2",
            fingering: "0011",
            fingers: [null, null, 1, 1],
            description: "F Suspended 2nd",
            variant: "Open Position",
          },
          Gsus2: {
            name: "Gsus2",
            fingering: "0230",
            fingers: [null, 2, 3, null],
            description: "G Suspended 2nd",
            variant: "Open Position",
          },
          Gsus4: {
            name: "Gsus4",
            fingering: "0233",
            fingers: [null, 2, 3, 3],
            description: "G Suspended 4th",
            variant: "Open Position",
          },
          Asus2: {
            name: "Asus2",
            fingering: "2400",
            fingers: [2, 4, null, null],
            description: "A Suspended 2nd",
            variant: "Open Position",
          },
          Asus4: {
            name: "Asus4",
            fingering: "2200",
            fingers: [2, 2, null, null],
            description: "A Suspended 4th",
            variant: "Open Position",
          },

          // Diminished & Augmented
          Adim: {
            name: "Adim",
            fingering: "2323",
            fingers: [1, 2, 1, 2],
            description: "A Diminished",
            variant: "2nd fret",
          },
          Cdim: {
            name: "Cdim",
            fingering: "0101",
            fingers: [null, 1, null, 1],
            description: "C Diminished",
            variant: "Open Position",
          },
          Ddim: {
            name: "Ddim",
            fingering: "1212",
            fingers: [1, 2, 1, 2],
            description: "D Diminished",
            variant: "1st fret",
          },
          Caug: {
            name: "Caug",
            fingering: "1003",
            fingers: [1, null, null, 3],
            description: "C Augmented",
            variant: "Open Position",
          },
          Faug: {
            name: "Faug",
            fingering: "2110",
            fingers: [2, 1, 1, null],
            description: "F Augmented",
            variant: "Open Position",
          },

          // 9th Chords
          C9: {
            name: "C9",
            fingering: "0201",
            fingers: [null, 2, null, 1],
            description: "C Dominant 9th",
            variant: "Open Position",
          },
          D9: {
            name: "D9",
            fingering: "2423",
            fingers: [2, 4, 1, 3],
            description: "D Dominant 9th",
            variant: "2nd fret",
          },
          G9: {
            name: "G9",
            fingering: "0213",
            fingers: [null, 2, 1, 3],
            description: "G Dominant 9th",
            variant: "Open Position",
          },

          // 6th Chords
          C6: {
            name: "C6",
            fingering: "0000",
            fingers: [null, null, null, null],
            description: "C Major 6th",
            variant: "Open Position",
          },
          F6: {
            name: "F6",
            fingering: "2213",
            fingers: [2, 2, 1, 3],
            description: "F Major 6th",
            variant: "Open Position",
          },
          G6: {
            name: "G6",
            fingering: "0202",
            fingers: [null, 2, null, 2],
            description: "G Major 6th",
            variant: "Open Position",
          },
          Am6: {
            name: "Am6",
            fingering: "2020",
            fingers: [2, null, 2, null],
            description: "A Minor 6th",
            variant: "Open Position",
          },

          // Add/9 Chords
          Cadd9: {
            name: "Cadd9",
            fingering: "0203",
            fingers: [null, 2, null, 3],
            description: "C Add 9",
            variant: "Open Position",
          },
          Dadd9: {
            name: "Dadd9",
            fingering: "2420",
            fingers: [2, 4, 2, null],
            description: "D Add 9",
            variant: "Open Position",
          },
          Fadd9: {
            name: "Fadd9",
            fingering: "0211",
            fingers: [null, 2, 1, 1],
            description: "F Add 9",
            variant: "Open Position",
          },
          Gadd9: {
            name: "Gadd9",
            fingering: "0432",
            fingers: [null, 4, 3, 2],
            description: "G Add 9",
            variant: "Open Position",
          },
        },
        tips: [
          {
            title: "Ukulele Basics",
            content:
              "Start with C, G, Am, and F - these four chords can play hundreds of songs! Practice smooth transitions.",
          },
          {
            title: "Strumming Patterns",
            content:
              "Learn Down-Down-Up-Up-Down-Up (D-D-U-U-D-U) as your go-to strumming pattern.",
          },
        ],
      },
      mandolin: {
        name: "Mandolin",
        tuning: ["G", "D", "A", "E"],
        openStringFreqs: [196.0, 293.66, 440.0, 659.25],
        scalePatterns: {
          major: [
            {
              name: "Pattern 1 (Root)",
              frets: [
                [0, 2],
                [0, 2],
                [0, 2],
                [0, 3],
              ],
            },
            {
              name: "Pattern 2",
              frets: [
                [2, 4],
                [2, 4],
                [2, 4],
                [3, 5],
              ],
            },
            {
              name: "Pattern 3",
              frets: [
                [4, 7],
                [4, 7],
                [4, 6],
                [5, 7],
              ],
            },
            {
              name: "Pattern 4",
              frets: [
                [7, 9],
                [7, 9],
                [6, 9],
                [7, 10],
              ],
            },
            {
              name: "Pattern 5",
              frets: [
                [9, 12],
                [9, 12],
                [9, 11],
                [10, 12],
              ],
            },
          ],
          minor: [
            {
              name: "Pattern 1 (Root)",
              frets: [
                [0, 3],
                [0, 3],
                [0, 2],
                [0, 3],
              ],
            },
            {
              name: "Pattern 2",
              frets: [
                [3, 5],
                [3, 5],
                [2, 5],
                [3, 5],
              ],
            },
          ],
          pentatonicMajor: [
            {
              name: "Pattern 1 (Root)",
              frets: [
                [0, 2],
                [0, 2],
                [0, 2],
                [0, 3],
              ],
            },
          ],
          pentatonicMinor: [
            {
              name: "Box 1 (Root)",
              frets: [
                [0, 3],
                [0, 3],
                [0, 2],
                [0, 3],
              ],
            },
            {
              name: "Box 2",
              frets: [
                [3, 5],
                [3, 5],
                [2, 5],
                [3, 5],
              ],
            },
            {
              name: "Box 3",
              frets: [
                [5, 8],
                [5, 7],
                [5, 7],
                [5, 8],
              ],
            },
            {
              name: "Box 4",
              frets: [
                [8, 10],
                [7, 10],
                [7, 9],
                [8, 10],
              ],
            },
            {
              name: "Box 5",
              frets: [
                [10, 12],
                [10, 12],
                [9, 12],
                [10, 12],
              ],
            },
          ],
          blues: [
            {
              name: "Pattern 1 (Root)",
              frets: [
                [0, 3],
                [0, 3],
                [0, 2],
                [0, 3],
              ],
            },
          ],
          dorian: [
            {
              name: "Pattern 1 (Root)",
              frets: [
                [0, 3],
                [0, 3],
                [0, 2],
                [0, 3],
              ],
            },
          ],
          mixolydian: [
            {
              name: "Pattern 1 (Root)",
              frets: [
                [0, 2],
                [0, 2],
                [0, 2],
                [0, 3],
              ],
            },
          ],
          lydian: [
            {
              name: "Pattern 1 (Root)",
              frets: [
                [0, 2],
                [0, 2],
                [0, 2],
                [0, 3],
              ],
            },
          ],
        },
        chords: {
          // Major Chords
          C: {
            name: "C",
            fingering: "0230",
            fingers: [null, 2, 3, null],
            description: "C Major",
            variant: "Open Position",
          },
          C_alt: {
            name: "C",
            fingering: "5453",
            fingers: [4, 3, 4, 2],
            description: "C Major",
            variant: "5th fret",
          },
          D: {
            name: "D",
            fingering: "0202",
            fingers: [null, 2, null, 2],
            description: "D Major",
            variant: "Open Position",
          },
          D_alt: {
            name: "D",
            fingering: "7574",
            fingers: [3, 2, 3, 1],
            description: "D Major",
            variant: "7th fret",
          },
          E: {
            name: "E",
            fingering: "2404",
            fingers: [1, 3, null, 4],
            description: "E Major",
            variant: "Open Position",
          },
          E_alt: {
            name: "E",
            fingering: "9796",
            fingers: [3, 2, 3, 1],
            description: "E Major",
            variant: "9th fret",
          },
          F: {
            name: "F",
            fingering: "1301",
            fingers: [1, 3, null, 1],
            description: "F Major",
            variant: "Open Position",
          },
          F_alt: {
            name: "F",
            fingering: "5535",
            fingers: [2, 2, 1, 2],
            description: "F Major",
            variant: "5th fret",
          },
          G: {
            name: "G",
            fingering: "0003",
            fingers: [null, null, null, 3],
            description: "G Major",
            variant: "Open Position",
          },
          G_alt: {
            name: "G",
            fingering: "3023",
            fingers: [3, null, 2, 3],
            description: "G Major",
            variant: "3rd fret",
          },
          A: {
            name: "A",
            fingering: "2002",
            fingers: [2, null, null, 2],
            description: "A Major",
            variant: "Open Position",
          },
          A_barre: {
            name: "A",
            fingering: "2222",
            fingers: [1, 1, 1, 1],
            description: "A Major",
            variant: "Barre 2nd fret",
          },
          B: {
            name: "B",
            fingering: "4004",
            fingers: [3, null, null, 4],
            description: "B Major",
            variant: "Open Position",
          },
          Bb: {
            name: "Bb",
            fingering: "3113",
            fingers: [3, 1, 1, 3],
            description: "B♭ Major",
            variant: "3rd fret",
          },

          // Minor Chords
          Am: {
            name: "Am",
            fingering: "2210",
            fingers: [2, 2, 1, null],
            description: "A Minor",
            variant: "Open Position",
          },
          Am_alt: {
            name: "Am",
            fingering: "5355",
            fingers: [3, 1, 3, 3],
            description: "A Minor",
            variant: "5th fret",
          },
          Dm: {
            name: "Dm",
            fingering: "0231",
            fingers: [null, 2, 3, 1],
            description: "D Minor",
            variant: "Open Position",
          },
          Dm_alt: {
            name: "Dm",
            fingering: "7565",
            fingers: [4, 2, 3, 2],
            description: "D Minor",
            variant: "7th fret",
          },
          Em: {
            name: "Em",
            fingering: "0200",
            fingers: [null, 2, null, null],
            description: "E Minor",
            variant: "Open Position",
          },
          Em_alt: {
            name: "Em",
            fingering: "9787",
            fingers: [4, 2, 3, 2],
            description: "E Minor",
            variant: "9th fret",
          },
          Fm: {
            name: "Fm",
            fingering: "1001",
            fingers: [1, null, null, 1],
            description: "F Minor",
            variant: "Open Position",
          },
          Gm: {
            name: "Gm",
            fingering: "0113",
            fingers: [null, 1, 1, 3],
            description: "G Minor",
            variant: "Open Position",
          },
          Bm: {
            name: "Bm",
            fingering: "2014",
            fingers: [2, null, 1, 4],
            description: "B Minor",
            variant: "Open Position",
          },
          Cm: {
            name: "Cm",
            fingering: "0013",
            fingers: [null, null, 1, 3],
            description: "C Minor",
            variant: "Open Position",
          },

          // 7th Chords
          C7: {
            name: "C7",
            fingering: "0210",
            fingers: [null, 2, 1, null],
            description: "C Dominant 7th",
            variant: "Open Position",
          },
          C7_alt: {
            name: "C7",
            fingering: "3233",
            fingers: [3, 2, 3, 3],
            description: "C Dominant 7th",
            variant: "3rd fret",
          },
          D7: {
            name: "D7",
            fingering: "0200",
            fingers: [null, 2, null, null],
            description: "D Dominant 7th",
            variant: "Open Position",
          },
          E7: {
            name: "E7",
            fingering: "2400",
            fingers: [2, 4, null, null],
            description: "E Dominant 7th",
            variant: "Open Position",
          },
          F7: {
            name: "F7",
            fingering: "1311",
            fingers: [1, 3, 1, 1],
            description: "F Dominant 7th",
            variant: "1st fret",
          },
          G7: {
            name: "G7",
            fingering: "0001",
            fingers: [null, null, null, 1],
            description: "G Dominant 7th",
            variant: "Open Position",
          },
          A7: {
            name: "A7",
            fingering: "2000",
            fingers: [2, null, null, null],
            description: "A Dominant 7th",
            variant: "Open Position",
          },
          B7: {
            name: "B7",
            fingering: "4202",
            fingers: [4, 2, null, 2],
            description: "B Dominant 7th",
            variant: "Open Position",
          },

          // Minor 7th Chords
          Am7: {
            name: "Am7",
            fingering: "2010",
            fingers: [2, null, 1, null],
            description: "A Minor 7th",
            variant: "Open Position",
          },
          Dm7: {
            name: "Dm7",
            fingering: "0211",
            fingers: [null, 2, 1, 1],
            description: "D Minor 7th",
            variant: "Open Position",
          },
          Em7: {
            name: "Em7",
            fingering: "0000",
            fingers: [null, null, null, null],
            description: "E Minor 7th",
            variant: "Open Position",
          },
          Fm7: {
            name: "Fm7",
            fingering: "1311",
            fingers: [1, 3, 1, 1],
            description: "F Minor 7th",
            variant: "1st fret",
          },
          Gm7: {
            name: "Gm7",
            fingering: "0111",
            fingers: [null, 1, 1, 1],
            description: "G Minor 7th",
            variant: "Open Position",
          },
          Cm7: {
            name: "Cm7",
            fingering: "0313",
            fingers: [null, 3, 1, 3],
            description: "C Minor 7th",
            variant: "Open Position",
          },

          // Major 7th Chords
          Cmaj7: {
            name: "Cmaj7",
            fingering: "0220",
            fingers: [null, 2, 2, null],
            description: "C Major 7th",
            variant: "Open Position",
          },
          Dmaj7: {
            name: "Dmaj7",
            fingering: "0201",
            fingers: [null, 2, null, 1],
            description: "D Major 7th",
            variant: "Open Position",
          },
          Emaj7: {
            name: "Emaj7",
            fingering: "2404",
            fingers: [1, 3, null, 4],
            description: "E Major 7th",
            variant: "Open Position",
          },
          Fmaj7: {
            name: "Fmaj7",
            fingering: "1200",
            fingers: [1, 2, null, null],
            description: "F Major 7th",
            variant: "Open Position",
          },
          Gmaj7: {
            name: "Gmaj7",
            fingering: "0002",
            fingers: [null, null, null, 2],
            description: "G Major 7th",
            variant: "Open Position",
          },
          Amaj7: {
            name: "Amaj7",
            fingering: "2001",
            fingers: [2, null, null, 1],
            description: "A Major 7th",
            variant: "Open Position",
          },

          // Sus Chords
          Csus2: {
            name: "Csus2",
            fingering: "0200",
            fingers: [null, 2, null, null],
            description: "C Suspended 2nd",
            variant: "Open Position",
          },
          Csus4: {
            name: "Csus4",
            fingering: "0240",
            fingers: [null, 2, 4, null],
            description: "C Suspended 4th",
            variant: "Open Position",
          },
          Dsus2: {
            name: "Dsus2",
            fingering: "0000",
            fingers: [null, null, null, null],
            description: "D Suspended 2nd",
            variant: "Open Position",
          },
          Dsus4: {
            name: "Dsus4",
            fingering: "0203",
            fingers: [null, 2, null, 3],
            description: "D Suspended 4th",
            variant: "Open Position",
          },
          Fsus2: {
            name: "Fsus2",
            fingering: "1101",
            fingers: [1, 1, null, 1],
            description: "F Suspended 2nd",
            variant: "1st fret",
          },
          Gsus2: {
            name: "Gsus2",
            fingering: "0002",
            fingers: [null, null, null, 2],
            description: "G Suspended 2nd",
            variant: "Open Position",
          },
          Gsus4: {
            name: "Gsus4",
            fingering: "0013",
            fingers: [null, null, 1, 3],
            description: "G Suspended 4th",
            variant: "Open Position",
          },
          Asus2: {
            name: "Asus2",
            fingering: "2202",
            fingers: [2, 2, null, 2],
            description: "A Suspended 2nd",
            variant: "Open Position",
          },
          Asus4: {
            name: "Asus4",
            fingering: "2032",
            fingers: [2, null, 3, 2],
            description: "A Suspended 4th",
            variant: "Open Position",
          },

          // Diminished & Augmented
          Adim: {
            name: "Adim",
            fingering: "2313",
            fingers: [2, 3, 1, 4],
            description: "A Diminished",
            variant: "2nd fret",
          },
          Cdim: {
            name: "Cdim",
            fingering: "0130",
            fingers: [null, 1, 3, null],
            description: "C Diminished",
            variant: "Open Position",
          },
          Ddim: {
            name: "Ddim",
            fingering: "0101",
            fingers: [null, 1, null, 1],
            description: "D Diminished",
            variant: "Open Position",
          },
          Gdim: {
            name: "Gdim",
            fingering: "0212",
            fingers: [null, 2, 1, 2],
            description: "G Diminished",
            variant: "Open Position",
          },
          Caug: {
            name: "Caug",
            fingering: "0231",
            fingers: [null, 2, 3, 1],
            description: "C Augmented",
            variant: "Open Position",
          },
          Faug: {
            name: "Faug",
            fingering: "1402",
            fingers: [1, 4, null, 2],
            description: "F Augmented",
            variant: "Open Position",
          },

          // 9th Chords
          C9: {
            name: "C9",
            fingering: "0230",
            fingers: [null, 2, 3, null],
            description: "C Dominant 9th",
            variant: "Open Position",
          },
          D9: {
            name: "D9",
            fingering: "0212",
            fingers: [null, 2, 1, 2],
            description: "D Dominant 9th",
            variant: "Open Position",
          },
          G9: {
            name: "G9",
            fingering: "0203",
            fingers: [null, 2, null, 3],
            description: "G Dominant 9th",
            variant: "Open Position",
          },

          // 6th Chords
          C6: {
            name: "C6",
            fingering: "0030",
            fingers: [null, null, 3, null],
            description: "C Major 6th",
            variant: "Open Position",
          },
          D6: {
            name: "D6",
            fingering: "0204",
            fingers: [null, 2, null, 4],
            description: "D Major 6th",
            variant: "Open Position",
          },
          F6: {
            name: "F6",
            fingering: "1303",
            fingers: [1, 3, null, 3],
            description: "F Major 6th",
            variant: "1st fret",
          },
          G6: {
            name: "G6",
            fingering: "0003",
            fingers: [null, null, null, 3],
            description: "G Major 6th",
            variant: "Open Position",
          },
          Am6: {
            name: "Am6",
            fingering: "2010",
            fingers: [2, null, 1, null],
            description: "A Minor 6th",
            variant: "Open Position",
          },

          // Add/9 Chords
          Cadd9: {
            name: "Cadd9",
            fingering: "0032",
            fingers: [null, null, 3, 2],
            description: "C Add 9",
            variant: "Open Position",
          },
          Dadd9: {
            name: "Dadd9",
            fingering: "0002",
            fingers: [null, null, null, 2],
            description: "D Add 9",
            variant: "Open Position",
          },
          Fadd9: {
            name: "Fadd9",
            fingering: "1001",
            fingers: [1, null, null, 1],
            description: "F Add 9",
            variant: "Open Position",
          },
          Gadd9: {
            name: "Gadd9",
            fingering: "0005",
            fingers: [null, null, null, 4],
            description: "G Add 9",
            variant: "Open Position",
          },

          // Power Chords (simplified for mandolin)
          C5: {
            name: "C5",
            fingering: "0030",
            fingers: [null, null, 3, null],
            description: "C Power Chord",
            variant: "Open Position",
          },
          D5: {
            name: "D5",
            fingering: "0002",
            fingers: [null, null, null, 2],
            description: "D Power Chord",
            variant: "Open Position",
          },
          G5: {
            name: "G5",
            fingering: "0000",
            fingers: [null, null, null, null],
            description: "G Power Chord",
            variant: "Open Position",
          },
          A5: {
            name: "A5",
            fingering: "2000",
            fingers: [2, null, null, null],
            description: "A Power Chord",
            variant: "Open Position",
          },
        },
        tips: [
          {
            title: "Mandolin Basics",
            content:
              "Mandolin strings come in pairs tuned to the same pitch. Pick both strings together for full sound.",
          },
          {
            title: "Tremolo Technique",
            content:
              "Practice tremolo picking - rapid alternating picking to sustain notes. Essential for mandolin expression.",
          },
        ],
      },
    };
  }

  getInstrument(instrumentName) {
    return this.instruments[instrumentName];
  }

  getScaleIntervals(scaleName) {
    return this.scaleIntervals[scaleName] || this.scaleIntervals.major;
  }

  getScaleInfo(scaleName) {
    return this.scaleInfo[scaleName];
  }

  getNoteNames() {
    return this.noteNames;
  }

  getAllInstruments() {
    return Object.keys(this.instruments);
  }

  getAllScales() {
    return Object.keys(this.scaleIntervals);
  }
}
