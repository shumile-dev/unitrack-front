import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import LostItems from "./pages/LostItems";
import FoundItems from "./pages/FoundItems";
import Contact from "./pages/contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import PostItem from "./pages/PostItem";
import AllItems from "./pages/AllItems";
import ItemDetail from "./pages/ItemDetail";
// Uncomment if you have framer-motion installed
// import PageTransition from "./components/PageTransition";

// CSS-based transition wrapper as fallback
const CssTransition = ({ children }) => {
  return <div className="page-transition">{children}</div>;
};

function App() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<CssTransition><Home /></CssTransition>} />
          <Route path="/lost" element={<CssTransition><LostItems /></CssTransition>} />
          <Route path="/found" element={<CssTransition><FoundItems /></CssTransition>} />
          <Route path="/contact" element={<CssTransition><Contact /></CssTransition>} />
          <Route path="/login" element={<CssTransition><Login /></CssTransition>} />
          <Route path="/signup" element={<CssTransition><Signup /></CssTransition>} />
          <Route path="/profile" element={<CssTransition><Profile /></CssTransition>} />
          <Route path="/item/:id" element={<CssTransition><ItemDetail /></CssTransition>} />
          <Route path="/post" element={<CssTransition><PostItem /></CssTransition>} />
          <Route path="/all" element={<CssTransition><AllItems /></CssTransition>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
