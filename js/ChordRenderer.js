// Handles chord chart generation and chord diagram rendering
class ChordRenderer {
  constructor(instrumentData, audioSynth) {
    this.instrumentData = instrumentData;
    this.audioSynth = audioSynth;
    this.filteredChords = {};
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

  generateChordChart(instrumentName) {
    const instrument = this.instrumentData.getInstrument(instrumentName);
    const chordGrid = document.getElementById("chordGrid");
    chordGrid.innerHTML = "";
    
    Object.values(this.filteredChords).forEach((chord) => {
      const chordCard = this.createChordCard(chord, instrument);
      chordGrid.appendChild(chordCard);
    });
  }

  createChordCard(chord, instrument) {
    const card = document.createElement("div");
    card.className = "chord-card";

    const chordName = document.createElement("div");
    chordName.className = "chord-name";
    chordName.textContent = chord.name;

    const variant = document.createElement("div");
    variant.className = "chord-variant";
    variant.textContent = chord.variant;

    const diagram = this.createChordDiagram(chord, instrument);

    const fingering = document.createElement("div");
    fingering.className = "chord-fingering";
    fingering.textContent = `Fingering: ${chord.fingering}`;

    const playButton = document.createElement("button");
    playButton.className = "play-chord-btn";
    playButton.textContent = "♪ Play";
    playButton.disabled = !this.audioSynth.isInitialized;
    playButton.addEventListener("click", () => this.playChord(chord, instrument));

    card.appendChild(chordName);
    card.appendChild(variant);
    card.appendChild(diagram);
    card.appendChild(fingering);
    card.appendChild(playButton);
    return card;
  }

  createChordDiagram(chord, instrument) {
    const diagram = document.createElement("div");
    diagram.className = "chord-diagram";
    const frets = document.createElement("div");
    frets.className = "chord-frets";

    const fingeringArray = chord.fingering.split("");
    const stringCount = instrument.tuning.length;

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

          const note = this.getNoteAtFret(stringIndex, fretNum, instrument.tuning);
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

  filterChords(searchTerm, instrumentName) {
    const instrument = this.instrumentData.getInstrument(instrumentName);
    const term = searchTerm.toLowerCase().trim();
    
    if (term === "") {
      this.filteredChords = { ...instrument.chords };
    } else {
      this.filteredChords = {};
      Object.entries(instrument.chords).forEach(([key, chord]) => {
        if (
          chord.name.toLowerCase().includes(term) ||
          chord.description.toLowerCase().includes(term) ||
          chord.variant.toLowerCase().includes(term)
        ) {
          this.filteredChords[key] = chord;
        }
      });
    }
  }

  playChord(chord, instrument, noteDuration = 1.0) {
    if (!this.audioSynth.isInitialized) {
      alert("Please initialize audio first by clicking the 'Initialize Audio' button.");
      return;
    }

    const fingeringArray = chord.fingering.split("");
    const frequencies = [];
    
    fingeringArray.forEach((fret, stringIndex) => {
      if (fret !== "x" && fret !== undefined && stringIndex < instrument.tuning.length) {
        const fretNum = fret === "0" ? 0 : parseInt(fret);
        if (!isNaN(fretNum)) {
          const frequency = this.getFreqForFret(stringIndex, fretNum, instrument.openStringFreqs);
          frequencies.push(frequency);
        }
      }
    });

    if (frequencies.length > 0) {
      this.audioSynth.playChord(frequencies, noteDuration * 2);
    }
  }

  updatePlayButtonsState() {
    document.querySelectorAll(".play-chord-btn").forEach((btn) => {
      btn.disabled = !this.audioSynth.isInitialized;
    });
  }

  initializeFilteredChords(instrumentName) {
    const instrument = this.instrumentData.getInstrument(instrumentName);
    this.filteredChords = { ...instrument.chords };
  }
}