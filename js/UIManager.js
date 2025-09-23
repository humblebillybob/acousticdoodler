// Handles general UI management, theme switching, and tab management
class UIManager {
  constructor(instrumentData) {
    this.instrumentData = instrumentData;
    this.isDarkMode = true;
    this.activeTab = "scales";
  }

  setupThemeToggle() {
    document.getElementById("themeToggle").addEventListener("click", () => {
      this.toggleTheme();
    });
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.body.setAttribute("data-theme", this.isDarkMode ? "dark" : "light");
    
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

  setupTabNavigation() {
    document.querySelectorAll(".tab-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        this.switchTab(e.target.dataset.tab);
      });
    });
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

  setupInstrumentNavigation(onInstrumentChange) {
    document.querySelectorAll(".instrument-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        onInstrumentChange(e.target.dataset.instrument);
      });
    });
  }

  updateInstrumentNavigation(currentInstrument) {
    document.querySelectorAll(".instrument-button").forEach((button) => {
      button.classList.remove("active");
      if (button.dataset.instrument === currentInstrument) {
        button.classList.add("active");
      }
    });
  }

  updateInstrumentTitle(currentInstrument) {
    const instrument = this.instrumentData.getInstrument(currentInstrument);
    document.getElementById("instrumentTitle").textContent = instrument.name;
  }

  updateTips(currentInstrument) {
    const tipsGrid = document.getElementById("tipsGrid");
    const instrument = this.instrumentData.getInstrument(currentInstrument);
    const instrumentTips = instrument.tips;

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

  updatePatternOptions(currentInstrument, selectedScale, selectedPattern, onPatternChange) {
    const patternSelect = document.getElementById("patternSelect");
    const instrument = this.instrumentData.getInstrument(currentInstrument);
    const patterns = instrument.scalePatterns[selectedScale] || instrument.scalePatterns.major;
    
    patternSelect.innerHTML = "";
    patterns.forEach((pattern, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = pattern.name;
      patternSelect.appendChild(option);
    });
    
    const validPattern = selectedPattern < patterns.length ? selectedPattern : 0;
    patternSelect.value = validPattern;
    
    // Set up event listener if not already set
    if (!patternSelect.hasAttribute('data-listener-set')) {
      patternSelect.addEventListener("change", (e) => {
        onPatternChange(parseInt(e.target.value));
      });
      patternSelect.setAttribute('data-listener-set', 'true');
    }
    
    return validPattern;
  }

  updateInfo(selectedKey, selectedScale) {
    const scaleNotes = this.getScaleNotes(selectedKey, selectedScale);
    const scaleName = selectedScale.charAt(0).toUpperCase() + selectedScale.slice(1);
    
    document.getElementById("infoTitle").textContent = `${selectedKey} ${scaleName} Scale`;
    document.getElementById("infoText").textContent = this.instrumentData.getScaleInfo(selectedScale);
    document.getElementById("scaleNotes").textContent = scaleNotes.join(" - ");
    document.getElementById("legendRoot").textContent = selectedKey;
  }

  getScaleNotes(selectedKey, selectedScale) {
    const rootIndex = this.instrumentData.noteNames.indexOf(selectedKey);
    const intervals = this.instrumentData.getScaleIntervals(selectedScale);
    return intervals.map((interval) => this.instrumentData.noteNames[(rootIndex + interval) % 12]);
  }

  toggleInfo() {
    const infoPanel = document.getElementById("infoPanel");
    const infoIcon = document.getElementById("infoIcon");
    const isHidden = infoPanel.classList.contains("hidden");
    
    if (isHidden) {
      infoPanel.classList.remove("hidden");
      infoIcon.textContent = "▲";
    } else {
      infoPanel.classList.add("hidden");
      infoIcon.textContent = "▼";
    }
  }

  setupInfoButton() {
    document.getElementById("infoButton").addEventListener("click", () => {
      this.toggleInfo();
    });
  }

  updateAudioStatus(isInitialized) {
    const statusDiv = document.getElementById("audioStatus");
    const initBtn = document.getElementById("initAudioBtn");

    if (isInitialized) {
      statusDiv.textContent = "🔊 Audio ready! Click notes to hear them play.";
      statusDiv.className = "audio-status success";
      initBtn.textContent = "🔊 Audio Ready";
      initBtn.disabled = true;
    } else {
      statusDiv.textContent = "Click 'Initialize Audio' to enable sound playback";
      statusDiv.className = "audio-status";
      initBtn.disabled = false;
    }
  }

  setupVolumeControls(onVolumeChange, onDurationChange) {
    document.getElementById("masterVolumeSlider").addEventListener("input", (e) => {
      const volume = parseInt(e.target.value) / 100;
      onVolumeChange(volume);
      document.getElementById("masterVolumeValue").textContent = `${e.target.value}%`;
    });

    document.getElementById("noteDurationSlider").addEventListener("input", (e) => {
      const duration = parseInt(e.target.value) / 1000;
      onDurationChange(duration);
      document.getElementById("noteDurationValue").textContent = `${duration.toFixed(1)}s`;
    });
  }

  setupTempoSlider(onTempoChange) {
    document.getElementById("tempoSlider").addEventListener("input", (e) => {
      const tempo = parseInt(e.target.value);
      onTempoChange(tempo);
      document.getElementById("tempoValue").textContent = tempo;
    });
  }

  getActiveTab() {
    return this.activeTab;
  }

  getIsDarkMode() {
    return this.isDarkMode;
  }
}