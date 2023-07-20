import React, { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Navigate, Route, Routes } from "react-router-dom";
import icon from "./assets/icon.png";
import loader from "./assets/puff.svg";
import Signin from "./Signin";
import Signup from "./Signup";
import Home from "./Home";

const App = () => {
  const { currentUser, loading } = useContext(AuthContext);
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/signin" />;
    }
    return children;
  };

  if (loading) {
    return (
      <div className="bg-slate-100 min-h-screen flex justify-center items-center text-center flex-col">
        <div className="flex gap-4 items-center mb-8">
          <img src={icon} className="w-10" />
          <h1 className="font-black text-slate-700 text-2xl">AnsariChat</h1>
        </div>
        <img src={loader} alt="Loader" />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
