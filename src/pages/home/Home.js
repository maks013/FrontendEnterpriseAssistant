import React, {useEffect} from 'react';
import './Home.scss';
import Header from '../../components/header/Header';
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../auth/useAuth";

const Home = () => {
    useAuth();
    const navigate = useNavigate();

    const handleAddOrderClick = () => {
        navigate("/orders/add-order");
    }

    const handleOrdersClick = () => {
        navigate("/orders");
    }

    const handleProductsClick = () => {
        navigate("/products");
    }

    const handleServicesClick = () => {
        navigate("/services");
    }

    const handleClientsClick = () => {
        navigate("/clients");
    }

    const handleInvoicesClick = () => {
        navigate("/invoices");
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="home">
            <Header />
            <div className="main-content">
                <div className="tile add-order"onClick={handleAddOrderClick}>+ Dodaj zamówienie</div>
                <div className="tile" onClick={handleOrdersClick}>Zamówienia</div>
                <div className="tile" onClick={handleProductsClick}>Produkty</div>
                <div className="tile" onClick={handleServicesClick}>Usługi</div>
                <div className="tile" onClick={handleClientsClick}>Klienci</div>
                <div className="tile" onClick={handleInvoicesClick}>Faktury</div>
            </div>
        </div>
    );
};

export default Home;
