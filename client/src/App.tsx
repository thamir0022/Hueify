import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import { ThemeProvider } from "./components/theme-provider";
import MenuPage from "./pages/MenuPage";
import { UserProvider } from "./context/userCOntext";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <UserProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Routes>
          <Route element={<PrivateRoute/>}>
            <Route path="/menu" element={<MenuPage/>}/>
          </Route>
          <Route path="/" element={<HomePage />} />
          <Route path="/sign-in" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
        </Routes>
      </ThemeProvider>
    </UserProvider>
  );
};

export default App;
