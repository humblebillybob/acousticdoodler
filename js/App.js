// Main application controller that coordinates all components
class MultiInstrumentApp {
  constructor() {
    // Application state
    this.selectedScale = "major";
    this.selectedKey = "C";
    this.selectedPattern = 0;
    this.currentInstrument = "guitar";
    this.isShowingFullNeck = false;
    this.tempo = 120;
    this.masterVolume = 0.5;
    this.noteDuration = 0.5;

    // Initialize components
    this.instrumentData = new InstrumentData();
    this.audioSynth = new SimpleAudioSynth();
    this.fretboardRenderer = new FretboardRenderer(
      this.instrumentData,
      this.audioSynth
    );
    this.chordRenderer = new ChordRenderer(
      this.instrumentData,
      this.audioSynth
    );
    this.tuner = new Tuner(this.instrumentData);
    this.audioPlayer = new AudioPlayer(
      this.instrumentData,
      this.audioSynth,
      this.fretboardRenderer
    );
    this.uiManager = new UIManager(this.instrumentData);

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.switchInstrument("guitar");
    this.uiManager.updateAudioStatus(this.audioSynth.isInitialized);

    // Add window resize handler for responsive fretboard
    window.addEventListener("resize", () => {
      // Regenerate fretboard on resize to adjust note positions
      this.generateCurrentFretboard();
    });
  }

  setupEventListeners() {
    // Initialize audio button
    document
      .getElementById("initAudioBtn")
      .addEventListener("click", async () => {
        const success = await this.audioSynth.initialize();
        this.uiManager.updateAudioStatus(this.audioSynth.isInitialized);
        this.updateAudioRelatedButtons();
      });

    // Volume and tempo controls
    this.uiManager.setupVolumeControls(
      (volume) => {
        this.masterVolume = volume;
        this.audioSynth.setVolume(this.masterVolume);
      },
      (duration) => {
        this.noteDuration = duration;
      }
    );

    this.uiManager.setupTempoSlider((tempo) => {
      this.tempo = tempo;
    });

    // Theme and navigation
    this.uiManager.setupThemeToggle();
    this.uiManager.setupTabNavigation();
    this.uiManager.setupInfoButton();

    // Instrument navigation
    this.uiManager.setupInstrumentNavigation((instrument) => {
      this.switchInstrument(instrument);
    });

    // Scale controls
    this.setupScaleControls();

    // Play buttons
    this.setupPlayButtons();

    // Chord search
    this.setupChordSearch();

    // Tuner button
    this.setupTunerButton();
  }

  setupScaleControls() {
    document.getElementById("scaleSelect").addEventListener("change", (e) => {
      this.selectedScale = e.target.value;
      this.updatePatternOptions();
      this.generateCurrentFretboard();
      this.uiManager.updateInfo(this.selectedKey, this.selectedScale);
    });

    document.getElementById("keySelect").addEventListener("change", (e) => {
      this.selectedKey = e.target.value;
      this.generateCurrentFretboard();
      this.uiManager.updateInfo(this.selectedKey, this.selectedScale);
    });
  }

  setupPlayButtons() {
    document.getElementById("playButton").addEventListener("click", () => {
      if (this.audioPlayer.getIsPlaying()) {
        this.audioPlayer.stopPlaying(this.isShowingFullNeck);
      } else {
        this.audioPlayer.playScale(
          this.currentInstrument,
          this.selectedKey,
          this.selectedScale,
          this.selectedPattern,
          this.isShowingFullNeck,
          this.tempo,
          this.noteDuration
        );
      }
    });

    document.getElementById("byPositionBtn").addEventListener("click", () => {
      if (!this.isShowingFullNeck) return; // Already in position mode
      this.toggleFullNeckView();
    });

    document.getElementById("playFullNeckBtn").addEventListener("click", () => {
      if (this.isShowingFullNeck) return; // Already in full neck mode
      this.toggleFullNeckView();
    });
  }

  setupChordSearch() {
    document
      .getElementById("chordSearchInput")
      .addEventListener("input", (e) => {
        this.chordRenderer.filterChords(e.target.value, this.currentInstrument);
        this.chordRenderer.generateChordChart(this.currentInstrument);
      });
  }

  setupTunerButton() {
    document.getElementById("tunerButton").addEventListener("click", () => {
      this.tuner.openTuner(this.currentInstrument);
    });
  }

