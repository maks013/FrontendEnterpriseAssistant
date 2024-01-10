import React, {useEffect, useState} from 'react';
import Header from '../../components/header/Header';
import ProductCard from '../products/product-card/ProductCard.js'
import './Products.scss';
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../auth/useAuth";

const Services = () => {
    useAuth();
    const [productsData, setProductsData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');

            try {
                const response = await fetch('http://localhost:8080/products', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setProductsData(data.map(product => ({
                    id: product.id,
                    gtin: product.gtin,
                    name: product.name,
                    priceGross: product.priceGross,
                    priceNet: product.priceNet,
                    imageUrl: product.imageUrl,
                    additionalInformation: product.additionalInformation,
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

    const filteredClients = productsData.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddClient = () => {
        navigate("/products/add-product");
    };

    return (
        <div className="home-products">
            <Header/>
            <div className="search-add-container">
                <input
                    type="text"
                    className="search-box"
                    placeholder="Wyszukaj..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <button className="add-new-product-button" onClick={handleAddClient}>+ Dodaj nowy produkt</button>
            </div>
            <div className="service-list">
                {filteredClients.map((product, index) => (
                    <ProductCard
                        key={index}
                        id={product.id}
                        name={product.name}
                        gtin={product.gtin}
                        priceGross={product.priceGross}
                        priceNet={product.priceNet}
                        imageUrl={product.imageUrl}
                        additionalInformation={product.additionalInformation}
                    />
                ))}
            </div>
        </div>
    );
};

export default Services;
