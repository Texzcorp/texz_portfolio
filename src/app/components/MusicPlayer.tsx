"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MdOutlineMusicNote, MdVolumeUp, MdVolumeOff } from 'react-icons/md';
import { HiPlay, HiPause } from 'react-icons/hi';
import styles from './MusicPlayer.module.scss';
import { useBackground } from "@/app/components/BackgroundContext";
import { useMusicPlayerContext } from "@/app/components/MusicPlayerContext";

interface MusicPlayerProps {
  src: string;
  compact?: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ src, compact = false }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.35);
  const [muted, setMuted] = useState(false);
  const { startPlaying, stopPlaying } = useBackground();
  const { activePlayerSrc, setActivePlayer } = useMusicPlayerContext();

  const isCurrentPlayer = activePlayerSrc === src;

  const handleEnded = useCallback(() => {
    setActivePlayer(null); // Indique que le lecteur s'est arrêté
    stopPlaying(); // Désactive l'effet de fond
  }, [setActivePlayer, stopPlaying]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener('ended', handleEnded);
      return () => {
        audioElement.removeEventListener('ended', handleEnded);
      };
    }
  }, [handleEnded]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      stopPlaying();
    } else {
      setActivePlayer(src);
      audio.play();
      setIsPlaying(true);
      startPlaying();
    }
  }, [isPlaying, setActivePlayer, startPlaying, stopPlaying, src]);

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

  // Attach audio events and handle metadata loading for duration and currentTime
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateTime = () => setCurrentTime(audio.currentTime);
      const setAudioData = () => {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
      };
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      // Attach events
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadeddata', setAudioData);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);

      // Force metadata to load in case it's already available
      if (audio.readyState >= 2) {
        setAudioData();
      }

      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadeddata', setAudioData);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
      };
    }
  }, [src]); // Re-run when the src changes

  // Ensure playback state is correct when the component is mounted
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [isPlaying]);

  // Handle the case where the user navigates away and returns
  useEffect(() => {
    if (!isCurrentPlayer && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      stopPlaying();
    }
  }, [isCurrentPlayer, isPlaying, stopPlaying]);

  const playerStyles = compact ? compactPlayerStyles : glassPlayerStyles;

  return (
    <div
      className={`${styles.container} ${isPlaying ? styles.playing : ''}`}
      style={playerStyles.container}
    >
      {isPlaying && (
        <div className={styles.waveAnimation}>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
        </div>
      )}
      <button onClick={togglePlay} style={playerStyles.button}>
        {isPlaying ? (
          <HiPause size={compact ? 28 : 32} color="#00FFFF" />
        ) : (
          <HiPlay size={compact ? 28 : 32} color="#00FFFF" />
        )}
      </button>

      <input
        type="range"
        min="0"
        max={duration || 0}
        value={currentTime}
        onChange={(e) => {
          const newTime = Number(e.target.value);
          setCurrentTime(newTime);
          if (audioRef.current) {
            audioRef.current.currentTime = newTime;
          }
        }}
        className={styles.progress}
        disabled={duration === 0} // Disable slider if duration is not set
      />

      {!compact && (
        <span className={`${styles.time} ${styles.timer}`} style={playerStyles.time}>
          {Math.floor(currentTime / 60)}:
          {Math.floor(currentTime % 60).toString().padStart(2, '0')} / 
          {Math.floor(duration / 60)}:
          {Math.floor(duration % 60).toString().padStart(2, '0')}
        </span>
      )}

      <div style={playerStyles.volumeControl}>
        <button onClick={handleMuteToggle} style={playerStyles.volumeButton}>
          {muted || volume === 0 ? (
            <MdVolumeOff size={compact ? 20 : 24} color="#00FFFF" />
          ) : (
            <MdVolumeUp size={compact ? 20 : 24} color="#00FFFF" />
          )}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => handleVolumeChange(Number(e.target.value))}
          className={styles.volumeSlider}
        />
      </div>

      <audio ref={audioRef} src={src} style={{ display: 'none' }} />
    </div>
  );
};

const glassPlayerStyles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Fond plus léger
    backdropFilter: 'blur(10px)', // Glassmorphism effect
    borderRadius: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)', 
    border: '1px solid rgba(255, 255, 255, 0.2)',
    width: '98%',
    maxWidth: '620px',
    marginLeft: '8px'
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.0)', // Fond noir translucide pour le bouton play
    border: 'none',
    color: '#00FFFF', 
    padding: '0px',
    paddingLeft: '15px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '19px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80px',
    height: '40px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.0)', 
  },
  progress: {
    width: '100%',
    margin: '0 10px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Barre translucide
    borderRadius: '10px',
    outline: 'none',
    cursor: 'pointer',
    height: '8px',
    appearance: 'none' as React.CSSProperties['appearance'], // Utilisation du type correct
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)', // Ombre intérieure
  },
  progressThumb: {
    width: '12px', // Taille du curseur
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#00FFFF',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)', // Ombre autour du curseur
    cursor: 'pointer',
  },
  time: {
    fontSize: '12px',
    color: '#ffffff',
    minWidth: '60px',
    textAlign: 'right',
  },
  volumeControl: {
    display: 'flex',
    alignItems: 'center',
  },
  volumeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
  },
  volumeSlider: {
    width: '80px',
    marginLeft: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Fond transparent
    borderRadius: '10px',
    outline: 'none',
    height: '8px',
    appearance: 'none' as React.CSSProperties['appearance'], // Utilisation du type correct
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)', // Ombre intérieure
  },
  volumeThumb: {
    width: '12px', // Taille du curseur
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#00FFFF',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)', // Ombre autour du curseur
    cursor: 'pointer',
  },
};

const compactPlayerStyles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '7px',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Fond un peu plus sombre
    backdropFilter: 'blur(10px)', // Toujours le glassmorphism
    borderRadius: '16px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    width: '100%',
    maxWidth: '500px', // Version plus petite
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
    border: 'none',
    color: '#00FFFF',
    padding: '0px',
    paddingLeft: '13px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '19px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '35px',
    height: '30px',
  },
  progress: {
    width: '70%', // Barre de progression plus courte
    margin: '0 5px',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '5px',
    outline: 'none',
    cursor: 'pointer',
    height: '8px',
    appearance: 'none' as React.CSSProperties['appearance'], // Utilisation du type correct
  },
  time: {
    fontSize: '10px', // Ajout de la propriété time pour la version compacte
    color: '#ffffff',
  },
  volumeControl: {
    display: 'flex',
    alignItems: 'center',
  },
  volumeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
  },
  volumeSlider: {
    width: '60px',
    marginLeft: '5px',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '5px',
    outline: 'none',
    height: '8px',
    appearance: 'none' as React.CSSProperties['appearance'], // Utilisation du type correct
  },
};

export default MusicPlayer;
