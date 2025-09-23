// Handles fretboard generation and rendering
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
    const patterns = instrument.scalePatterns[selectedScale] || instrument.scalePatterns.major;
    return patterns[selectedPattern] || patterns[0];
  }

  getFullNeckPattern(instrumentName, selectedKey, selectedScale) {
    const pattern = [];
    const instrument = this.instrumentData.getInstrument(instrumentName);
    const stringCount = instrument.tuning.length;

    // Create pattern based on instrument string count
    const positions = instrumentName === "guitar" 
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
              const frequency = this.getFreqForFret(string, fret, instrument.openStringFreqs);
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

  generateFretboard(instrumentName, selectedKey, selectedScale, selectedPattern, noteDuration) {
    const instrument = this.instrumentData.getInstrument(instrumentName);
    const stringsContainer = document.getElementById("strings");
    stringsContainer.innerHTML = "";
    const patternFrets = this.getPatternFrets(instrumentName, selectedScale, selectedPattern);

    instrument.tuning
      .slice()
      .reverse()
      .forEach((openNote, reverseIndex) => {
        const stringIndex = instrument.tuning.length - 1 - reverseIndex;
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
              const frequency = this.getFreqForFret(stringIndex, fret, instrument.openStringFreqs);
              this.audioSynth.playNote(frequency, noteDuration);

              fretSpace.style.transform = "scale(1.2)";
              setTimeout(() => {
                fretSpace.style.transform = "";
              }, 200);
            }
          });

          if ([3, 5, 7, 9, 12].includes(fret)) {
            fretSpace.classList.add("has-marker");
          }

          const note = this.getNoteAtFret(stringIndex, fret, instrument.tuning);
          const inScale = this.isInScale(note, selectedKey, selectedScale);
          const inPattern =
            fret >= patternFrets.frets[stringIndex][0] &&
            fret <= patternFrets.frets[stringIndex][1];
          const isRoot = note === selectedKey;
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

    document.getElementById("fretboardTitle").textContent = `Fretboard - ${patternFrets.name}`;
  }

  generateFullNeckFretboard(instrumentName, selectedKey, selectedScale, noteDuration) {
    const instrument = this.instrumentData.getInstrument(instrumentName);
    const stringsContainer = document.getElementById("strings");
    stringsContainer.innerHTML = "";
    const fullNeckPattern = this.getFullNeckPattern(instrumentName, selectedKey, selectedScale);

    const patternPositions = new Set();
    fullNeckPattern.forEach((note) => {
      patternPositions.add(`${note.string}-${note.fret}`);
    });

    instrument.tuning
      .slice()
      .reverse()
      .forEach((openNote, reverseIndex) => {
        const stringIndex = instrument.tuning.length - 1 - reverseIndex;
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
              const frequency = this.getFreqForFret(stringIndex, fret, instrument.openStringFreqs);
              this.audioSynth.playNote(frequency, noteDuration);

              fretSpace.style.transform = "scale(1.2)";
              setTimeout(() => {
                fretSpace.style.transform = "";
              }, 200);
            }
          });

          if ([3, 5, 7, 9, 12].includes(fret)) {
            fretSpace.classList.add("has-marker");
          }

          const note = this.getNoteAtFret(stringIndex, fret, instrument.tuning);
          const inScale = this.isInScale(note, selectedKey, selectedScale);
          const inFullNeckPattern = patternPositions.has(`${stringIndex}-${fret}`);
          const isRoot = note === selectedKey;
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

    document.getElementById("fretboardTitle").textContent = "Full Neck Scale Pattern";
  }
}