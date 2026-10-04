import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Shuffle, Repeat, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { audioEngine } from '../utils/audioPlayer';

interface AudioWaveformCardProps {
  trackId: string;
  durationStr?: string;
  bars?: number[];
  variant?: 'feed' | 'detail';
  /** Real audio file URL. When present the card plays it; otherwise the synth preview. */
  src?: string;
}

const defaultBars = [
  25, 45, 70, 85, 40, 30, 75, 95, 60, 50, 
  80, 100, 70, 55, 35, 65, 90, 75, 55, 95, 
  100, 65, 40, 80, 85, 60, 30, 45, 65, 85, 
  95, 70, 50, 60, 75, 90, 85, 45, 30, 20
];

export const AudioWaveformCard: React.FC<AudioWaveformCardProps> = ({
  trackId,
  durationStr = '4:47',
  bars = defaultBars,
  variant = 'feed',
  src
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [realDuration, setRealDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Pause real audio on unmount / track change.
  useEffect(() => {
    const el = audioRef.current;
    return () => {
      el?.pause();
    };
  }, [trackId]);

  // Keep mute flag in sync with the element.
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = isMuted;
  }, [isMuted]);

  const togglePlay = () => {
    const el = audioRef.current;
    if (src && el) {
      if (el.paused) {
        void el.play().catch(() => setIsPlaying(false));
      } else {
        el.pause();
      }
      return;
    }
    // No uploaded file (old posts) — fall back to the synth preview.
    audioEngine.toggle(
      trackId,
      (sec) => setSeconds(sec),
      (playing) => setIsPlaying(playing)
    );
    setIsPlaying(!isPlaying);
  };

  const seekBy = (delta: number) => {
    const el = audioRef.current;
    if (src && el && Number.isFinite(el.duration)) {
      el.currentTime = Math.max(0, Math.min(el.duration, el.currentTime + delta));
    } else {
      setSeconds((s) => Math.max(0, s + delta));
    }
  };

  const seekToFraction = (fraction: number) => {
    const el = audioRef.current;
    if (src && el && Number.isFinite(el.duration)) {
      el.currentTime = fraction * el.duration;
    } else {
      setSeconds(Math.floor(fraction * 287));
    }
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const totalSecs = src && realDuration > 0 ? realDuration : 287;
  const shownDuration =
    src && realDuration > 0 ? formatTime(Math.floor(realDuration)) : durationStr;

  return (
    <div className={`w-full rounded-2xl bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-pink-50/40 border border-indigo-100/70 p-4 sm:p-6 ${variant === 'detail' ? 'shadow-sm' : ''}`}>
      {src && (
        <audio
          ref={audioRef}
          src={src}
          preload="metadata"
          loop={isRepeat}
          onTimeUpdate={(e) => setSeconds(Math.floor(e.currentTarget.currentTime))}
          onLoadedMetadata={(e) => setRealDuration(Math.floor(e.currentTarget.duration || 0))}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            if (!isRepeat) setSeconds(0);
          }}
        />
      )}
      {/* Top Waveform Display */}
      <div className="relative flex items-center justify-between gap-1 sm:gap-1.5 h-20 sm:h-24 px-2 sm:px-4 py-2 bg-white/80 backdrop-blur-xs rounded-xl border border-indigo-100/50 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/10 to-pink-500/5 pointer-events-none" />

        {/* Center Floating Big Play button in feed view */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button
            onClick={togglePlay}
            className="pointer-events-auto w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-transform"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
          </button>
        </div>

        {/* Dynamic Waveform Bars */}
        {bars.map((barHeight, idx) => {
          const progressPercent = totalSecs > 0 ? (seconds / totalSecs) * 100 : 0;
          const barPercent = (idx / bars.length) * 100;
          const isPassed = barPercent <= progressPercent;

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col justify-center items-center h-full cursor-pointer group"
              onClick={() => seekToFraction(idx / bars.length)}
            >
              <div
                style={{
                  height: `${isPlaying ? Math.max(15, (barHeight + Math.sin(idx + seconds * 2) * 25) % 100) : barHeight}%`,
                  transition: 'height 0.15s ease'
                }}
                className={`w-full max-w-[4px] rounded-full transition-colors ${
                  isPassed
                    ? 'bg-gradient-to-t from-indigo-600 to-purple-500'
                    : 'bg-indigo-200 group-hover:bg-indigo-300'
                }`}
              />
            </div>
          );
        })}

        {/* Duration badge */}
        <div className="absolute bottom-1.5 right-2 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-white/90 text-indigo-700 shadow-xs border border-indigo-100">
          {isPlaying ? formatTime(seconds) : shownDuration}
        </div>
      </div>

      {/* Detail view extra playback controls */}
      {variant === 'detail' && (
        <div className="mt-4 flex items-center justify-between pt-2 border-t border-indigo-100/60">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsShuffle(!isShuffle)}
              className={`p-2 rounded-lg transition-colors ${
                isShuffle ? 'text-indigo-600 bg-indigo-100/70' : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Shuffle"
            >
              <Shuffle className="w-4 h-4" />
            </button>
            <button
              onClick={() => seekBy(-15)}
              className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
              title="Previous 15s"
            >
              <SkipBack className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-600/30 transition-transform active:scale-95"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
            <span className="text-xs font-bold text-gray-700">
              {formatTime(seconds)} / {shownDuration}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => seekBy(15)}
              className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
              title="Next 15s"
            >
              <SkipForward className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsRepeat(!isRepeat)}
              className={`p-2 rounded-lg transition-colors ${
                isRepeat ? 'text-indigo-600 bg-indigo-100/70' : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Repeat"
            >
              <Repeat className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
