/**
 * Web Audio API Sound Synthesizer Engine & BGM Controller
 * Provides natural organic acoustics, chill Lo-Fi chords, and soft tactile sound effects.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private sfxVolume: number = 0.8;
  private bgmVolume: number = 0.55;
  private sfxGainNode: GainNode | null = null;
  private bgmGainNode: GainNode | null = null;
  private isMusicPlaying: boolean = false;
  private bgmAudio: HTMLAudioElement | null = null;
  private musicLoopTimer: number | null = null;

  constructor() {
    // Lazy AudioContext initialization
    if (typeof window !== 'undefined') {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
        this.setupGainNodes();

        // Optional HTML5 audio for Lo-Fi MP3 stream if available
        this.bgmAudio = new Audio('https://assets.mixkit.co/music/preview/mixkit-chill-bro-494.mp3');
        this.bgmAudio.loop = true;
        this.bgmAudio.volume = this.bgmVolume;
      } catch (e) {
        console.warn('AudioContext not supported or blocked in this environment', e);
      }
    }
  }

  private setupGainNodes() {
    if (!this.ctx) return;
    try {
      this.sfxGainNode = this.ctx.createGain();
      this.sfxGainNode.gain.setValueAtTime(this.isMuted ? 0 : this.sfxVolume, this.ctx.currentTime);
      this.sfxGainNode.connect(this.ctx.destination);

      this.bgmGainNode = this.ctx.createGain();
      this.bgmGainNode.gain.setValueAtTime(this.isMuted ? 0 : this.bgmVolume * 0.35, this.ctx.currentTime);
      this.bgmGainNode.connect(this.ctx.destination);
    } catch {
      // Ignore
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.setupGainNodes();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public getContext(): AudioContext | null {
    this.initContext();
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.ctx) {
      const now = this.ctx.currentTime;
      if (this.sfxGainNode) {
        this.sfxGainNode.gain.setValueAtTime(muted ? 0 : this.sfxVolume, now);
      }
      if (this.bgmGainNode) {
        this.bgmGainNode.gain.setValueAtTime(
          muted ? 0 : this.bgmVolume * 0.35,
          now
        );
      }
    }
    if (this.bgmAudio) {
      this.bgmAudio.muted = muted;
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    if (this.ctx && this.sfxGainNode && !this.isMuted) {
      this.sfxGainNode.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    }
  }

  public getSfxVolume(): number {
    return this.sfxVolume;
  }

  public setBgmVolume(vol: number) {
    this.bgmVolume = Math.max(0, Math.min(1, vol));
    if (this.ctx && this.bgmGainNode && !this.isMuted) {
      this.bgmGainNode.gain.setValueAtTime(
        this.bgmVolume * 0.35,
        this.ctx.currentTime
      );
    }
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.bgmVolume;
    }
  }

  public getBgmVolume(): number {
    return this.bgmVolume;
  }

  /**
   * Start Background Music (HTML5 Audio or Lo-Fi Ambient Synth Loop)
   */
  public startMusic() {
    if (this.isMusicPlaying) return;
    this.initContext();
    this.isMusicPlaying = true;

    // First attempt HTML5 audio
    if (this.bgmAudio) {
      this.bgmAudio.play().then(() => {
        // Successfully playing audio file
      }).catch(() => {
        // If file not found or blocked, use our built-in seamless Lo-Fi synth music loop
        this.startLoFiSynthMusic();
      });
    } else {
      this.startLoFiSynthMusic();
    }
  }

  /**
   * Procedural Lo-Fi Electric Piano Chill Background Music
   * Perfectly loops Bbmaj7 -> Am7 -> Gm7 -> Fmaj7 chord progression
   */
  private startLoFiSynthMusic() {
    if (this.musicLoopTimer) return;

    // Chords frequencies (Hz) - Calm Lo-Fi Rhodes / Chill chords
    const chordProgressions = [
      [233.08, 293.66, 349.23, 440.0], // Bbmaj7 (Bb3, D4, F4, A4)
      [220.0, 261.63, 329.63, 392.0],  // Am7 (A3, C4, E4, G4)
      [196.0, 233.08, 293.66, 349.23], // Gm7 (G3, Bb3, D4, F4)
      [174.61, 220.0, 261.63, 329.63], // Fmaj7 (F3, A3, C4, E4)
    ];

    const playChordStep = () => {
      if (!this.isMusicPlaying || this.isMuted || !this.ctx || !this.bgmGainNode) {
        return;
      }

      const ctx = this.ctx;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;
      const chordIdx = Math.floor((Date.now() / 4200) % chordProgressions.length);
      const freqs = chordProgressions[chordIdx];

      // Play soft warm electric piano chord
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const oscHarmonic = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(650 + (i * 80), now);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.04);

        // Gentle overtone
        oscHarmonic.type = 'triangle';
        oscHarmonic.frequency.setValueAtTime(freq * 2, now + i * 0.04);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.045, now + 0.35 + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 3.8);

        osc.connect(filter);
        oscHarmonic.connect(filter);
        filter.connect(gain);
        gain.connect(this.bgmGainNode!);

        osc.start(now + i * 0.04);
        oscHarmonic.start(now + i * 0.04);
        osc.stop(now + 4.0);
        oscHarmonic.stop(now + 4.0);
      });
    };

    playChordStep();
    this.musicLoopTimer = window.setInterval(playChordStep, 4000);
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.bgmAudio) {
      this.bgmAudio.pause();
    }
    if (this.musicLoopTimer) {
      clearInterval(this.musicLoopTimer);
      this.musicLoopTimer = null;
    }
  }

  // ================= SFX METHODS =================

  /**
   * Card select sound: high crystal click (Preserved exactly as requested!)
   */
  public playCardSelect() {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGainNode) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(580, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  /**
   * Card deselect sound: soft lower drop
   */
  public playCardDeselect() {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGainNode) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.06);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  /**
   * Play move success sound - Natural, organic, acoustic chime & warm wooden resonance
   * Designed specifically to match the calm Lo-Fi aesthetic rather than retro 8-bit synths.
   */
  public playMoveSuccess(type: 'match' | 'sum' | 'split' | 'higher') {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGainNode) return;

    const now = ctx.currentTime;

    // Organic acoustic configurations (Harmonics, frequencies & timing)
    const moveConfigs: Record<
      'match' | 'sum' | 'split' | 'higher',
      { notes: number[]; filterCutoff: number; duration: number; speed: number }
    > = {
      // Perfect match: Warm acoustic fifth bell resonance (F4, C5, A5)
      match: {
        notes: [349.23, 523.25, 880.0],
        filterCutoff: 1600,
        duration: 0.45,
        speed: 0.04,
      },
      // Sum: Warm ascending acoustic harp triad (D4, G4, B4, D5)
      sum: {
        notes: [293.66, 392.0, 493.88, 587.33],
        filterCutoff: 1500,
        duration: 0.42,
        speed: 0.05,
      },
      // Split: Serene acoustic kalimba harmony (E4, A4, C#5, E5)
      split: {
        notes: [329.63, 440.0, 554.37, 659.25],
        filterCutoff: 1700,
        duration: 0.45,
        speed: 0.05,
      },
      // Higher / Over: Rich wooden marimba resonant interval (G3, D4, G4)
      higher: {
        notes: [196.0, 293.66, 392.0],
        filterCutoff: 1300,
        duration: 0.40,
        speed: 0.045,
      },
    };

    const cfg = moveConfigs[type] || moveConfigs.match;

    // Create a smooth, organic lowpass filter to remove harsh digital edges
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(cfg.filterCutoff, now);
    filter.Q.setValueAtTime(1.2, now);
    filter.connect(this.sfxGainNode);

    cfg.notes.forEach((freq, idx) => {
      const startTime = now + idx * cfg.speed;
      const duration = cfg.duration;

      // Fundamental warm sine
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      // Subtle soft warm acoustic body overtone (triangle)
      const oscOvertone = ctx.createOscillator();
      oscOvertone.type = 'triangle';
      oscOvertone.frequency.setValueAtTime(freq * 2, startTime);

      const gain = ctx.createGain();
      const overtoneGain = ctx.createGain();

      // Natural acoustic envelope: gentle soft attack (~10ms) and warm ringing decay
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.16, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      overtoneGain.gain.setValueAtTime(0.001, startTime);
      overtoneGain.gain.linearRampToValueAtTime(0.04, startTime + 0.01);
      overtoneGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 0.6);

      osc.connect(gain);
      oscOvertone.connect(overtoneGain);

      gain.connect(filter);
      overtoneGain.connect(filter);

      osc.start(startTime);
      oscOvertone.start(startTime);

      osc.stop(startTime + duration);
      oscOvertone.stop(startTime + duration);
    });
  }

  /**
   * Card draw sound: natural smooth card glide & soft flick
   */
  public playCardDraw() {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGainNode) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(680, now + 0.09);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    osc.stop(now + 0.11);
  }

  /**
   * Wolf card draw sound: deep warm acoustic cello pluck (no harsh buzz)
   */
  public playWolfDraw() {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGainNode) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const oscHarmonic = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);
    filter.Q.setValueAtTime(1.5, now);

    // Warm deep cello fundamental
    osc.type = 'sine';
    osc.frequency.setValueAtTime(130.81, now); // C3
    osc.frequency.exponentialRampToValueAtTime(98.0, now + 0.22); // G2

    oscHarmonic.type = 'triangle';
    oscHarmonic.frequency.setValueAtTime(261.63, now); // C4

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.14, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(filter);
    oscHarmonic.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    oscHarmonic.start(now);
    osc.stop(now + 0.22);
    oscHarmonic.stop(now + 0.22);
  }

  /**
   * Long press tick (charging up surrender): gentle acoustic singing bowl resonance
   */
  public playChargeTick(progress: number) {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGainNode) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);

    osc.type = 'sine';
    const freq = 260 + progress * 320;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.06 + progress * 0.04, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  /**
   * Invalid / Error move sound: soft natural double marimba knock (replaces 8-bit sawtooth)
   */
  public playInvalid() {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGainNode) return;

    const now = ctx.currentTime;
    const freqs = [185.0, 146.83]; // F#3, D3 warm low knock

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(420, now);
    filter.connect(this.sfxGainNode);

    freqs.forEach((freq, idx) => {
      const startTime = now + idx * 0.08;
      const osc = ctx.createOscillator();
      const oscTriangle = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      oscTriangle.type = 'triangle';
      oscTriangle.frequency.setValueAtTime(freq * 1.5, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.15, startTime + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.16);

      osc.connect(gain);
      oscTriangle.connect(gain);
      gain.connect(filter);

      osc.start(startTime);
      oscTriangle.start(startTime);
      osc.stop(startTime + 0.16);
      oscTriangle.stop(startTime + 0.16);
    });
  }

  /**
   * Round Won / Victory Fanfare (Warm organic acoustic flourish)
   */
  public playRoundWin() {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGainNode) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, now);
    filter.connect(this.sfxGainNode);

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + i * 0.09;
      const duration = i === notes.length - 1 ? 0.7 : 0.35;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.18, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

      osc.connect(gain);
      gain.connect(filter);

      osc.start(start);
      osc.stop(start + duration);
    });
  }

  /**
   * Round Lost / Game Lost / Surrender (Smooth, natural melancholic acoustic tones)
   */
  public playRoundLoss() {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGainNode) return;

    const now = ctx.currentTime;
    const notes = [392.0, 349.23, 329.63, 261.63]; // G4, F4, E4, C4
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.connect(this.sfxGainNode);

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + i * 0.12;
      const duration = 0.45;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.15, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

      osc.connect(gain);
      gain.connect(filter);

      osc.start(start);
      osc.stop(start + duration);
    });
  }

  /**
   * Card shuffle sound: rapid cascading acoustic card sweeps
   */
  public playShuffle() {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGainNode) return;

    const now = ctx.currentTime;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(950, now);
    filter.Q.setValueAtTime(1.0, now);
    filter.connect(this.sfxGainNode);

    for (let i = 0; i < 6; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + i * 0.04;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320 + i * 55, start);
      osc.frequency.exponentialRampToValueAtTime(620 + i * 30, start + 0.05);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.09, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.05);

      osc.connect(gain);
      gain.connect(filter);

      osc.start(start);
      osc.stop(start + 0.05);
    }
  }

  /**
   * Clean acoustic button click / tap
   */
  public playButtonClick() {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGainNode) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(720, now + 0.04);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.09, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    osc.stop(now + 0.045);
  }

  /**
   * Score count tick for aftermath or SFX volume slider preview
   */
  public playScoreCountTick() {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGainNode) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, now);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(620 + Math.random() * 40, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    osc.stop(now + 0.04);
  }
}

export const soundManager = new SoundEngine();
