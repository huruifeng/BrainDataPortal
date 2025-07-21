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
import GeneView from "./pages/GeneView/index.jsx";
import VisiumView from "./pages/VisiumView";
import XQTLView from "./pages/xQTLView";
import XDatasetsView from "./pages/XDatasets";
import CellTypesView from "./pages/CellTypesView";
import ViewsHome from "./pages/ViewsHome";
import DatasetManagePage from "./pages/DatasetManage";
import LayerView from "./pages/LayerView/index.jsx";
import HowToUse from "./pages/Help/HowToUse.jsx";
import FAQPage from "./pages/Help/FAQ.jsx";
import RESTAPIPage from "./pages/Help/RESTAPI.jsx";
import Home_HM from "./pages/Home_HM/index.jsx";



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
                      <Route path="/home_hm" element={<Home_HM />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/datasets" element={<DatasetsPage />} />

                      <Route path="/samples" element={<Navigate to="/samples/all" replace />} />
                      <Route path="/samples/:dataset_id" element={<SamplesPage />} />

                      <Route path="/views" element={<ViewsHome />} />
                      <Route path="/views/geneview" element={<GeneView />} />
                      <Route path="/views/visiumview" element={<VisiumView />} />
                      <Route path="/views/xqtlview" element={<XQTLView />} />
                      <Route path="/views/celltypes" element={<CellTypesView />} />
                      <Route path="/views/layersview" element={<LayerView />} />
                      <Route path="/views/xcheck" element={<XDatasetsView />} />

                      <Route path="/help/howtouse" element={<HowToUse />} />
                      <Route path="/help/faq" element={<FAQPage />} />
                      <Route path="/help/restapi" element={<RESTAPIPage />} />


                      <Route path="/datasetmanager" element={<DatasetManagePage />} />

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