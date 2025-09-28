// Updated FretboardRenderer.js for the new architecture
class FretboardRenderer {
  constructor(instrumentData, audioSynth) {
    this.instrumentData = instrumentData;
    this.audioSynth = audioSynth;
  }

  getNoteAtFret(string, fret, tuning) {
    const openNote = tuning[string];
    const openNoteIndex = this.instrumentData.noteNames.indexOf(openNote);
    const noteIndex = (openNoteIndex + fret) % 12;
    return this.instrumentData.noteNames[noteIndex];
  }

  getFreqForFret(string, fret, openStringFreqs) {
    const frequency = openStringFreqs[string] * Math.pow(2, fret / 12);
    return frequency;
  }

  getScaleNotes(selectedKey, selectedScale) {
    const rootIndex = this.instrumentData.noteNames.indexOf(selectedKey);
    const intervals = this.instrumentData.getScaleIntervals(selectedScale);
    return intervals.map(
      (interval) => this.instrumentData.noteNames[(rootIndex + interval) % 12]
    );
  }

  isInScale(note, selectedKey, selectedScale) {
    const scaleNotes = this.getScaleNotes(selectedKey, selectedScale);
    return scaleNotes.includes(note);
  }

  getPatternFrets(instrumentName, selectedScale, selectedPattern) {
    const instrument = this.instrumentData.getInstrument(instrumentName);
    const patterns =
      instrument.scalePatterns[selectedScale] || instrument.scalePatterns.major;
    return patterns[selectedPattern] || patterns[0];
  }

