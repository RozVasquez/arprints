import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { injectSpeedInsights } from '@vercel/speed-insights';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import ProductTabs from './components/ProductTabs';
import DesignGallery from './components/DesignGallery';
import Footer from './components/Footer';

// Initialize Speed Insights
injectSpeedInsights();

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="App">
            <Header />
            <main>
              <Hero />
              <ProductTabs />
              <DesignGallery />
              <About />
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
