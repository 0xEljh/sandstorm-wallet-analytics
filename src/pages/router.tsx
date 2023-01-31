import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home";
import Profile from "./profile";
import Creator from "./creator";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/creator" element={<Creator />} />
      </Routes>
    </Router>
  );
}
