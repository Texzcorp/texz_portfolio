"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MdOutlineMusicNote, MdVolumeUp, MdVolumeOff } from 'react-icons/md';
import { HiPlay, HiPause, HiRewind, HiFastForward } from 'react-icons/hi';
import styles from './MusicPlayer.module.scss';
import { useMusicPlayerContext } from "@/app/components/MusicPlayerContext";

interface MusicPlayerProps {
  src: string;
  title?: string;
  compact?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  onEnded?: () => void;
  onTimeUpdate?: (time: number) => void;
  onPlayingStateChange?: (isPlaying: boolean) => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  src, 
  title = 'track',
  compact = false,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
  onEnded,
  onTimeUpdate,
  onPlayingStateChange,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const frameRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [muted, setMuted] = useState(false);
  const { activePlayerSrc, setActivePlayerSrc, stopMusic, setAudioData } = useMusicPlayerContext();

  const isCurrentPlayer = activePlayerSrc === src;

  // Effet pour gérer la lecture automatique
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isCurrentPlayer) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
          stopMusic(src);
        });
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [isCurrentPlayer, src]);

  // Gestion des événements audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      onTimeUpdate?.(audio.currentTime);
    };
    
    const setAudioData = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      setCurrentTime(audio.currentTime);
    };
    const handlePlay = () => {
      setIsPlaying(true);
      onPlayingStateChange?.(true);
    };
    const handlePause = () => {
      setIsPlaying(false);
      onPlayingStateChange?.(false);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnded) {
        onEnded();
      } else {
        stopMusic(src);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onTimeUpdate, onPlayingStateChange, src, stopMusic, onEnded]);

  // Effet pour gérer l'analyseur audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isPlaying) return;

    try {
      // Réutiliser le contexte existant ou en créer un nouveau
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      if (!analyserRef.current) {
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
      }
      const analyser = analyserRef.current;
      
      // Créer une nouvelle source seulement si nécessaire
      if (!sourceRef.current) {
        sourceRef.current = audioContextRef.current.createMediaElementSource(audio);
        sourceRef.current.connect(analyser);
        analyser.connect(audioContextRef.current.destination);
      }
      void audioContextRef.current.resume();

      const dataArray = new Float32Array(analyser.frequencyBinCount);
      
      let lastUpdate = 0;
      const updateData = (time: number) => {
        if (time - lastUpdate > 80) {
          analyser.getFloatFrequencyData(dataArray);
          setAudioData(new Float32Array(dataArray));
          lastUpdate = time;
        }
        frameRef.current = requestAnimationFrame(updateData);
      };
      frameRef.current = requestAnimationFrame(updateData);

      return () => {
        cancelAnimationFrame(frameRef.current);
      };
    } catch (error) {
      console.error('Error setting up audio analysis:', error);
    }
  }, [isPlaying, setAudioData]);

  useEffect(() => () => {
    cancelAnimationFrame(frameRef.current);
    sourceRef.current?.disconnect();
    analyserRef.current?.disconnect();
    void audioContextRef.current?.close();
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      stopMusic(src);
    } else {
      setActivePlayerSrc(src);
    }
  }, [isPlaying, src, stopMusic, setActivePlayerSrc]);

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value;
    }
  };

  const handleMuteToggle = () => {
    setMuted(!muted);
    if (audioRef.current) {
      audioRef.current.muted = !muted;
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  const formatTime = (seconds: number): string => {
    if (!Number.isFinite(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  return (
    <div role="group" aria-label={'Audio player: ' + title} className={`${styles.container} ${isCurrentPlayer && isPlaying ? styles.playing : ''}`}>
      <audio ref={audioRef} src={src} preload="metadata" />
      
      {/* Progress bar en haut */}
      <div className={styles.progressContainer}>
        <input
          type="range"
          aria-label="Playback position"
          aria-valuetext={formatTime(currentTime) + ' of ' + formatTime(duration)}
          min="0"
          max={duration || 0}
          value={currentTime}
          className={styles.progress}
          onChange={handleTimeChange}
        />
        <div className={styles.timeInfo}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls en dessous */}
      <div className={`${styles.controlsWrapper} ${compact ? styles.compact : ''}`}>
        <div className={`${styles.controlsGroup} ${compact ? styles.compact : ''}`}>
          {!compact && (
            <button 
              type="button"
              aria-label="Previous track"
              onClick={onPrevious}
              className={`${styles.button} ${styles.skipButton}`}
              disabled={!hasPrevious}
              style={{ opacity: hasPrevious ? 1 : 0.3 }}
            >
              <HiRewind size={28} />
            </button>
          )}
          
          <button type="button" aria-label={(isPlaying ? 'Pause ' : 'Play ') + title} onClick={togglePlay} className={`${styles.button} ${compact ? styles.compact : ''}`}>
            {isPlaying ? <HiPause size={compact ? 38 : 38} /> : <HiPlay size={compact ? 38 : 38} />}
          </button>

          {!compact && (
            <button 
              type="button"
              aria-label="Next track"
              onClick={onNext}
              className={`${styles.button} ${styles.skipButton}`}
              disabled={!hasNext}
              style={{ opacity: hasNext ? 1 : 0.3 }}
            >
              <HiFastForward size={24} />
            </button>
          )}
        </div>

        <div className={`${styles.volumeControl} ${compact ? styles.compact : ''}`}>
          <button type="button" aria-label={muted ? 'Unmute' : 'Mute'} onClick={handleMuteToggle} className={`${styles.button} ${compact ? styles.compact : ''}`}>
            {muted || volume === 0 ? <MdVolumeOff size={24} /> : <MdVolumeUp size={24} />}
          </button>
          <input
            type="range"
            aria-label="Volume"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            className={styles.volumeSlider}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          />
        </div>
      </div>

      {isPlaying && (
        <div className={styles.waveContainer}>
          <div className={styles.waveAnimation} />
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
