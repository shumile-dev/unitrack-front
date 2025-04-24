import React from "react";
import ReactDOM from "react-dom/client"; // ✅ Ye change karein
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root")); // ✅ Ye method use karein
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
