import React from 'react';
import './Header.scss';
import {useNavigate} from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate("/home");
    };

    const handleOrdersClick = () => {
        navigate("/orders");
    };

    const handleClientsClick = () => {
        navigate("/clients");
    };

    const handleInvoicesClick = () => {
        navigate("/invoices");
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="header">
            <button className="button" onClick={handleHomeClick}>Strona główna</button>
            <button className="button" onClick={handleOrdersClick}>Zamówienia</button>
            <button className="button" onClick={handleClientsClick}>Klienci</button>
            <button className="button" onClick={handleInvoicesClick}>Faktury</button>
            <button className="button">Moje konto</button>
            <button className="button logout" onClick={handleLogout}>Wyloguj</button>
        </div>
    );
};

export default Header;
