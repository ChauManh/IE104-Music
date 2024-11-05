// contexts/QueueContext.jsx
import React, { createContext, useState, useContext } from 'react';

const QueueContext = createContext();

export const QueueProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [queue, setQueue] = useState([]);

  const toggleQueue = () => {
    setIsVisible(prev => !prev);
  };

  return (
    <QueueContext.Provider value={{ isVisible, queue, setQueue, toggleQueue }}>
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => useContext(QueueContext);