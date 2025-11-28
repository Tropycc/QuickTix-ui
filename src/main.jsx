import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './routes/Home.jsx';
import Details from './routes/Details.jsx';
import Purchase from './routes/Purchase.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/purchase/:id" element={<Purchase />} />
      </Routes>
    </Router>
  </StrictMode>
);