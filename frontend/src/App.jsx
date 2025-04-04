import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import DatasetsPage from "./pages/Datasets";
import SamplesPage from "./pages/Samples";
import NotFoundPage from "./pages/NotFound";

// import Analysis from "./pages/Analysis";
import Login from "./pages/Login/Login.jsx";
// import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Test from "./pages/Test";
import UnauthorizedPage from "./pages/Unauthorized/index.jsx";
import {Bounce, ToastContainer} from "react-toastify";
import GeneView from "./pages/GeneView";
import VisiumView from "./pages/VisiumView";
import XDatasetsView from "./pages/XDatasets";
import CellTypesView from "./pages/CellTypesView";



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
                    width={400}
             />
             {/* Main Content (grows dynamically) */}
             <div style={{ flex: 1 }}>
                  <Routes>
                      <Route path="/test" element={<Test />} />

                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/datasets" element={<DatasetsPage />} />
                      <Route path="/xcheck" element={<XDatasetsView />} />

                      <Route path="/samples" element={<Navigate to="/samples/all" replace />} />
                      <Route path="/samples/:dataset_id" element={<SamplesPage />} />

                      <Route path="/views/geneview" element={<GeneView />} />
                      <Route path="/views/visiumview" element={<VisiumView />} />
                      <Route path="/views/celltypes" element={<CellTypesView />} />


                      <Route path="/login" element={<Login />} />

                      {/* Protected Routes */}
                      {/*<Route path="/data" element={<ProtectedRoute roles={['admin', 'user']}><Sample /></ProtectedRoute>}/>*/}
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