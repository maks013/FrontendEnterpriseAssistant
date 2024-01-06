import React, {useEffect, useState} from 'react';
import ClientCard from './client-card/ClientCard';
import Header from '../../components/header/Header';
import './Clients.css';
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../auth/useAuth";

const Clients = () => {
    useAuth();
    const [clientsData, setClientsData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');

            try {
                const response = await fetch('http://localhost:8080/clients', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setClientsData(data.map(client => ({
                    companyName: client.companyName,
                    contactName: `${client.representative.name} ${client.representative.surname}`,
                    email: client.representative.email,
                })));
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };

        fetchData();

        const interval = setInterval(fetchData, 8000);
        return () => clearInterval(interval);
    }, [navigate]);


    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredClients = clientsData.filter(client =>
        client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddClient = () => {
        navigate("/clients/add-client");
    };

    return (
        <div className="clients-page">
        <Header/>
        <div className="home-clients">
            <div className="search-add-container">
                <input
                    type="text"
                    className="search-box"
                    placeholder="Wyszukaj..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <button className="add-new-client-button" onClick={handleAddClient}>+ Dodaj nowego klienta</button>
            </div>
            <div className="client-list">
                {filteredClients.map((client, index) => (
                    <ClientCard
                        key={index}
                        companyName={client.companyName}
                        contactName={client.contactName}
                        email={client.email}
                    />
                ))}
            </div>
        </div>
        </div>
    );
};

export default Clients;
