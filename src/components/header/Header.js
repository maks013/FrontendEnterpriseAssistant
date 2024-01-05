import React from 'react';
import './Header.css';
import {useNavigate} from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();

    const handleClientsClick = () => {
        navigate("/clients");
    };

    const handleHomeClick = () => {
        navigate("/home");
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="header">
            <button className="button" onClick={() => handleHomeClick()}>Strona główna</button>
            <button className="button">Zamówienia</button>
            <button className="button" onClick={() => handleClientsClick()}>Klienci</button>
            <button className="button">Faktury</button>
            <button className="button">Moje konto</button>
            <button className="button logout" onClick={handleLogout}>Wyloguj</button>
        </div>
    );
};

export default Header;
