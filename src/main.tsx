import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/montserrat/latin-400.css";
import "@fontsource/montserrat/latin-500.css";
import App from "@/App";
import "@/styles/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
