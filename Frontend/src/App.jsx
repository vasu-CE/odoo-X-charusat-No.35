import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Landing from "./pages/Landing";
import LeaderBoard from "./pages/LeaderBoard";
import Analytics from "./pages/Analytics";
import ReportIssue from "./components/ReportIssue";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import StorePage from "./pages/StorePage";
function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-20"> 
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/leaderboard" element={<LeaderBoard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/report-issue" element={<ReportIssue />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/store-cart" element={<StorePage />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
