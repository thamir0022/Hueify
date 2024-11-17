import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import { ThemeProvider } from "./components/theme-provider";
import { UserProvider } from "./context/userContext";
import PrivateRoute from "./components/PrivateRoute";
import ColorPicker from "./pages/ColorPicker";
import Image from "./pages/Image";
import CarModel from "./pages/CarModel";
import ColorHistory from "./pages/HistoryPage";

const App = () => {
  return (
    <UserProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Routes>
          <Route element={<PrivateRoute/>}>
            <Route path="/colors" element={<ColorPicker/>}/>
            <Route path="/history" element={<ColorHistory/>}/>
            <Route path="/3d" element={<CarModel/>}/>
          </Route>
          <Route path="/" element={<HomePage />} />
          <Route path="/sign-in" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/image" element={<Image />} />
        </Routes>
      </ThemeProvider>
    </UserProvider>
  );
};

export default App;
