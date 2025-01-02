import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/auth-context/index.jsx";
import { InstructorContextProvider } from "./context/instructor-context.jsx";
import StudentProvider from "./context/student-context/index.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <InstructorContextProvider>
        <StudentProvider>
          <App />
        </StudentProvider>
      </InstructorContextProvider>
    </AuthProvider>
  </BrowserRouter>
);
