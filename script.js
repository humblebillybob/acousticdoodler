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

    // Tuner properties
    this.tunerActive = false;
    this.microphone = null;
    this.analyser = null;
    this.tunerAnimationFrame = null;
    this.tunerAudioContext = null;

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
          D: {
            name: "D",
            fingering: "xx0232",
            fingers: [null, null, null, 1, 3, 2],
            description: "D Major",
            variant: "Open Position",
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
          G: {
            name: "G",
            fingering: "320003",
            fingers: [3, 2, null, null, null, 3],
            description: "G Major",
            variant: "Open Position",
          },
          A: {
            name: "A",
            fingering: "x02220",
            fingers: [null, null, 2, 2, 2, null],
            description: "A Major",
            variant: "Open Position",
          },
          // Minor Chords
          Am: {
            name: "Am",
            fingering: "x02210",
            fingers: [null, null, 2, 2, 1, null],
            description: "A Minor",
            variant: "Open Position",
          },
          Dm: {
            name: "Dm",
            fingering: "xx0231",
            fingers: [null, null, null, 2, 3, 1],
            description: "D Minor",
            variant: "Open Position",
          },
          Em: {
            name: "Em",
            fingering: "022000",
            fingers: [null, 2, 2, null, null, null],
            description: "E Minor",
            variant: "Open Position",
          },
        },
        tips: [
          {
            title: "Guitar Basics",
            content:
              "Start with open chords like G, C, D, Em, and Am. These form the foundation of thousands of songs.",
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
          C: {
            name: "C",
            fingering: "0003",
            fingers: [null, null, null, 3],
            description: "C Major",
            variant: "Open Position",
          },
          F: {
            name: "F",
            fingering: "2010",
            fingers: [2, null, 1, null],
            description: "F Major",
            variant: "Open Position",
          },
          G: {
            name: "G",
            fingering: "0232",
            fingers: [null, 2, 3, 2],
            description: "G Major",
            variant: "Open Position",
          },
          Am: {
            name: "Am",
            fingering: "2000",
            fingers: [2, null, null, null],
            description: "A Minor",
            variant: "Open Position",
          },
        },
        tips: [
          {
            title: "Ukulele Basics",
            content:
              "Start with C, G, Am, and F - these four chords can play hundreds of songs!",
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
          C: {
            name: "C",
            fingering: "0230",
            fingers: [null, 2, 3, null],
            description: "C Major",
            variant: "Open Position",
          },
          G: {
            name: "G",
            fingering: "0003",
            fingers: [null, null, null, 3],
            description: "G Major",
            variant: "Open Position",
          },
          Am: {
            name: "Am",
            fingering: "2210",
            fingers: [2, 2, 1, null],
            description: "A Minor",
            variant: "Open Position",
          },
        },
        tips: [
          {
            title: "Mandolin Basics",
            content:
              "Mandolin strings come in pairs tuned to the same pitch. Pick both strings together for full sound.",
          },
        ],
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
    this.switchInstrument("guitar");
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

    // Tuner controls
    document.getElementById("tunerButton").addEventListener("click", () => {
      this.openTuner();
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
    document.getElementById("instrumentTitle").textContent =
      this.currentInstrumentConfig.name;

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
    tipsGrid.innerHTML = "";

    // Add common tips
    const commonTips = [
      {
        title: "Getting Started",
        content: `Start with Pattern 1 and learn it thoroughly<br />
          • Practice slowly with a metronome<br />
          • Focus on clean fretting and picking<br />
          • Memorize the root note positions`,
      },
      {
        title: "Using This Tool",
        content: `Click "Initialize Audio" first to enable sound<br />
          • Click any note on the fretboard to hear it<br />
          • Try "Full Neck Scale" for complete practice<br />
          • Use the chord chart for rhythm practice`,
      },
    ];

    // Add all tips
    [...commonTips, ...instrumentTips].forEach((tip) => {
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
    const patterns =
      this.scalePatterns[this.selectedScale] || this.scalePatterns.major;
    return patterns[this.selectedPattern] || patterns[0];
  }

  getFullNeckPattern() {
    const pattern = [];
    const stringCount = this.tuning.length;

    // Create pattern based on instrument string count
    const positions =
      this.currentInstrument === "guitar"
        ? [
            { start: 0, end: 3, strings: [0, 1, 2] },
            { start: 2, end: 5, strings: [1, 2, 3] },
            { start: 4, end: 7, strings: [2, 3, 4] },
            { start: 7, end: 10, strings: [3, 4, 5] },
            { start: 9, end: 12, strings: [4, 5] },
          ]
        : [
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
      infoIcon.textContent = "▲";
    } else {
      infoPanel.classList.add("hidden");
      infoIcon.textContent = "▼";
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
      console.warn(
        `Chord ${chord.name} fingering doesn't match instrument string count`
      );
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
      if (
        fret !== "x" &&
        fret !== undefined &&
        stringIndex < this.tuning.length
      ) {
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

  // Tuner Methods
  openTuner() {
    const modal = document.getElementById("tunerModal");
    modal.classList.remove("hidden");
    this.generateStringTargets();

    // Add event listeners when modal opens
    document.getElementById("closeTunerBtn").onclick = () => this.closeTuner();
    document.getElementById("tunerOverlay").onclick = () => this.closeTuner();
    document.getElementById("startTunerBtn").onclick = () => this.startTuner();
    document.getElementById("stopTunerBtn").onclick = () => this.stopTuner();
  }

  closeTuner() {
    const modal = document.getElementById("tunerModal");
    modal.classList.add("hidden");
    this.stopTuner();

    // Remove event listeners when modal closes
    document.getElementById("closeTunerBtn").onclick = null;
    document.getElementById("tunerOverlay").onclick = null;
    document.getElementById("startTunerBtn").onclick = null;
    document.getElementById("stopTunerBtn").onclick = null;
  }

  generateStringTargets() {
    const targetsContainer = document.getElementById("stringTargets");
    targetsContainer.innerHTML = "";

    const tuning = this.tuning;
    const frequencies = this.currentInstrumentConfig.openStringFreqs;

    tuning.forEach((note, index) => {
      const target = document.createElement("div");
      target.className = "string-target";
      target.innerHTML = `
        <div class="target-string">String ${index + 1}</div>
        <div class="target-note">${note}</div>
        <div class="target-freq">${Math.round(frequencies[index])} Hz</div>
      `;
      targetsContainer.appendChild(target);
    });
  }

  async startTuner() {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
        },
      });

      // Create audio context for tuner (separate from synth)
      this.tunerAudioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      this.microphone = this.tunerAudioContext.createMediaStreamSource(stream);
      this.analyser = this.tunerAudioContext.createAnalyser();

      // Configure analyser for pitch detection
      this.analyser.fftSize = 8192;
      this.analyser.smoothingTimeConstant = 0.3;

      this.microphone.connect(this.analyser);

      this.tunerActive = true;

      // Update UI
      document.getElementById("startTunerBtn").classList.add("hidden");
      document.getElementById("stopTunerBtn").classList.remove("hidden");
      document.getElementById("tunerStatusText").textContent =
        "🎤 Listening... play a note";

      // Start analysis loop
      this.analyzeTuning();
    } catch (error) {
      console.error("Microphone access denied:", error);
      document.getElementById("tunerStatusText").textContent =
        "❌ Microphone access required";
    }
  }

  stopTuner() {
    this.tunerActive = false;

    if (this.tunerAnimationFrame) {
      cancelAnimationFrame(this.tunerAnimationFrame);
      this.tunerAnimationFrame = null;
    }

    // Properly stop microphone stream
    if (this.microphone && this.microphone.mediaStream) {
      this.microphone.mediaStream.getTracks().forEach((track) => track.stop());
    }

    if (this.tunerAudioContext && this.tunerAudioContext.state !== "closed") {
      this.tunerAudioContext.close();
      this.tunerAudioContext = null;
    }

    // Reset UI
    document.getElementById("startTunerBtn").classList.remove("hidden");
    document.getElementById("stopTunerBtn").classList.add("hidden");
    document.getElementById("tunerStatusText").textContent =
      "Click 'Start Tuner' to begin";
    document.getElementById("noteDisplay").textContent = "--";
    document.getElementById("frequencyDisplay").textContent = "-- Hz";

    // Reset needle and targets
    const needle = document.getElementById("tuningNeedle");
    if (needle) needle.style.left = "50%";

    document.querySelectorAll(".string-target").forEach((target) => {
      target.classList.remove("active", "in-tune");
    });
  }

  analyzeTuning() {
    if (!this.tunerActive || !this.analyser) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    this.analyser.getFloatFrequencyData(dataArray);

    // Find the fundamental frequency
    const frequency = this.findFundamentalFreq(dataArray);

    if (frequency > 50 && frequency < 2000) {
      const note = this.frequencyToNote(frequency);
      const { noteName, cents } = note;

      // Update displays
      document.getElementById("noteDisplay").textContent = noteName;
      document.getElementById("frequencyDisplay").textContent = `${Math.round(
        frequency
      )} Hz`;

      // Update tuning needle (cents range: -50 to +50)
      const needlePosition = Math.max(0, Math.min(100, 50 + cents * 0.8));
      document.getElementById("tuningNeedle").style.left = `${needlePosition}%`;

      // Update string targets
      this.updateStringTargets(noteName, frequency, cents);
    } else {
      document.getElementById("noteDisplay").textContent = "--";
      document.getElementById("frequencyDisplay").textContent = "-- Hz";
      document.getElementById("tuningNeedle").style.left = "50%";
      document.querySelectorAll(".string-target").forEach((target) => {
        target.classList.remove("active", "in-tune");
      });
    }

    this.tunerAnimationFrame = requestAnimationFrame(() =>
      this.analyzeTuning()
    );
  }

  findFundamentalFreq(frequencyData) {
    const sampleRate = this.tunerAudioContext.sampleRate;
    const nyquist = sampleRate / 2;
    const bufferLength = frequencyData.length;

    // Find the peak frequency
    let maxIndex = 0;
    let maxValue = -Infinity;

    // Focus on musical range (80Hz to 1000Hz)
    const minIndex = Math.floor((80 / nyquist) * bufferLength);
    const maxIndexLimit = Math.floor((1000 / nyquist) * bufferLength);

    for (let i = minIndex; i < maxIndexLimit; i++) {
      if (frequencyData[i] > maxValue) {
        maxValue = frequencyData[i];
        maxIndex = i;
      }
    }

    // Convert index to frequency
    const frequency = (maxIndex / bufferLength) * nyquist;

    // Only return if signal is strong enough
    return maxValue > -40 ? frequency : 0;
  }

  frequencyToNote(frequency) {
    const A4_FREQ = 440;
    const A4_INDEX = 57; // A4 is the 57th key on piano (starting from C0)

    // Calculate note index from frequency
    const noteIndex =
      Math.round(12 * Math.log2(frequency / A4_FREQ)) + A4_INDEX;

    // Calculate exact frequency for this note
    const exactFreq = A4_FREQ * Math.pow(2, (noteIndex - A4_INDEX) / 12);

    // Calculate cents deviation
    const cents = Math.round(1200 * Math.log2(frequency / exactFreq));

    // Get note name
    const noteNames = [
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
    const noteName = noteNames[noteIndex % 12];

    return { noteName, cents, exactFreq };
  }

  updateStringTargets(detectedNote, frequency, cents) {
    const tuning = this.tuning;
    const targetFreqs = this.currentInstrumentConfig.openStringFreqs;

    document.querySelectorAll(".string-target").forEach((target, index) => {
      target.classList.remove("active", "in-tune");

      const targetNote = tuning[index];
      const targetFreq = targetFreqs[index];

      // Check if this string matches the detected note
      if (detectedNote === targetNote) {
        target.classList.add("active");

        // Check if it's in tune (within ±10 cents)
        if (Math.abs(cents) <= 10) {
          target.classList.add("in-tune");
        }
      }
    });
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new MultiInstrumentApp();
});
