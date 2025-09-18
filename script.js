// Simple Web Audio API Synthesizer
class SimpleAudioSynth {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.5;
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error("Audio initialization failed:", error);
      return false;
    }
  }

  setVolume(volume) {
    if (this.masterGain) {
      this.masterGain.gain.value = volume;
    }
  }

  playNote(frequency, duration = 0.5) {
    if (!this.isInitialized || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(
      frequency,
      this.audioContext.currentTime
    );

    const attackTime = 0.01;
    const releaseTime = 0.3;
    const sustainLevel = 0.3;

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      sustainLevel,
      this.audioContext.currentTime + attackTime
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioContext.currentTime + duration
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration + releaseTime);
  }

  playChord(frequencies, duration = 2.0) {
    if (!this.isInitialized || !this.audioContext) return;

    frequencies.forEach((frequency, index) => {
      setTimeout(() => {
        this.playNote(frequency, duration);
      }, index * 30);
    });
  }
}

// Multi-Instrument Scales Interactive Tool
class MultiInstrumentApp {
  constructor() {
    this.selectedScale = "major";
    this.selectedKey = "C";
    this.selectedPattern = 0;
    this.currentInstrument = "guitar";
    this.isPlaying = false;
    this.isPlayingFullNeck = false;
    this.isShowingFullNeck = false;
    this.currentNote = -1;
    this.currentPlayingFret = { string: -1, fret: -1 };
    this.showInfo = false;
    this.tempo = 120;
    this.isDarkMode = true;
    this.audioSynth = new SimpleAudioSynth();
    this.activeTab = "scales";
    this.masterVolume = 0.5;
    this.noteDuration = 0.5;

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

          // Add some 9th chords
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
            content: "Start with open chords like G, C, D, Em, and Am. These form the foundation of thousands of songs."
          },
          {
            title: "Barre Chords",
            content: "Once comfortable with open chords, learn F and Bm barre chords to unlock playing in all keys."
          },
        ]
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
            content: "Start with C, G, Am, and F - these four chords can play hundreds of songs! Practice smooth transitions."
          },
          {
            title: "Strumming Patterns",
            content: "Learn Down-Down-Up-Up-Down-Up (D-D-U-U-D-U) as your go-to strumming pattern."
          },
        ]
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
            content: "Mandolin strings come in pairs tuned to the same pitch. Pick both strings together for full sound."
          },
          {
            title: "Tremolo Technique",
            content: "Practice tremolo picking - rapid alternating picking to sustain notes. Essential for mandolin expression."
          },
        ]
      },
    };

    this.filteredChords = {};
    this.init();
  }

  get currentInstrumentConfig() {
    return this.instruments[this.currentInstrument];
  }

  get tuning() {
    return this.currentInstrumentConfig.tuning;
  }

  get scalePatterns() {
    return this.currentInstrumentConfig.scalePatterns;
  }

  get chords() {
    return this.currentInstrumentConfig.chords;
  }

  init() {
    this.setupEventListeners();
    this.switchInstrument('guitar');
    this.updateAudioStatus();
  }

  setupEventListeners() {
    // Initialize audio button
    document
      .getElementById("initAudioBtn")
      .addEventListener("click", async () => {
        const success = await this.audioSynth.initialize();
        this.updateAudioStatus();
      });

    // Volume controls
    document
      .getElementById("masterVolumeSlider")
      .addEventListener("input", (e) => {
        this.masterVolume = parseInt(e.target.value) / 100;
        this.audioSynth.setVolume(this.masterVolume);
        document.getElementById(
          "masterVolumeValue"
        ).textContent = `${e.target.value}%`;
      });

    document
      .getElementById("noteDurationSlider")
      .addEventListener("input", (e) => {
        this.noteDuration = parseInt(e.target.value) / 1000;
        document.getElementById(
          "noteDurationValue"
        ).textContent = `${this.noteDuration.toFixed(1)}s`;
      });

    // Theme toggle
    document.getElementById("themeToggle").addEventListener("click", () => {
      this.toggleTheme();
    });

    // Instrument navigation
    document.querySelectorAll(".instrument-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        this.switchInstrument(e.target.dataset.instrument);
      });
    });

    // Tab navigation
    document.querySelectorAll(".tab-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        this.switchTab(e.target.dataset.tab);
      });
    });

    // Scale controls
    document.getElementById("scaleSelect").addEventListener("change", (e) => {
      this.selectedScale = e.target.value;
      this.updatePatternOptions();
      this.generateFretboard();
      this.updateInfo();
    });

    document.getElementById("keySelect").addEventListener("change", (e) => {
      this.selectedKey = e.target.value;
      this.generateFretboard();
      this.updateInfo();
    });

    document.getElementById("patternSelect").addEventListener("change", (e) => {
      this.selectedPattern = parseInt(e.target.value);
      this.generateFretboard();
      this.updateInfo();
    });

    // Tempo slider
    document.getElementById("tempoSlider").addEventListener("input", (e) => {
      this.tempo = parseInt(e.target.value);
      document.getElementById("tempoValue").textContent = this.tempo;
    });

    // Play buttons
    document.getElementById("playButton").addEventListener("click", () => {
      if (this.isPlaying) {
        this.stopPlaying();
      } else {
        this.playScale();
      }
    });

    document.getElementById("playFullNeckBtn").addEventListener("click", () => {
      this.toggleFullNeckView();
    });

    // Info button
    document.getElementById("infoButton").addEventListener("click", () => {
      this.toggleInfo();
    });

    // Chord search
    document
      .getElementById("chordSearchInput")
      .addEventListener("input", (e) => {
        this.filterChords(e.target.value);
      });
  }

  switchInstrument(instrument) {
    this.currentInstrument = instrument;

    // Update instrument navigation
    document.querySelectorAll(".instrument-button").forEach((button) => {
      button.classList.remove("active");
      if (button.dataset.instrument === instrument) {
        button.classList.add("active");
      }
    });

    // Update title
    document.getElementById("instrumentTitle").textContent = this.currentInstrumentConfig.name;

    // Reset to pattern view
    this.isShowingFullNeck = false;
    document.getElementById("fullNeckIcon").textContent = "🎸";
    document.getElementById("fullNeckText").textContent = "Full Neck Scale";

    // Update UI for new instrument
    this.updatePatternOptions();
    this.generateFretboard();
    this.updateInfo();
    this.filteredChords = { ...this.chords };
    this.generateChordChart();
    this.updateTips();
  }

  updateTips() {
    const tipsGrid = document.getElementById("tipsGrid");
    const instrumentTips = this.currentInstrumentConfig.tips;
    
    // Clear existing tips and add instrument-specific ones
    tipsGrid.innerHTML = '';
    
    // Add common tips
    const commonTips = [
      {
        title: "Getting Started",
        content: `Start with Pattern 1 and learn it thoroughly<br />
          • Practice slowly with a metronome<br />
          • Focus on clean fretting and picking<br />
          • Memorize the root note positions`
      },
      {
        title: "Using This Tool", 
        content: `Click "Initialize Audio" first to enable sound<br />
          • Click any note on the fretboard to hear it<br />
          • Try "Full Neck Scale" for complete practice<br />
          • Use the chord chart for rhythm practice`
      }
    ];

    // Add all tips
    [...commonTips, ...instrumentTips].forEach(tip => {
      const tipSection = document.createElement("div");
      tipSection.className = "tips-section";
      tipSection.innerHTML = `
        <h3 class="tips-section-title">${tip.title}</h3>
        <div class="tips-list">${tip.content}</div>
      `;
      tipsGrid.appendChild(tipSection);
    });
  }

  updateAudioStatus() {
    const statusDiv = document.getElementById("audioStatus");
    const initBtn = document.getElementById("initAudioBtn");

    if (this.audioSynth.isInitialized) {
      statusDiv.textContent = "🔊 Audio ready! Click notes to hear them play.";
      statusDiv.className = "audio-status success";
      initBtn.textContent = "🔊 Audio Ready";
      initBtn.disabled = true;

      // Enable play buttons
      document.getElementById("playButton").disabled = false;
      document.getElementById("playFullNeckBtn").disabled = false;
      document.querySelectorAll(".play-chord-btn").forEach((btn) => {
        btn.disabled = false;
      });
    } else {
      statusDiv.textContent =
        "Click 'Initialize Audio' to enable sound playback";
      statusDiv.className = "audio-status";
      initBtn.disabled = false;
    }
  }

  switchTab(tabName) {
    this.activeTab = tabName;

    document.querySelectorAll(".tab-button").forEach((button) => {
      button.classList.remove("active");
      if (button.dataset.tab === tabName) {
        button.classList.add("active");
      }
    });

    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.remove("active");
    });
    document.getElementById(`${tabName}-tab`).classList.add("active");
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.body.setAttribute(
      "data-theme",
      this.isDarkMode ? "dark" : "light"
    );
    const themeIcon = document.getElementById("themeIcon");
    const themeText = document.getElementById("themeText");
    if (this.isDarkMode) {
      themeIcon.textContent = "☀️";
      themeText.textContent = "Light";
    } else {
      themeIcon.textContent = "☾";
      themeText.textContent = "Dark";
    }
  }

  updatePatternOptions() {
    const patternSelect = document.getElementById("patternSelect");
    const patterns = this.scalePatterns[this.selectedScale] || this.scalePatterns.major;
    const currentPattern = this.selectedPattern;
    patternSelect.innerHTML = "";
    patterns.forEach((pattern, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = pattern.name;
      patternSelect.appendChild(option);
    });
    if (currentPattern < patterns.length) {
      this.selectedPattern = currentPattern;
    } else {
      this.selectedPattern = 0;
    }
    patternSelect.value = this.selectedPattern;

    // Reset to pattern view when changing scales
    if (this.isShowingFullNeck) {
      this.isShowingFullNeck = false;
      document.getElementById("fullNeckIcon").textContent = "🎸";
      document.getElementById("fullNeckText").textContent = "Full Neck Scale";
    }
  }

  getNoteAtFret(string, fret) {
    const openNote = this.tuning[string];
    const openNoteIndex = this.noteNames.indexOf(openNote);
    const noteIndex = (openNoteIndex + fret) % 12;
    return this.noteNames[noteIndex];
  }

  getFreqForFret(string, fret) {
    const openStringFreqs = this.currentInstrumentConfig.openStringFreqs;
    const frequency = openStringFreqs[string] * Math.pow(2, fret / 12);
    return frequency;
  }

  getScaleNotes() {
    const rootIndex = this.noteNames.indexOf(this.selectedKey);
    const intervals =
      this.scaleIntervals[this.selectedScale] || this.scaleIntervals.major;
    return intervals.map(
      (interval) => this.noteNames[(rootIndex + interval) % 12]
    );
  }

  isInScale(note) {
    const scaleNotes = this.getScaleNotes();
    return scaleNotes.includes(note);
  }

  getPatternFrets() {
    const patterns = this.scalePatterns[this.selectedScale] || this.scalePatterns.major;
    return patterns[this.selectedPattern] || patterns[0];
  }

  getFullNeckPattern() {
    const pattern = [];
    const stringCount = this.tuning.length;

    // Create pattern based on instrument string count
    const positions = this.currentInstrument === 'guitar' ? [
      { start: 0, end: 3, strings: [0, 1, 2] }, 
      { start: 2, end: 5, strings: [1, 2, 3] }, 
      { start: 4, end: 7, strings: [2, 3, 4] }, 
      { start: 7, end: 10, strings: [3, 4, 5] }, 
      { start: 9, end: 12, strings: [4, 5] }, 
    ] : [
      { start: 0, end: 4, strings: [0, 1] }, 
      { start: 3, end: 7, strings: [1, 2] }, 
      { start: 6, end: 10, strings: [2, 3] }, 
      { start: 9, end: 12, strings: [2, 3] }, 
    ];

    positions.forEach((pos, posIndex) => {
      const positionNotes = [];

      pos.strings.forEach((string) => {
        if (string < stringCount) {
          for (let fret = pos.start; fret <= pos.end; fret++) {
            const note = this.getNoteAtFret(string, fret);
            if (this.isInScale(note)) {
              const frequency = this.getFreqForFret(string, fret);
              positionNotes.push({
                note,
                string,
                fret,
                frequency,
                isRoot: note === this.selectedKey,
                position: posIndex,
              });
            }
          }
        }
      });

      positionNotes.sort((a, b) => a.frequency - b.frequency);
      const selectedNotes = positionNotes.filter((note, index) => {
        return index % 2 === 0 || note.isRoot;
      });

      pattern.push(...selectedNotes);
    });

    return pattern;
  }

  generateFullNeckFretboard() {
    const stringsContainer = document.getElementById("strings");
    stringsContainer.innerHTML = "";
    const fullNeckPattern = this.getFullNeckPattern();

    const patternPositions = new Set();
    fullNeckPattern.forEach((note) => {
      patternPositions.add(`${note.string}-${note.fret}`);
    });

    this.tuning
      .slice()
      .reverse()
      .forEach((openNote, reverseIndex) => {
        const stringIndex = this.tuning.length - 1 - reverseIndex;
        const stringDiv = document.createElement("div");
        stringDiv.className = "string";
        const stringName = document.createElement("div");
        stringName.className = "string-name";
        stringName.textContent = openNote;
        stringDiv.appendChild(stringName);

        for (let fret = 0; fret <= 12; fret++) {
          const fretSpace = document.createElement("div");
          fretSpace.className = "fret-space";
          fretSpace.dataset.string = stringIndex;
          fretSpace.dataset.fret = fret;

          fretSpace.addEventListener("click", () => {
            if (this.audioSynth.isInitialized) {
              const frequency = this.getFreqForFret(stringIndex, fret);
              this.audioSynth.playNote(frequency, this.noteDuration);

              fretSpace.style.transform = "scale(1.2)";
              setTimeout(() => {
                fretSpace.style.transform = "";
              }, 200);
            }
          });

          if ([3, 5, 7, 9, 12].includes(fret)) {
            fretSpace.classList.add("has-marker");
          }

          const note = this.getNoteAtFret(stringIndex, fret);
          const inScale = this.isInScale(note);
          const inFullNeckPattern = patternPositions.has(
            `${stringIndex}-${fret}`
          );
          const isRoot = note === this.selectedKey;
          const isOpen = fret === 0;

          if (inFullNeckPattern) {
            fretSpace.textContent = note;
            if (isRoot) {
              fretSpace.classList.add("note-root");
            } else if (isOpen) {
              fretSpace.classList.add("note-open");
            } else {
              fretSpace.classList.add("note-pattern");
            }
          } else if (isOpen && inScale) {
            fretSpace.textContent = note;
            fretSpace.classList.add("note-scale");
          } else if (inScale) {
            fretSpace.textContent = note;
            fretSpace.classList.add("note-scale");
          }
          stringDiv.appendChild(fretSpace);
        }
        stringsContainer.appendChild(stringDiv);
      });

    document.getElementById("fretboardTitle").textContent =
      "Full Neck Scale Pattern";
  }

  toggleFullNeckView() {
    this.isShowingFullNeck = !this.isShowingFullNeck;

    if (this.isShowingFullNeck) {
      this.generateFullNeckFretboard();
      document.getElementById("fullNeckIcon").textContent = "🎵";
      document.getElementById("fullNeckText").textContent = "Show Patterns";
    } else {
      this.generateFretboard();
      document.getElementById("fullNeckIcon").textContent = "🎸";
      document.getElementById("fullNeckText").textContent = "Full Neck Scale";
    }
  }

  generateFretboard() {
    if (this.isShowingFullNeck) {
      this.generateFullNeckFretboard();
      return;
    }

    const stringsContainer = document.getElementById("strings");
    stringsContainer.innerHTML = "";
    const patternFrets = this.getPatternFrets();

    this.tuning
      .slice()
      .reverse()
      .forEach((openNote, reverseIndex) => {
        const stringIndex = this.tuning.length - 1 - reverseIndex;
        const stringDiv = document.createElement("div");
        stringDiv.className = "string";
        const stringName = document.createElement("div");
        stringName.className = "string-name";
        stringName.textContent = openNote;
        stringDiv.appendChild(stringName);

        for (let fret = 0; fret <= 12; fret++) {
          const fretSpace = document.createElement("div");
          fretSpace.className = "fret-space";
          fretSpace.dataset.string = stringIndex;
          fretSpace.dataset.fret = fret;

          fretSpace.addEventListener("click", () => {
            if (this.audioSynth.isInitialized) {
              const frequency = this.getFreqForFret(stringIndex, fret);
              this.audioSynth.playNote(frequency, this.noteDuration);

              fretSpace.style.transform = "scale(1.2)";
              setTimeout(() => {
                fretSpace.style.transform = "";
              }, 200);
            }
          });

          if ([3, 5, 7, 9, 12].includes(fret)) {
            fretSpace.classList.add("has-marker");
          }
          const note = this.getNoteAtFret(stringIndex, fret);
          const inScale = this.isInScale(note);
          const inPattern =
            fret >= patternFrets.frets[stringIndex][0] &&
            fret <= patternFrets.frets[stringIndex][1];
          const isRoot = note === this.selectedKey;
          const isOpen = fret === 0;

          if (inPattern && inScale) {
            fretSpace.textContent = note;
            if (isRoot) {
              fretSpace.classList.add("note-root");
            } else if (isOpen) {
              fretSpace.classList.add("note-open");
            } else {
              fretSpace.classList.add("note-pattern");
            }
          } else if (isOpen && inScale) {
            fretSpace.textContent = note;
            fretSpace.classList.add("note-open");
          } else if (inScale) {
            fretSpace.textContent = note;
            fretSpace.classList.add("note-scale");
          }
          stringDiv.appendChild(fretSpace);
        }
        stringsContainer.appendChild(stringDiv);
      });
    document.getElementById(
      "fretboardTitle"
    ).textContent = `Fretboard - ${patternFrets.name}`;
  }

  updateInfo() {
    const scaleNotes = this.getScaleNotes();
    const scaleName =
      this.selectedScale.charAt(0).toUpperCase() + this.selectedScale.slice(1);
    document.getElementById(
      "infoTitle"
    ).textContent = `${this.selectedKey} ${scaleName} Scale`;
    document.getElementById("infoText").textContent =
      this.scaleInfo[this.selectedScale];
    document.getElementById("scaleNotes").textContent = scaleNotes.join(" - ");
    document.getElementById("legendRoot").textContent = this.selectedKey;
  }

  toggleInfo() {
    this.showInfo = !this.showInfo;
    const infoPanel = document.getElementById("infoPanel");
    const infoIcon = document.getElementById("infoIcon");
    if (this.showInfo) {
      infoPanel.classList.remove("hidden");
      infoIcon.textContent = "⌃";
    } else {
      infoPanel.classList.add("hidden");
      infoIcon.textContent = "⌄";
    }
  }

  generateChordChart() {
    const chordGrid = document.getElementById("chordGrid");
    chordGrid.innerHTML = "";
    Object.values(this.filteredChords).forEach((chord) => {
      const chordCard = this.createChordCard(chord);
      chordGrid.appendChild(chordCard);
    });
  }

  createChordCard(chord) {
    const card = document.createElement("div");
    card.className = "chord-card";

    const chordName = document.createElement("div");
    chordName.className = "chord-name";
    chordName.textContent = chord.name;

    const variant = document.createElement("div");
    variant.className = "chord-variant";
    variant.textContent = chord.variant;

    const diagram = this.createChordDiagram(chord);

    const fingering = document.createElement("div");
    fingering.className = "chord-fingering";
    fingering.textContent = `Fingering: ${chord.fingering}`;

    const playButton = document.createElement("button");
    playButton.className = "play-chord-btn";
    playButton.textContent = "♪ Play";
    playButton.disabled = !this.audioSynth.isInitialized;
    playButton.addEventListener("click", () => this.playChord(chord));

    card.appendChild(chordName);
    card.appendChild(variant);
    card.appendChild(diagram);
    card.appendChild(fingering);
    card.appendChild(playButton);
    return card;
  }

  createChordDiagram(chord) {
    const diagram = document.createElement("div");
    diagram.className = "chord-diagram";
    const frets = document.createElement("div");
    frets.className = "chord-frets";

    const fingeringArray = chord.fingering.split("");
    const stringCount = this.tuning.length;
    
    // Adjust diagram for string count
    if (fingeringArray.length !== stringCount) {
      console.warn(`Chord ${chord.name} fingering doesn't match instrument string count`);
    }

    const fretNumbers = fingeringArray
      .filter((fret) => fret !== "x" && fret !== "0")
      .map((fret) => parseInt(fret))
      .filter((num) => !isNaN(num));

    const minFret = Math.min(...fretNumbers);
    const maxFret = Math.max(...fretNumbers);
    const isOpenChord = fretNumbers.length === 0 || minFret <= 4;

    let startFret = isOpenChord ? 0 : Math.max(1, minFret - 1);
    let endFret = isOpenChord ? 4 : Math.min(startFret + 4, maxFret + 1);

    // Create fret lines (5 frets shown)
    for (let i = 0; i <= 4; i++) {
      const fretLine = document.createElement("div");
      fretLine.className = "chord-fret-line";
      fretLine.style.top = `${(i * 100) / 4}%`;
      frets.appendChild(fretLine);
    }

    // Create string lines 
    for (let i = 0; i < stringCount; i++) {
      const stringLine = document.createElement("div");
      stringLine.className = "chord-string-line";
      stringLine.style.left = `${(i * 100) / (stringCount - 1)}%`;
      frets.appendChild(stringLine);
    }

    // Add finger positions
    fingeringArray.forEach((fret, stringIndex) => {
      if (stringIndex >= stringCount) return;
      
      const stringPos = (stringIndex * 100) / (stringCount - 1);

      if (fret === "0") {
        const openMarker = document.createElement("div");
        openMarker.className = "chord-open";
        openMarker.textContent = "○";
        openMarker.style.left = `${stringPos}%`;
        frets.appendChild(openMarker);
      } else if (fret === "x") {
        const muteMarker = document.createElement("div");
        muteMarker.className = "chord-mute";
        muteMarker.textContent = "✕";
        muteMarker.style.left = `${stringPos}%`;
        frets.appendChild(muteMarker);
      } else if (fret !== "x" && fret !== "0") {
        const fretNum = parseInt(fret);
        if (!isNaN(fretNum)) {
          const finger = document.createElement("div");
          finger.className = "chord-finger";
          if (chord.fingers[stringIndex]) {
            finger.textContent = chord.fingers[stringIndex];
          }
          finger.style.left = `${stringPos}%`;

          let relativePos;
          if (isOpenChord) {
            relativePos = (fretNum - 0.5) * 25; 
          } else {
            relativePos = ((fretNum - startFret - 0.5) * 100) / 4;
          }
          finger.style.top = `${Math.max(0, Math.min(100, relativePos))}%`;

          const note = this.getNoteAtFret(stringIndex, fretNum);
          if (note === chord.name.charAt(0)) {
            finger.classList.add("root");
          }
          frets.appendChild(finger);
        }
      }
    });

    diagram.appendChild(frets);
    return diagram;
  }

  filterChords(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    if (term === "") {
      this.filteredChords = { ...this.chords };
    } else {
      this.filteredChords = {};
      Object.entries(this.chords).forEach(([key, chord]) => {
        if (
          chord.name.toLowerCase().includes(term) ||
          chord.description.toLowerCase().includes(term) ||
          chord.variant.toLowerCase().includes(term)
        ) {
          this.filteredChords[key] = chord;
        }
      });
    }
    this.generateChordChart();
  }

  playScale() {
    if (!this.audioSynth.isInitialized) {
      alert(
        "Please initialize audio first by clicking the 'Initialize Audio' button."
      );
      return;
    }

    this.isPlaying = true;
    document.getElementById("playIcon").textContent = "⏸️";
    document.getElementById("playText").textContent = "Stop";

    let sequence = [];

    if (this.isShowingFullNeck) {
      sequence = this.getFullNeckPattern();
    } else {
      const patternFrets = this.getPatternFrets();
      patternFrets.frets.forEach((stringFrets, stringIndex) => {
        for (let fret = stringFrets[0]; fret <= stringFrets[1]; fret++) {
          const note = this.getNoteAtFret(stringIndex, fret);
          if (this.isInScale(note)) {
            sequence.push({ note, string: stringIndex, fret });
          }
        }
      });
    }

    let noteIndex = 0;
    const playNext = () => {
      if (noteIndex >= sequence.length || !this.isPlaying) {
        this.stopPlaying();
        return;
      }
      document.querySelectorAll(".note-playing").forEach((el) => {
        el.classList.remove("note-playing");
      });
      const { note, string, fret } = sequence[noteIndex];
      this.currentPlayingFret = { string, fret };
      const fretElement = document.querySelector(
        `[data-string="${string}"][data-fret="${fret}"]`
      );
      if (fretElement) {
        fretElement.classList.add("note-playing");
      }
      const frequency = this.getFreqForFret(string, fret);
      this.audioSynth.playNote(frequency, this.noteDuration);
      noteIndex++;
      setTimeout(playNext, 60000 / this.tempo);
    };
    playNext();
  }

  playChord(chord) {
    if (!this.audioSynth.isInitialized) {
      alert(
        "Please initialize audio first by clicking the 'Initialize Audio' button."
      );
      return;
    }

    const fingeringArray = chord.fingering.split("");
    const frequencies = [];
    fingeringArray.forEach((fret, stringIndex) => {
      if (fret !== "x" && fret !== undefined && stringIndex < this.tuning.length) {
        const fretNum = fret === "0" ? 0 : parseInt(fret);
        if (!isNaN(fretNum)) {
          const frequency = this.getFreqForFret(stringIndex, fretNum);
          frequencies.push(frequency);
        }
      }
    });

    if (frequencies.length > 0) {
      this.audioSynth.playChord(frequencies, this.noteDuration * 2);
    }
  }

  stopPlaying() {
    this.isPlaying = false;
    this.isPlayingFullNeck = false;
    this.currentNote = -1;
    this.currentPlayingFret = { string: -1, fret: -1 };
    document.querySelectorAll(".note-playing").forEach((el) => {
      el.classList.remove("note-playing");
    });
    document.getElementById("playIcon").textContent = "▶️";
    document.getElementById("playText").textContent = this.isShowingFullNeck
      ? "Play Full Neck"
      : "Play Pattern";
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new MultiInstrumentApp();
});