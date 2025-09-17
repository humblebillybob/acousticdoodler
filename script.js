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

// Guitar Scales Interactive Tool - JavaScript
class GuitarScalesApp {
  constructor() {
    this.selectedScale = "major";
    this.selectedKey = "C";
    this.selectedPattern = 0;
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

    // Guitar tuning (standard)
    this.tuning = ["E", "A", "D", "G", "B", "E"];

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

    // Scale patterns
    this.scalePatterns = {
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

    // Guitar chords with proper fingerings (cleaned up)
    this.chords = {
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

      // 7th Chords
      C7: {
        name: "C7",
        fingering: "x32310",
        fingers: [null, 3, 2, 3, 1, null],
        description: "C Dominant 7th",
        variant: "Open Position",
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
    };

    this.filteredChords = { ...this.chords };
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updatePatternOptions();
    this.generateFretboard();
    this.updateInfo();
    this.generateChordChart();
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
    const patterns =
      this.scalePatterns[this.selectedScale] || this.scalePatterns.major;
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
    const openStringFreqs = [82.41, 110.0, 146.83, 196.0, 246.94, 329.63];
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
    const patterns =
      this.scalePatterns[this.selectedScale] || this.scalePatterns.major;
    return patterns[this.selectedPattern] || patterns[0];
  }

  getFullNeckPattern() {
    // Create a smooth ascending run up the neck that connects scale positions
    const pattern = [];

    // Define position ranges (fret ranges for each position)
    const positions = [
      { start: 0, end: 3, strings: [0, 1, 2] }, // Open position - use lower strings
      { start: 2, end: 5, strings: [1, 2, 3] }, // 2nd position
      { start: 4, end: 7, strings: [2, 3, 4] }, // 4th position
      { start: 7, end: 10, strings: [3, 4, 5] }, // 7th position
      { start: 9, end: 12, strings: [4, 5] }, // 9th position - use higher strings
    ];

    positions.forEach((pos, posIndex) => {
      // For each position, create an ascending run using specific strings
      const positionNotes = [];

      pos.strings.forEach((string) => {
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
      });

      // Sort this position's notes by frequency to create smooth ascending line
      positionNotes.sort((a, b) => a.frequency - b.frequency);

      // Take every other note or specific intervals to create a musical run
      // This prevents too many notes and creates a more musical pattern
      const selectedNotes = positionNotes.filter((note, index) => {
        // Take fewer notes from each position to create a smooth run
        return index % 2 === 0 || note.isRoot;
      });

      pattern.push(...selectedNotes);
    });

    return pattern;
  }

  generateFullNeckFretboard() {
    // Generate fretboard showing the full neck pattern
    const stringsContainer = document.getElementById("strings");
    stringsContainer.innerHTML = "";
    const fullNeckPattern = this.getFullNeckPattern();

    // Create a set of fret positions that are part of the pattern
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

          // Add click listener for playing individual notes
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

          // Add click listener for playing individual notes
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

    // Parse fingering to determine fret range
    const fingeringArray = chord.fingering.split("");
    const fretNumbers = fingeringArray
      .filter((fret) => fret !== "x" && fret !== "0")
      .map((fret) => parseInt(fret))
      .filter((num) => !isNaN(num));

    const minFret = Math.min(...fretNumbers);
    const maxFret = Math.max(...fretNumbers);
    const isOpenChord = fretNumbers.length === 0 || minFret <= 4;

    // Determine display range
    let startFret = isOpenChord ? 0 : Math.max(1, minFret - 1);
    let endFret = isOpenChord ? 4 : Math.min(startFret + 4, maxFret + 1);

    // Create fret lines (5 frets shown)
    for (let i = 0; i <= 4; i++) {
      const fretLine = document.createElement("div");
      fretLine.className = "chord-fret-line";
      fretLine.style.top = `${(i * 100) / 4}%`;
      frets.appendChild(fretLine);
    }

    // Create string lines (6 strings)
    for (let i = 0; i < 6; i++) {
      const stringLine = document.createElement("div");
      stringLine.className = "chord-string-line";
      stringLine.style.left = `${(i * 100) / 5}%`;
      frets.appendChild(stringLine);
    }

    // Add finger positions
    fingeringArray.forEach((fret, stringIndex) => {
      const stringPos = (stringIndex * 100) / 5;

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

          // Calculate position relative to the display range
          let relativePos;
          if (isOpenChord) {
            relativePos = (fretNum - 0.5) * 25; // Each fret is 25% in open position
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
      // Play the full neck pattern
      sequence = this.getFullNeckPattern();
    } else {
      // Play the current pattern
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
      if (fret !== "x" && fret !== undefined) {
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

document.addEventListener("DOMContentLoaded", () => {
  new GuitarScalesApp();
});
