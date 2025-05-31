import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import ProductTabs from './components/ProductTabs';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
        <About />
        <ProductTabs />
      </main>
      <Footer />
    </div>
  );
}

export default App;
