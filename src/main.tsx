import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import App from "./App.tsx";

import "./index.css";

import "@marcomattes/epaper-components";
import "@marcomattes/epaper-components/styles/tokens.css";
import "@marcomattes/epaper-components/styles/base.css";
import "@marcomattes/epaper-components/styles/components.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
