import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { NewComponents } from "./NewComponents.jsx";
import { Props } from "./Props.jsx";
import { NonJsImports } from "./NonJsImports.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NonJsImports />
  </React.StrictMode>
);
