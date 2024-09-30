import React from 'react';
import SideBar from './components/Sidebar';
import TopNavigation from './components/TopNavigation';
import MainContent from './components/MainContent';

const App = () => {
  return (
    <div className="bg-black text-white flex h-screen">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <TopNavigation />
        <MainContent />
      </div>
    </div>
  );
};

export default App;
