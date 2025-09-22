import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Upload from './pages/Upload/Upload';
import Results from './pages/Results/Results';
import Jobs from './pages/Jobs/Jobs';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/results/:id" element={<Results />} />
            <Route path="/jobs" element={<Jobs />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
