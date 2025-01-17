import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
// import Data from "./pages/Data";
// import About from "./pages/About";
// import Analysis from "./pages/Analysis";
import Login from "./pages/Login/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
          <Route path="/" element={<Home />} />
          {/*<Route path="/about" element={<About />} />*/}

          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          {/*<Route path="/data" element={<ProtectedRoute roles={['admin', 'user']}><Data /></ProtectedRoute>}/>*/}
          {/*<Route path="/analysis" element={<ProtectedRoute roles={['admin']}><Analysis /></ProtectedRoute>}/>*/}

          {/* Unauthorized page for invalid role access */}
          <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />

          {/* Page not found */}
          <Route path="*" element={<div>Page Not Found</div>} />

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;