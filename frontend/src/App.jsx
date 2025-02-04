import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import DataPage from "./pages/Data";
import NotFoundPage from "./pages/NotFound";

// import Analysis from "./pages/Analysis";
import Login from "./pages/Login/Login.jsx";
// import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Test from "./pages/Test";
import UnauthorizedPage from "./pages/Unauthorized/index.jsx";


function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
          <Route path="/test" element={<Test />} />

          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/data" element={<DataPage />} />

          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          {/*<Route path="/data" element={<ProtectedRoute roles={['admin', 'user']}><Data /></ProtectedRoute>}/>*/}
          {/*<Route path="/analysis" element={<ProtectedRoute roles={['admin']}><Analysis /></ProtectedRoute>}/>*/}

          {/* Unauthorized page for invalid role access */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Page not found */}
          <Route path="*" element={<NotFoundPage />} />

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;