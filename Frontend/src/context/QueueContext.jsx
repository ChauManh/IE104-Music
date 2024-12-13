import React, { createContext, useState, useContext, useEffect } from 'react';
const QueueContext = createContext();

export const QueueProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [queue, setQueue] = useState([]);
  const [previousTracks, setPreviousTracks] = useState([]);

  const toggleQueue = () => {
    setIsVisible(prev => !prev);
  };

  const moveToTop = (index) => {
    const newQueue = queue.slice(index + 1);
    setQueue(newQueue);
  };

  const moveToNext = () => {
    if (queue.length > 0) {
      const newQueue = queue.slice(1);
      setQueue(newQueue);
    } else return;
  };
  
  const moveToPrevious = () => {};

  return (
    <QueueContext.Provider value={{ 
      isVisible, 
      queue, 
      setQueue, 
      toggleQueue, 
      moveToTop,
      moveToNext,
      moveToPrevious,
      previousTracks,
      setPreviousTracks
    }}>
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => useContext(QueueContext);