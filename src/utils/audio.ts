/**
 * Web Audio API synthesizer and Background Music Engine for Lobo Solitaire
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private sfxVolume: number = 0.75;
  private bgmVolume: number = 0.5;

  // Master SFX Gain
  private sfxGainNode: GainNode | null = null;

  // BGM Gain & Audio
  private bgmGainNode: GainNode | null = null;
  private bgmAudio: HTMLAudioElement | null = null;
  private isMusicPlaying: boolean = false;
  private musicLoopTimer: number | null = null;
  private currentChordIndex: number = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      // Try to load bgm.mp3 if present
      try {
        this.bgmAudio = new Audio('/bgm.mp3');
        this.bgmAudio.loop = true;
        this.bgmAudio.volume = this.bgmVolume;
        // Perfect seamless loop fallback listener
        this.bgmAudio.addEventListener('ended', () => {
          if (this.bgmAudio) {
            this.bgmAudio.currentTime = 0;
            this.bgmAudio.play().catch(() => {});
          }
        });
      } catch {
        this.bgmAudio = null;
      }
    }
  }

  public initContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();

        // Create Master SFX Gain
        this.sfxGainNode = this.ctx.createGain();
        this.sfxGainNode.gain.setValueAtTime(
          this.isMuted ? 0 : this.sfxVolume,
          this.ctx.currentTime
        );
        this.sfxGainNode.connect(this.ctx.destination);

        // Create BGM Synth Gain
        this.bgmGainNode = this.ctx.createGain();
        this.bgmGainNode.gain.setValueAtTime(
          this.isMuted ? 0 : this.bgmVolume * 0.35,
          this.ctx.currentTime
        );
        this.bgmGainNode.connect(this.ctx.destination);
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    return this.initContext();
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
      const currentChord = chordProgressions[this.currentChordIndex];
      this.currentChordIndex = (this.currentChordIndex + 1) % chordProgressions.length;

      // Soft Low-pass Filter for that mellow warm Lo-Fi vinyl warmth
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(750, now);
      filter.Q.setValueAtTime(1.5, now);
      filter.connect(this.bgmGainNode);

      // Play soft Rhodes-like chime notes with subtle stagger
      currentChord.forEach((freq, noteIdx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        const noteStart = now + noteIdx * 0.08;
        const duration = 2.7;

        // Sine/Triangle blend for warm electric piano tone
        osc.type = noteIdx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);

        // Soft attack, gentle decay
        noteGain.gain.setValueAtTime(0, noteStart);
        noteGain.gain.linearRampToValueAtTime(0.08, noteStart + 0.12);
        noteGain.gain.exponentialRampToValueAtTime(0.0005, noteStart + duration);

        osc.connect(noteGain);
        noteGain.connect(filter);

        osc.start(noteStart);
        osc.stop(noteStart + duration);
      });

      // Sub Bass Note
      const bassFreq = currentChord[0] / 2;
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(bassFreq, now);

      bassGain.gain.setValueAtTime(0, now);
      bassGain.gain.linearRampToValueAtTime(0.12, now + 0.08);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

      bassOsc.connect(bassGain);
      bassGain.connect(this.bgmGainNode);

      bassOsc.start(now);
      bassOsc.stop(now + 2.5);
    };

    // Immediate first chord
    playChordStep();

    // 4 beats per bar, 80 BPM = 3 seconds per step, looping seamlessly
    this.musicLoopTimer = window.setInterval(() => {
      playChordStep();
    }, 2800);
  }

  // Card select sound: high crystal click
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

  // Card deselect sound: soft lower drop
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

  // Play move success chime
  public playMoveSuccess(type: 'match' | 'sum' | 'split' | 'higher') {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGainNode) return;

    const now = ctx.currentTime;
    const baseFreqs =
      {
        match: [523.25, 659.25, 783.99], // C5, E5, G5
        sum: [440, 554.37, 659.25, 880], // A4, C#5, E5, A5
        split: [587.33, 739.99, 880], // D5, F#5, A5
        higher: [392, 523.25, 659.25, 587.33], // G4, C5, E5, D5
      }[type] || [523.25, 659.25];

    baseFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + idx * 0.045;
      const duration = 0.22;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.sfxGainNode!);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  // Card draw sound: swish / flip
  public playCardDraw() {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGainNode) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.1);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Wolf card draw sound (growly/deep)
  public playWolfDraw() {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGainNode) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.18);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  // Long press tick (charging up surrender)
  public playChargeTick(progress: number) {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGainNode) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const freq = 200 + progress * 400;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    osc.stop(now + 0.03);
  }

  // Error/Invalid move sound
  public playInvalid() {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGainNode) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.setValueAtTime(140, now + 0.08);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  // Round Won by Player (Fanfare)
  public playRoundWin() {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGainNode) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + i * 0.1;
      const duration = i === notes.length - 1 ? 0.6 : 0.25;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.2, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

      osc.connect(gain);
      gain.connect(this.sfxGainNode!);

      osc.start(start);
      osc.stop(start + duration);
    });
  }

  // Round Lost / Surrender
  public playRoundLoss() {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGainNode) return;

    const now = ctx.currentTime;
    const notes = [392, 369.99, 329.63, 261.63]; // G4, F#4, E4, C4
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + i * 0.12;
      const duration = 0.35;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.16, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

      osc.connect(gain);
      gain.connect(this.sfxGainNode!);

      osc.start(start);
      osc.stop(start + duration);
    });
  }

  // Card shuffle sound: rapid cascading card sweeps
  public playShuffle() {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGainNode) return;

    const now = ctx.currentTime;
    for (let i = 0; i < 7; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + i * 0.035;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(350 + i * 70, start);
      osc.frequency.exponentialRampToValueAtTime(750 + i * 40, start + 0.05);

      gain.gain.setValueAtTime(0.08, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.05);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(start);
      osc.stop(start + 0.05);
    }
  }

  // Score count tick for aftermath or SFX volume slider preview
  public playScoreCountTick() {
    const ctx = this.getContext();
    if (!ctx || !this.sfxGainNode) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880 + Math.random() * 80, now);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    osc.stop(now + 0.04);
  }
}

export const soundManager = new SoundEngine();

