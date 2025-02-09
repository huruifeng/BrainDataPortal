import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import ProjectsPage from "./pages/Projects";
import DataPage from "./pages/Data";
import NotFoundPage from "./pages/NotFound";

// import Analysis from "./pages/Analysis";
import Login from "./pages/Login/Login.jsx";
// import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Test from "./pages/Test";
import UnauthorizedPage from "./pages/Unauthorized/index.jsx";
import {Bounce, ToastContainer} from "react-toastify";


function App() {
  return (
    <Router>
         <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <NavBar />
                {/* Global Toast Configuration */}
             <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={true}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    transition={Bounce}
             />
             {/* Main Content (grows dynamically) */}
             <div style={{ flex: 1 }}>
                  <Routes>
                      <Route path="/test" element={<Test />} />

                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/projects" element={<ProjectsPage />} />

                      <Route path="/data" element={<Navigate to="/data/all" replace />} />
                      <Route path="/data/:project_id" element={<DataPage />} />

                      <Route path="/login" element={<Login />} />

                      {/* Protected Routes */}
                      {/*<Route path="/data" element={<ProtectedRoute roles={['admin', 'user']}><Data /></ProtectedRoute>}/>*/}
                      {/*<Route path="/analysis" element={<ProtectedRoute roles={['admin']}><Analysis /></ProtectedRoute>}/>*/}

                      {/* Unauthorized page for invalid role access */}
                      <Route path="/unauthorized" element={<UnauthorizedPage />} />

                      {/* Page not found */}
                      <Route path="*" element={<NotFoundPage />} />

                </Routes>
             </div>
             <Footer />
         </div>
    </Router>
  );
}

export default App;