import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// import { Window } from "@tauri-apps/api/window";
// Ensure you create an instance of the window first
// const window = new Window("main");

// Add a listener to open DevTools when the user presses F12 (for production)
// document.addEventListener("keydown", (event) => {
//   if (event.key === "F12") {
//     // Simulate opening DevTools in production
//     appWindow.openDevTools(); // This will open devtools in development mode
//   }
// });
// document.addEventListener("keydown", (event) => {
//   // Check if the user presses F12 (common DevTools hotkey)
//   if (event.key === "F12") {
//     window.once("tauri://ready", () => {
//       window.toggleDevTools();
//     });
//   }
// });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
