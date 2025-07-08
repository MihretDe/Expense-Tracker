import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { useAuthContext } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import CircularProgress from "@mui/material/CircularProgress";
import { createTheme, ThemeProvider, CssBaseline, Switch } from "@mui/material";

import { useEffect } from "react";

// Create light and dark themes
const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#a3e635", // your custom primary color
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#a3e635", // same primary color in dark mode
    },
  },
});

function App() {
  const { isLoading } = useAuthContext();
  // Initialize darkMode from localStorage if available
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    return stored ? stored === "true" : false;
  });

  const handleThemeToggle = () => {
    setDarkMode((prev) => {
      localStorage.setItem("darkMode", String(!prev));
      // Also update html tag for Tailwind dark mode
      document.documentElement.classList.toggle("dark", !prev);
      return !prev;
    });
  };

  useEffect(() => {
    // Keep html tag in sync for Tailwind dark mode
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <div>
        <AppRoutes darkMode={darkMode} onToggleDarkMode={handleThemeToggle} />
        <ToastContainer />
      </div>
    </ThemeProvider>
  );
}

export default App;
