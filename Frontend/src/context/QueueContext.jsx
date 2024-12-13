import React, { createContext, useState, useContext, useEffect } from 'react';
import { PlayerContext } from './PlayerContext';
const QueueContext = createContext();

export const QueueProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [queue, setQueue] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const toggleQueue = () => {
    setIsVisible(prev => !prev);
  };

  const moveToTop = (index) => {
    const newQueue = queue.slice(index + 1);
    setQueue(newQueue);
  };

  const moveToNext = () => {
    if (currentTrackIndex < queue.length - 1) {
      setCurrentTrackIndex((prevIndex) => prevIndex + 1);
    }
  };

  useEffect(() => {
    console.log("Updated CurrentTrackIndex:", currentTrackIndex);
    if (queue[currentTrackIndex]) {
      console.log("Next Track:", queue[currentTrackIndex]);
    }
  }, [currentTrackIndex]);
  
  const moveToPrevious = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <QueueContext.Provider value={{ 
      isVisible, 
      queue, 
      setQueue, 
      toggleQueue, 
      currentTrackIndex,
      setCurrentTrackIndex,
      moveToTop,
      moveToNext,
      moveToPrevious,
    }}>
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => useContext(QueueContext);