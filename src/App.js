import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login/Login.js';
import Register from './pages/register/Register.js';
import Home from './pages/home/Home.js';
import Clients from './pages/clients/Clients.js';
import AddClient from './pages/clients/add-client/AddClient.js';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="clients/add-client" element={<AddClient />} />
        </Routes>
      </Router>
  );
}

export default App;
