import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./assets/index.css";
import { AuthWrapper } from "./contexts/AuthWrapper";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthWrapper>
            <App />
        </AuthWrapper>
    </React.StrictMode>
);
