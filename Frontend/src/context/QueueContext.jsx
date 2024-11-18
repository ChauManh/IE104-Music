import React, { createContext, useState, useContext } from 'react';

const QueueContext = createContext();

export const QueueProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [queue, setQueue] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const toggleQueue = () => {
    setIsVisible(prev => !prev);
  };

  const moveToTop = (index) => {
    const newQueue = [...queue];
    const selectedTrack = newQueue.splice(index, 1)[0];
    newQueue.splice(currentTrackIndex + 1, 0, selectedTrack);
    setQueue(newQueue);
  };

  const moveToNext = () => {
    if (currentTrackIndex < queue.length - 1) {
      const newQueue = [...queue];
      const currentTrack = newQueue[currentTrackIndex];
      newQueue.splice(currentTrackIndex, 1);
      newQueue.push(currentTrack);
      setQueue(newQueue);
      setCurrentTrackIndex(currentTrackIndex + 1);
    }
  };

  const moveToPrevious = () => {
    if (currentTrackIndex > 0) {
      const newQueue = [...queue];
      const prevTrack = newQueue[currentTrackIndex - 1];
      newQueue.splice(currentTrackIndex - 1, 1);
      newQueue.unshift(prevTrack);
      setQueue(newQueue);
      setCurrentTrackIndex(currentTrackIndex - 1);
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
      moveToPrevious
    }}>
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => useContext(QueueContext);