import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { Analytics } from '@vercel/analytics/react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Pricing from './pages/Pricing';

// Initialize Speed Insights
injectSpeedInsights();

function App() {
  return (
    <Router>
      <div className="App bg-white min-h-screen">
        <Header />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:category" element={<Products />} />
            <Route path="/pricing" element={<Pricing />} />
          </Routes>
        </main>
        <Footer />
        <Analytics />
      </div>
    </Router>
  );
}

export default App;
