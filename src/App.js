import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { Analytics } from '@vercel/analytics/react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Pricing from './pages/Pricing';
import Order from './pages/Order';
import ImagePreloadProgress from './components/ImagePreloadProgress';
import ScrollToTop from './components/ScrollToTop';

// Initialize Speed Insights
injectSpeedInsights();

// Component to conditionally render header and footer
const AppContent = () => {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  return (
    <div className="App bg-white min-h-screen">
      <ScrollToTop />
      {!isAdminPage && <Header />}
      <main className={isAdminPage ? '' : 'pt-20'}>
        <Routes>
          {/* Public routes - always available */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:category" element={<Products />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/order" element={<Order />} />
          
          {/* Admin routes - only in development */}
          {process.env.NODE_ENV === 'development' && (() => {
            try {
              const Admin = require('./pages/Admin').default;
              return <Route path="/admin" element={<Admin />} />;
            } catch (error) {
              console.log('Admin component not available in production');
              return null;
            }
          })()}
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
      <ImagePreloadProgress />
      <Analytics />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
