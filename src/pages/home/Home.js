import React, {useEffect} from 'react';
import './Home.css';
import Header from '../../components/header/Header';
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../auth/useAuth";

const Home = () => {
    useAuth();
    const navigate = useNavigate();

    const handleClientsClick = () => {
        navigate("/clients");
    }

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
                <div className="tile add-order">+ Dodaj zamówienie</div>
                <div className="tile">Zamówienia</div>
                <div className="tile">Produkty</div>
                <div className="tile">Usługi</div>
                <div className="tile" onClick={() => handleClientsClick()}>Klienci</div>
                <div className="tile">Faktury</div>
            </div>
        </div>
    );
};

export default Home;