  switchInstrument(instrument) {
    this.currentInstrument = instrument;

    // Update UI
    this.uiManager.updateInstrumentNavigation(instrument);
    this.uiManager.updateInstrumentTitle(instrument);

    // Add instrument class to fretboard container for CSS adjustments
    const stringsContainer = document.getElementById("strings");
    if (stringsContainer) {
      // Remove existing instrument classes
      stringsContainer.className = stringsContainer.className.replace(
        /\b(guitar|ukulele|mandolin)\b/g,
        ""
      );
      // Add current instrument class
      stringsContainer.classList.add(instrument);
    }

    // Reset to pattern view
    this.isShowingFullNeck = false;
    document.getElementById("byPositionBtn").classList.add("active");
    document.getElementById("playFullNeckBtn").classList.remove("active");

    // Update hidden elements for compatibility
    const fullNeckIcon = document.getElementById("fullNeckIcon");
    const fullNeckText = document.getElementById("fullNeckText");
    if (fullNeckIcon) fullNeckIcon.textContent = "🎸";
    if (fullNeckText) fullNeckText.textContent = "Full Neck Scale";

    // Update components
    this.updatePatternOptions();
    this.generateCurrentFretboard();
    this.uiManager.updateInfo(this.selectedKey, this.selectedScale);
    this.chordRenderer.initializeFilteredChords(instrument);
    this.chordRenderer.generateChordChart(instrument);
    this.uiManager.updateTips(instrument);
  }

  updatePatternOptions() {
    this.selectedPattern = this.uiManager.updatePatternOptions(
      this.currentInstrument,
      this.selectedScale,
      this.selectedPattern,
      (pattern) => {
        this.selectedPattern = pattern;
        this.generateCurrentFretboard();
        this.uiManager.updateInfo(this.selectedKey, this.selectedScale);
      }
    );

    // Reset to pattern view when changing scales
    if (this.isShowingFullNeck) {
      this.isShowingFullNeck = false;
      document.getElementById("byPositionBtn").classList.add("active");
      document.getElementById("playFullNeckBtn").classList.remove("active");

      const fullNeckIcon = document.getElementById("fullNeckIcon");
      const fullNeckText = document.getElementById("fullNeckText");
      if (fullNeckIcon) fullNeckIcon.textContent = "🎸";
      if (fullNeckText) fullNeckText.textContent = "Full Neck Scale";
    }
  }

  generateCurrentFretboard() {
    // Add instrument class to container for styling
    const stringsContainer = document.getElementById("strings");
    if (stringsContainer) {
      // Remove existing instrument classes
      stringsContainer.classList.remove("guitar", "ukulele", "mandolin");
      // Add current instrument class
      stringsContainer.classList.add(this.currentInstrument);
    }

    if (this.isShowingFullNeck) {
      this.fretboardRenderer.generateFullNeckFretboard(
        this.currentInstrument,
        this.selectedKey,
        this.selectedScale,
        this.noteDuration
      );
    } else {
      this.fretboardRenderer.generateFretboard(
        this.currentInstrument,
        this.selectedKey,
        this.selectedScale,
        this.selectedPattern,
        this.noteDuration
      );
    }

    // Apply instrument class to fretboard container for responsive styling
    const fretboardContainer = document.querySelector(".fretboard-container");
    if (fretboardContainer) {
      fretboardContainer.classList.remove("guitar", "ukulele", "mandolin");
      fretboardContainer.classList.add(this.currentInstrument);
    }

    // Apply instrument class to fretboard grid
    const fretboardGrid = document.querySelector(".fretboard-grid");
    if (fretboardGrid) {
      fretboardGrid.classList.remove("guitar", "ukulele", "mandolin");
      fretboardGrid.classList.add(this.currentInstrument);
    }
  }

  toggleFullNeckView() {
    this.isShowingFullNeck = !this.isShowingFullNeck;

    // Update button states
    const byPositionBtn = document.getElementById("byPositionBtn");
    const fullNeckBtn = document.getElementById("playFullNeckBtn");

    if (this.isShowingFullNeck) {
      // Full neck mode active
      byPositionBtn.classList.remove("active");
      fullNeckBtn.classList.add("active");

      this.fretboardRenderer.generateFullNeckFretboard(
        this.currentInstrument,
        this.selectedKey,
        this.selectedScale,
        this.noteDuration
      );

      // Update hidden elements for compatibility
      const fullNeckIcon = document.getElementById("fullNeckIcon");
      const fullNeckText = document.getElementById("fullNeckText");
      if (fullNeckIcon) fullNeckIcon.textContent = "🎵";
      if (fullNeckText) fullNeckText.textContent = "Show Patterns";
    } else {
      // Position mode active
      byPositionBtn.classList.add("active");
      fullNeckBtn.classList.remove("active");

      this.fretboardRenderer.generateFretboard(
        this.currentInstrument,
        this.selectedKey,
        this.selectedScale,
        this.selectedPattern,
        this.noteDuration
      );

      // Update hidden elements for compatibility
      const fullNeckIcon = document.getElementById("fullNeckIcon");
      const fullNeckText = document.getElementById("fullNeckText");
      if (fullNeckIcon) fullNeckIcon.textContent = "🎸";
      if (fullNeckText) fullNeckText.textContent = "Full Neck Scale";
    }

    // Ensure proper styling is applied
    this.generateCurrentFretboard();
  }

  updateAudioRelatedButtons() {
    this.audioPlayer.updatePlayButtonsState();
    this.chordRenderer.updatePlayButtonsState();
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new MultiInstrumentApp();
});
