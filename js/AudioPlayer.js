// Handles audio playback for scales and patterns
class AudioPlayer {
  constructor(instrumentData, audioSynth, fretboardRenderer) {
    this.instrumentData = instrumentData;
    this.audioSynth = audioSynth;
    this.fretboardRenderer = fretboardRenderer;
    this.isPlaying = false;
    this.isPlayingFullNeck = false;
    this.currentNote = -1;
    this.currentPlayingFret = { string: -1, fret: -1 };
  }

  playScale(instrumentName, selectedKey, selectedScale, selectedPattern, isShowingFullNeck, tempo, noteDuration) {
    if (!this.audioSynth.isInitialized) {
      alert("Please initialize audio first by clicking the 'Initialize Audio' button.");
      return;
    }

    this.isPlaying = true;
    document.getElementById("playIcon").textContent = "⏸️";
    document.getElementById("playText").textContent = "Stop";

    let sequence = [];

    if (isShowingFullNeck) {
      sequence = this.fretboardRenderer.getFullNeckPattern(instrumentName, selectedKey, selectedScale);
    } else {
      const patternFrets = this.fretboardRenderer.getPatternFrets(instrumentName, selectedScale, selectedPattern);
      const instrument = this.instrumentData.getInstrument(instrumentName);
      
      patternFrets.frets.forEach((stringFrets, stringIndex) => {
        for (let fret = stringFrets[0]; fret <= stringFrets[1]; fret++) {
          const note = this.fretboardRenderer.getNoteAtFret(stringIndex, fret, instrument.tuning);
          if (this.fretboardRenderer.isInScale(note, selectedKey, selectedScale)) {
            sequence.push({ note, string: stringIndex, fret });
          }
        }
      });
    }

    let noteIndex = 0;
    const playNext = () => {
      if (noteIndex >= sequence.length || !this.isPlaying) {
        this.stopPlaying(isShowingFullNeck);
        return;
      }
      
      document.querySelectorAll(".note-playing").forEach((el) => {
        el.classList.remove("note-playing");
      });
      
      const { note, string, fret } = sequence[noteIndex];
      this.currentPlayingFret = { string, fret };
      
      const fretElement = document.querySelector(`[data-string="${string}"][data-fret="${fret}"]`);
      if (fretElement) {
        fretElement.classList.add("note-playing");
      }
      
      const instrument = this.instrumentData.getInstrument(instrumentName);
      const frequency = this.fretboardRenderer.getFreqForFret(string, fret, instrument.openStringFreqs);
      this.audioSynth.playNote(frequency, noteDuration);
      
      noteIndex++;
      setTimeout(playNext, 60000 / tempo);
    };
    
    playNext();
  }

  stopPlaying(isShowingFullNeck = false) {
    this.isPlaying = false;
    this.isPlayingFullNeck = false;
    this.currentNote = -1;
    this.currentPlayingFret = { string: -1, fret: -1 };
    
    document.querySelectorAll(".note-playing").forEach((el) => {
      el.classList.remove("note-playing");
    });
    
    document.getElementById("playIcon").textContent = "▶️";
    document.getElementById("playText").textContent = isShowingFullNeck ? "Play Full Neck" : "Play Pattern";
  }

  updatePlayButtonsState() {
    document.getElementById("playButton").disabled = !this.audioSynth.isInitialized;
    document.getElementById("playFullNeckBtn").disabled = !this.audioSynth.isInitialized;
  }

  getIsPlaying() {
    return this.isPlaying;
  }
}