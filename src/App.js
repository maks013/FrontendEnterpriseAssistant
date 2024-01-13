import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Home from './pages/home/Home';
import Clients from './pages/clients/Clients';
import AddClient from './pages/clients/add-client/AddClient';
import Services from './pages/services/Services';
import AddService from './pages/services/add-service/AddService';
import Products from './pages/products/Products';
import AddProduct from './pages/products/add-product/AddProduct';
import Orders from './pages/orders/Orders';
import AddOrder from './pages/orders/add-order/AddOrder';
import Invoices from './pages/invoices/Invoices';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/home" element={<Home/>}/>
                <Route path="/clients" element={<Clients/>}/>
                <Route path="/clients/add-client" element={<AddClient/>}/>
                <Route path="/services" element={<Services/>}/>
                <Route path="/services/add-service" element={<AddService/>}/>
                <Route path="/products" element={<Products/>}/>
                <Route path="/products/add-product" element={<AddProduct/>}/>
                <Route path="/orders" element={<Orders/>}/>
                <Route path="/orders/add-order" element={<AddOrder/>}/>
                <Route path="/invoices" element={<Invoices/>}/>
            </Routes>
        </Router>
    );
}

export default App;
