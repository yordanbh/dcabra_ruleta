import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sileo";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />

    <Toaster
      position="top-right"
      offset={{
        top: 20,
        right: 20,
      }}
      options={{
        duration: 4000,
        roundness: 16,
      }}
    />
  </StrictMode>,
);
