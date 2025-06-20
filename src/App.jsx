import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AnimatePresence } from 'framer-motion';
import Layout from '@/Layout';
import { routeArray } from '@/config/routes';
import NotFound from '@/components/pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-white">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Layout />}>
              {routeArray.map(route => (
                <Route
                  key={route.id}
                  path={route.path}
                  element={<route.component />}
                />
              ))}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AnimatePresence>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          className="z-[9999]"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;