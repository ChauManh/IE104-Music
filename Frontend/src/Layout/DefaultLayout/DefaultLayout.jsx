import TopNav from "../Components/TopNav";
import Sidebar from "../Components/sidebar";
import Player from "../Components/Player";
import Queue from "../../components/Queue";
import React, { memo } from "react";

// Memoize the Sidebar and Queue components
const MemoizedSidebar = memo(Sidebar);
const MemoizedQueue = memo(Queue);

const DefaultLayout = ({ children }) => {
  return (
    <div className="h-screen bg-black">
      <div className="flex h-[90%]">
        <TopNav />
        <MemoizedSidebar />
        {children}
        <MemoizedQueue />
      </div>
      <Player />
    </div>
  );
};

export default memo(DefaultLayout);
