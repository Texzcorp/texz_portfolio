"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MdOutlineMusicNote, MdVolumeUp, MdVolumeOff } from 'react-icons/md';
import { HiPlay, HiPause, HiRewind, HiFastForward } from 'react-icons/hi';
import styles from './MusicPlayer.module.scss';
import { useBackground } from "@/app/components/BackgroundContext";
import { useMusicPlayerContext } from "@/app/components/MusicPlayerContext";

interface MusicPlayerProps {
  src: string;
  title?: string;
  compact?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  src, 
  compact = false,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
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

    const updateTime = () => setCurrentTime(audio.currentTime);
    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      stopMusic(src);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [src, stopMusic]);

  // Effet pour gérer l'analyseur audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isPlaying) return;

    try {
      // Réutiliser le contexte existant ou en créer un nouveau
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const analyser = audioContextRef.current.createAnalyser();
      
      // Créer une nouvelle source seulement si nécessaire
      if (!sourceRef.current) {
        sourceRef.current = audioContextRef.current.createMediaElementSource(audio);
      }

      analyser.fftSize = 256;
      sourceRef.current.connect(analyser);
      analyser.connect(audioContextRef.current.destination);

      const dataArray = new Float32Array(analyser.frequencyBinCount);
      
      const updateData = () => {
        analyser.getFloatFrequencyData(dataArray);
        setAudioData(dataArray);
        if (isPlaying) {
          requestAnimationFrame(updateData);
        }
      };

      updateData();

      return () => {
        analyser.disconnect();
        if (!isPlaying) {
          sourceRef.current?.disconnect();
          sourceRef.current = null;
          audioContextRef.current?.close();
          audioContextRef.current = null;
        }
      };
    } catch (error) {
      console.error('Error setting up audio analysis:', error);
    }
  }, [isPlaying, setAudioData]);

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
    <div className={`${styles.container} ${isCurrentPlayer && isPlaying ? styles.playing : ''}`}>
      <audio ref={audioRef} src={src} preload="metadata" />
      
      {/* Progress bar en haut */}
      <div className={styles.progressContainer}>
        <input
          type="range"
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
      <div className={styles.controlsWrapper}>
        <div className={styles.controlsGroup}>
          {!compact && (
            <button 
              onClick={onPrevious}
              className={`${styles.button} ${styles.skipButton}`}
              disabled={!hasPrevious}
              style={{ opacity: hasPrevious ? 1 : 0.3 }}
            >
              <HiRewind size={24} />
            </button>
          )}
          
          <button onClick={togglePlay} className={styles.button}>
            {isPlaying ? <HiPause size={28} /> : <HiPlay size={28} />}
          </button>

          {!compact && (
            <button 
              onClick={onNext}
              className={`${styles.button} ${styles.skipButton}`}
              disabled={!hasNext}
              style={{ opacity: hasNext ? 1 : 0.3 }}
            >
              <HiFastForward size={24} />
            </button>
          )}
        </div>

        <div className={styles.volumeControl}>
          <button onClick={handleMuteToggle} className={styles.button}>
            {muted || volume === 0 ? <MdVolumeOff size={24} /> : <MdVolumeUp size={24} />}
          </button>
          <input
            type="range"
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
