import React, {useEffect, useState} from 'react';
import Header from '../../components/header/Header';
import ServiceCard from '../services/service-card/ServiceCard.js'
import './Services.css';
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../auth/useAuth";

const Services = () => {
    useAuth();
    const [servicesData, setServicesData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');

            try {
                const response = await fetch('http://localhost:8080/services', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setServicesData(data.map(service => ({
                    id: service.id,
                    name: service.name,
                    priceGross: service.priceGross,
                    priceNet: service.priceNet,
                    imageUrl: service.imageUrl,
                    additionalInformation: service.additionalInformation,
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

    const filteredClients = servicesData.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddClient = () => {
        navigate("/services/add-service");
    };

    return (
        <div className="home-services">
            <Header/>
            <div className="search-add-container">
                <input
                    type="text"
                    className="search-box"
                    placeholder="Wyszukaj..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <button className="add-new-service-button" onClick={handleAddClient}>+ Dodaj nową usługę</button>
            </div>
            <div className="service-list">
                {filteredClients.map((service, index) => (
                    <ServiceCard
                        key={index}
                        id={service.id}
                        name={service.name}
                        priceGross={service.priceGross}
                        priceNet={service.priceNet}
                        imageUrl={service.imageUrl}
                        additionalInformation={service.additionalInformation}
                    />
                ))}
            </div>
        </div>
    );
};

export default Services;