  getFullNeckPattern(instrumentName, selectedKey, selectedScale) {
    const pattern = [];
    const instrument = this.instrumentData.getInstrument(instrumentName);
    const stringCount = instrument.tuning.length;

    // Create pattern based on instrument string count
    const positions =
      instrumentName === "guitar"
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
            const note = this.getNoteAtFret(string, fret, instrument.tuning);
            if (this.isInScale(note, selectedKey, selectedScale)) {
              const frequency = this.getFreqForFret(
                string,
                fret,
                instrument.openStringFreqs
              );
              positionNotes.push({
                note,
                string,
                fret,
                frequency,
                isRoot: note === selectedKey,
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

  // Calculate note position based on string and fret
  calculateNotePosition(stringIndex, fretIndex, isMobile = false) {
    const stringCenters = [30, 90, 150, 210, 270, 330]; // Y positions for each string
    const baseOffset = isMobile ? (window.innerWidth <= 480 ? 50 : 60) : 80; // Adjust for mobile vs desktop

    // X positions for each fret (middle of fret spaces)
    const fretPositions = [
      40, // Fret 0 (nut position)
      `calc(${baseOffset}px + 4.167%)`, // Fret 1
      `calc(${baseOffset}px + 12.5%)`, // Fret 2
      `calc(${baseOffset}px + 20.833%)`, // Fret 3
      `calc(${baseOffset}px + 29.167%)`, // Fret 4
      `calc(${baseOffset}px + 37.5%)`, // Fret 5
      `calc(${baseOffset}px + 45.833%)`, // Fret 6
      `calc(${baseOffset}px + 54.167%)`, // Fret 7
      `calc(${baseOffset}px + 62.5%)`, // Fret 8
      `calc(${baseOffset}px + 70.833%)`, // Fret 9
      `calc(${baseOffset}px + 79.167%)`, // Fret 10
      `calc(${baseOffset}px + 87.5%)`, // Fret 11
      `calc(${baseOffset}px + 95.833%)`, // Fret 12
    ];

    return {
      x:
        fretIndex === 0
          ? isMobile
            ? window.innerWidth <= 480
              ? "25px"
              : "30px"
            : "40px"
          : fretPositions[fretIndex],
      y: stringCenters[stringIndex] + "px",
    };
  }

  // Create the fretboard structure
  createFretboardStructure(instrumentName) {
    const instrument = this.instrumentData.getInstrument(instrumentName);
    const stringsContainer = document.getElementById("strings");

    // Clear existing content
    stringsContainer.innerHTML = "";

    // Create main fretboard container
    const fretboardContainer = document.createElement("div");
    fretboardContainer.className = "fretboard-container";

    // Create grid structure
    const fretboardGrid = document.createElement("div");
    fretboardGrid.className = "fretboard-grid";

    // Create string names section
    const stringNames = document.createElement("div");
    stringNames.className = "string-names";

    // Add string names (reversed to match visual order)
    instrument.tuning
      .slice()
      .reverse()
      .forEach((noteName) => {
        const stringName = document.createElement("div");
        stringName.className = "string-name";
        stringName.textContent = noteName;
        stringNames.appendChild(stringName);
      });

    fretboardGrid.appendChild(stringNames);
    fretboardContainer.appendChild(fretboardGrid);

    // Add fret wires
    for (let i = 0; i < 12; i++) {
      const fretWire = document.createElement("div");
      fretWire.className = "fret-wire";
      fretboardContainer.appendChild(fretWire);
    }

    // Add string lines
    for (let i = 0; i < instrument.tuning.length; i++) {
      const stringLine = document.createElement("div");
      stringLine.className = "string-line";
      fretboardContainer.appendChild(stringLine);
    }

    // Add fret markers
    [3, 5, 7, 9, 12].forEach((fretNum) => {
      const marker = document.createElement("div");
      marker.className = `fret-marker fret-${fretNum}`;
      fretboardContainer.appendChild(marker);
    });

    // Create notes layer
    const notesLayer = document.createElement("div");
    notesLayer.className = "notes-layer";
    notesLayer.id = "notesLayer";
    fretboardContainer.appendChild(notesLayer);

    stringsContainer.appendChild(fretboardContainer);

    // The fret numbers are already in the HTML, no need to create them again!
  }

  // Generate notes for pattern view
  generateFretboard(
    instrumentName,
    selectedKey,
    selectedScale,
    selectedPattern,
    noteDuration
  ) {
    this.createFretboardStructure(instrumentName);

    const instrument = this.instrumentData.getInstrument(instrumentName);
    const patternFrets = this.getPatternFrets(
      instrumentName,
      selectedScale,
      selectedPattern
    );
    const notesLayer = document.getElementById("notesLayer");
    const isMobile = window.innerWidth <= 768;

    // Clear existing notes
    notesLayer.innerHTML = "";

    // Generate notes for each string
    instrument.tuning.forEach((openNote, stringIndex) => {
      const visualStringIndex = instrument.tuning.length - 1 - stringIndex; // Reverse for visual order

      for (let fret = 0; fret <= 12; fret++) {
        const note = this.getNoteAtFret(stringIndex, fret, instrument.tuning);
        const inScale = this.isInScale(note, selectedKey, selectedScale);
        const inPattern =
          fret >= patternFrets.frets[stringIndex][0] &&
          fret <= patternFrets.frets[stringIndex][1];
        const isRoot = note === selectedKey;
        const isOpen = fret === 0;

        // Only create note element if it should be visible
        if ((inPattern && inScale) || (isOpen && inScale) || inScale) {
          const noteElement = document.createElement("div");
          noteElement.className = "note-element";
          noteElement.dataset.string = stringIndex;
          noteElement.dataset.fret = fret;
          noteElement.textContent = note;

          // Apply appropriate styling class
          if (inPattern && inScale) {
            if (isRoot) {
              noteElement.classList.add("note-root");
            } else if (isOpen) {
              noteElement.classList.add("note-open");
            } else {
              noteElement.classList.add("note-pattern");
            }
          } else if (isOpen && inScale) {
            noteElement.classList.add("note-open");
          } else if (inScale) {
            noteElement.classList.add("note-scale");
          }

          // Add fret class for special positioning
          if (fret === 0) {
            noteElement.classList.add("fret-0");
          }

          // Position the note
          const position = this.calculateNotePosition(
            visualStringIndex,
            fret,
            isMobile
          );
          noteElement.style.left = position.x;
          noteElement.style.top = position.y;

          // Add click handler
          noteElement.addEventListener("click", () => {
            if (this.audioSynth.isInitialized) {
              const frequency = this.getFreqForFret(
                stringIndex,
                fret,
                instrument.openStringFreqs
              );
              this.audioSynth.playNote(frequency, noteDuration);

              // Visual feedback
              noteElement.style.transform = "translate(-50%, -50%) scale(1.2)";
              setTimeout(() => {
                noteElement.style.transform = "translate(-50%, -50%)";
              }, 200);
            }
          });

          notesLayer.appendChild(noteElement);
        }
      }
    });

    document.getElementById(
      "fretboardTitle"
    ).textContent = `Fretboard - ${patternFrets.name}`;
  }

  // Generate notes for full neck view
  generateFullNeckFretboard(
    instrumentName,
    selectedKey,
    selectedScale,
    noteDuration
  ) {
    this.createFretboardStructure(instrumentName);

    const instrument = this.instrumentData.getInstrument(instrumentName);
    const fullNeckPattern = this.getFullNeckPattern(
      instrumentName,
      selectedKey,
      selectedScale
    );
    const notesLayer = document.getElementById("notesLayer");
    const isMobile = window.innerWidth <= 768;

    // Clear existing notes
    notesLayer.innerHTML = "";

    // Create set of pattern positions for quick lookup
    const patternPositions = new Set();
    fullNeckPattern.forEach((note) => {
      patternPositions.add(`${note.string}-${note.fret}`);
    });

    // Generate notes for each string
    instrument.tuning.forEach((openNote, stringIndex) => {
      const visualStringIndex = instrument.tuning.length - 1 - stringIndex; // Reverse for visual order

      for (let fret = 0; fret <= 12; fret++) {
        const note = this.getNoteAtFret(stringIndex, fret, instrument.tuning);
        const inScale = this.isInScale(note, selectedKey, selectedScale);
        const inFullNeckPattern = patternPositions.has(
          `${stringIndex}-${fret}`
        );
        const isRoot = note === selectedKey;
        const isOpen = fret === 0;

        // Create note element if it should be visible
        if (inFullNeckPattern || (isOpen && inScale) || inScale) {
          const noteElement = document.createElement("div");
          noteElement.className = "note-element";
          noteElement.dataset.string = stringIndex;
          noteElement.dataset.fret = fret;
          noteElement.textContent = note;

          // Apply appropriate styling class
          if (inFullNeckPattern) {
            if (isRoot) {
              noteElement.classList.add("note-root");
            } else if (isOpen) {
              noteElement.classList.add("note-open");
            } else {
              noteElement.classList.add("note-pattern");
            }
          } else if (isOpen && inScale) {
            noteElement.classList.add("note-scale");
          } else if (inScale) {
            noteElement.classList.add("note-scale");
          }

          // Add fret class for special positioning
          if (fret === 0) {
            noteElement.classList.add("fret-0");
          }

          // Position the note
          const position = this.calculateNotePosition(
            visualStringIndex,
            fret,
            isMobile
          );
          noteElement.style.left = position.x;
          noteElement.style.top = position.y;

          // Add click handler
          noteElement.addEventListener("click", () => {
            if (this.audioSynth.isInitialized) {
              const frequency = this.getFreqForFret(
                stringIndex,
                fret,
                instrument.openStringFreqs
              );
              this.audioSynth.playNote(frequency, noteDuration);

              // Visual feedback
              noteElement.style.transform = "translate(-50%, -50%) scale(1.2)";
              setTimeout(() => {
                noteElement.style.transform = "translate(-50%, -50%)";
              }, 200);
            }
          });

          notesLayer.appendChild(noteElement);
        }
      }
    });

    document.getElementById("fretboardTitle").textContent =
      "Full Neck Scale Pattern";
  }
}
