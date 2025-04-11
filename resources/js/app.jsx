// resources/js/app.jsx
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import "../css/app.css";

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob("./Pages/**/*.jsx");
    const page = pages[`./Pages/${name}.jsx`];

    if (!page) {
      return import("./Pages/NotFound.jsx"); 
    }

    return page(); 
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
});