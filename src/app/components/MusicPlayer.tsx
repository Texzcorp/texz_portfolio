"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MdOutlineMusicNote, MdVolumeUp, MdVolumeOff } from 'react-icons/md';
import { HiPlay, HiPause } from 'react-icons/hi'; 

interface MusicPlayerProps {
  src: string;
  compact?: boolean; // Ajout d'une prop pour définir si le lecteur est compact ou non
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ src, compact = false }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      const updateTime = () => setCurrentTime(audio.currentTime);
      const setAudioData = () => setDuration(audio.duration);

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadeddata', setAudioData);

      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadeddata', setAudioData);
      };
    }
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = !muted;
      setMuted(!muted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = Number(e.target.value);
      setVolume(audio.volume);
    }
  };

  // Choisir le style en fonction de si c'est un player compact ou non
  const playerStyles = compact ? compactPlayerStyles : glassPlayerStyles;

  return (
    <div style={playerStyles.container}>

      <button onClick={togglePlay} style={playerStyles.button}>
        {isPlaying ? <HiPause size={compact ? 28 : 32} color="#00FFFF" /> : <HiPlay size={compact ? 28 : 32} color="#00FFFF" />}
      </button>

      <input
        type="range"
        min="0"
        max={duration}
        value={currentTime}
        onChange={(e) => {
          if (audioRef.current) {
            audioRef.current.currentTime = Number(e.target.value);
          }
        }}
        style={playerStyles.progress}
      />

      {!compact && (
        <span style={playerStyles.time}>
          {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')} / 
          {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
        </span>
      )}

      <div style={playerStyles.volumeControl}>
        <button onClick={toggleMute} style={playerStyles.volumeButton}>
          {muted || volume === 0 ? <MdVolumeOff size={compact ? 20 : 24} color="#00FFFF" /> : <MdVolumeUp size={compact ? 20 : 24} color="#00FFFF" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          style={playerStyles.volumeSlider}
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
      backgroundColor: 'rgba(0, 0, 0, 0.4)', // Fond plus sombre
      backdropFilter: 'blur(10px)', // Glassmorphism effect
      borderRadius: '20px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)', // Légèrement plus sombre aussi
      border: '1px solid rgba(255, 255, 255, 0.2)',
      width: '100%',
      maxWidth: '600px',
    },
    leftSection: {
      display: 'flex',
      alignItems: 'center',
    },
    button: {
      backgroundColor: '#000000', // Fond noir pour le bouton play
      border: 'none',
      color: '#00FFFF', // Icône cyan
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
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)', // Ombre légèrement renforcée pour plus de contraste
    },
    progress: {
      width: '100%',
      margin: '0 10px',
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: '5px',
      outline: 'none',
      cursor: 'pointer',
    },
    time: {
      fontSize: '12px', // Ajout de la propriété time
      color: '#ffffff', // Texte blanc
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
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: '5px',
      outline: 'none',
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
    leftSection: {
      display: 'flex',
      alignItems: 'center',
    },
    button: {
      backgroundColor: '#000000',
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
    },
    time: {
      fontSize: '10px', // Ajout de la propriété time pour la version compacte
      color: '#ffffff', // Texte blanc
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
    },
  };
  

export default MusicPlayer;
