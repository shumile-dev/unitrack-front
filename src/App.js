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

function App() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lost" element={<LostItems />} />
          <Route path="/found" element={<FoundItems />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/item/:id" element={<ItemDetail />} />
          <Route path="/post" element={<PostItem />} />
          <Route path="/all" element={<AllItems />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
