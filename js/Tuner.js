// Handles tuner functionality
class Tuner {
  constructor(instrumentData) {
    this.instrumentData = instrumentData;
    this.tunerActive = false;
    this.microphone = null;
    this.analyser = null;
    this.tunerAnimationFrame = null;
    this.tunerAudioContext = null;
  }

  openTuner(currentInstrument) {
    const modal = document.getElementById("tunerModal");
    modal.classList.remove("hidden");
    this.generateStringTargets(currentInstrument);

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

  generateStringTargets(currentInstrument) {
    const targetsContainer = document.getElementById("stringTargets");
    targetsContainer.innerHTML = "";

    const instrument = this.instrumentData.getInstrument(currentInstrument);
    if (!instrument) {
      console.error("Instrument not found:", currentInstrument);
      return;
    }
    const tuning = instrument.tuning;
    const frequencies = instrument.openStringFreqs;

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
        "⚠ Microphone access required";
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
    const currentInstrument =
      document.querySelector(".instrument-button.active")?.dataset
        ?.instrument || "guitar";
    const instrument = this.instrumentData.getInstrument(currentInstrument);
    if (!instrument) {
      console.error("Instrument not found:", currentInstrument);
      return;
    }
    const tuning = instrument.tuning;
    const targetFreqs = instrument.openStringFreqs;

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
