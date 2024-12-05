import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import PlayerContextProvider from "./context/PlayerContext.jsx";
import "./config/firebase";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  // {/* <BrowserRouter> */}
  <PlayerContextProvider>
    <App />
  </PlayerContextProvider>,
  // {/* </BrowserRouter> */}
  // </StrictMode>,
);
