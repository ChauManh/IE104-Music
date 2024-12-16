import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import PlayerContextProvider from "./context/PlayerContext.jsx";
import { QueueProvider } from "./context/QueueContext";

import "./config/firebase";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  // {/* <BrowserRouter> */}
  <QueueProvider>
    <PlayerContextProvider>
      <App />
    </PlayerContextProvider>
  </QueueProvider>,
  // {/* </BrowserRouter> */}
  // </StrictMode>,
);
