import { ToastContainer } from "react-toastify";
import { useAuthContext } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: "#a3e635", // custom primary color
    },
  },
});


function App() {
  const {  isLoading } = useAuthContext();

  if (isLoading)
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </div>
    );

  return (
    <ThemeProvider theme={theme}>
    <div>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
    </ThemeProvider>
  );
}

export default App;
