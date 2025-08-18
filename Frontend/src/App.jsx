import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useUserStore } from "./store/useUserStore";
import UserDashboard from "./pages/dashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const { user } = useUserStore();
  console.log("User in App:", user);

  const getDashboard = () => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return user?.type === "ADMIN" ? <AdminDashboard /> : <UserDashboard />;
  };

  return (
    <div className="bg-gradient-to-r from-gradienthero1 to-gradienthero2 min-h-screen">
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            className: "bg-green-500 text-white px-4 py-2 rounded shadow",
          },
          error: {
            className: "bg-red-500 text-white px-4 py-2 rounded shadow",
          },
        }}
      />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={getDashboard()} />

          <Route
            path="/signup"
            element={user ? <Navigate to="/" replace /> : <Signup />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <Login />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
