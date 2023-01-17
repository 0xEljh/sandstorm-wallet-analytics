import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home";
import Curate from "./curate";
import Profile from "./profile";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/curate" element={<Curate />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}
