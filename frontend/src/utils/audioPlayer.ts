// Lightweight web audio synthesizer for smooth interactive previews without external audio files

class AudioPreviewEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timer: number | null = null;
  private onTimeUpdate?: (seconds: number) => void;
  private onStateChange?: (playing: boolean) => void;
  private currentTrackId: string | null = null;
  private currentTime: number = 0;

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTrack(trackId: string, onUpdate?: (seconds: number) => void, onState?: (playing: boolean) => void) {
    this.initCtx();
    this.currentTrackId = trackId;
    this.onTimeUpdate = onUpdate;
    this.onStateChange = onState;
    this.isPlaying = true;
    this.onStateChange?.(true);

    this.startOscillatorMelody();

    if (this.timer) clearInterval(this.timer);
    this.timer = window.setInterval(() => {
      this.currentTime += 1;
      this.onTimeUpdate?.(this.currentTime);
      if (this.currentTime >= 287) {
        this.stop();
      }
    }, 1000);
  }

  private startOscillatorMelody() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Create an ambient harmonic chord progression
    const freqs = [220, 261.63, 329.63, 392.00, 440]; // A minor chord notes
    freqs.forEach((f, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, now);
      
      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.03, now + 1.5);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 4);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now + idx * 0.15);
      osc.stop(now + 6);
    });
  }

  pause() {
    this.isPlaying = false;
    this.onStateChange?.(false);
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  stop() {
    this.pause();
    this.currentTime = 0;
    this.onTimeUpdate?.(0);
  }

  toggle(trackId: string, onUpdate?: (seconds: number) => void, onState?: (playing: boolean) => void) {
    if (this.isPlaying && this.currentTrackId === trackId) {
      this.pause();
    } else {
      this.playTrack(trackId, onUpdate, onState);
    }
  }

  getIsPlaying(trackId?: string): boolean {
    if (trackId) {
      return this.isPlaying && this.currentTrackId === trackId;
    }
    return this.isPlaying;
  }
}

export const audioEngine = new AudioPreviewEngine();
