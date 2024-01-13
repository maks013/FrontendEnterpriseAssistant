import React, {useEffect, useState} from 'react';
import Header from '../../components/header/Header';
import OrderCard from './order-card/OrderCard';
import './Orders.scss';
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../auth/useAuth";

const Orders = () => {
    useAuth();
    const [ordersData, setOrdersData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchStatus, setSearchStatus] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const ordersResponse = await fetch('http://localhost:8080/orders', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!ordersResponse.ok) {
                    throw new Error('Network response was not ok');
                }

                let orders = await ordersResponse.json();

                const clientPromises = orders.map(order =>
                    fetch(`http://localhost:8080/clients/${order.clientId}`, {
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                        .then(response => {
                            if (!response.ok) throw new Error('Network response was not ok');
                            return response.json();
                        })
                        .then(clientData => ({ ...order, clientName: clientData.companyName }))
                        .catch(error => {
                            console.error('There was a problem with the fetch operation:', error);
                            return { ...order, clientName: 'Unknown' };
                        })
                );

                Promise.all(clientPromises)
                    .then(ordersWithClientNames => setOrdersData(ordersWithClientNames));

            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [navigate]);

    const filteredOrders = ordersData.filter(order => {
        const matchClientName = order.clientName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = searchStatus ? order.status === searchStatus : true;
        return matchClientName && matchStatus;
    });

    const handleStatusFilter = (status) => {
        setSearchStatus(status);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleAddOrder = () => {
        navigate("/orders/add-order");
    };

    return (
        <div className="home-orders">
            <Header/>
            <div className="search-add-container">
                <button className="status-button"
                        onClick={() => handleStatusFilter('')}>
                    Wszystkie
                </button>
                <button className="status-button status-button-processing"
                        onClick={() => handleStatusFilter('PROCESSING')}>
                    Aktywne
                </button>
                <button className="status-button status-button-completed"
                        onClick={() => handleStatusFilter('COMPLETED')}>
                    Zakończone
                </button>
                <button className="status-button status-button-canceled"
                        onClick={() => handleStatusFilter('CANCELED')}>
                    Anulowane
                </button>
                <input
                    type="text"
                    className="search-box"
                    placeholder="Wyszukaj klienta..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <button className="add-new-order-button" onClick={handleAddOrder}>+ Dodaj nowe zamówienie</button>
            </div>
            <div className="order-list">
                {filteredOrders.map((order, index) => (
                    <OrderCard
                        key={index}
                        id={order.id}
                        createdAt={order.createdAt}
                        deadline={order.deadline}
                        status={order.status}
                        clientName={order.clientName}
                    />
                ))}
            </div>
        </div>
    );
};

export default Orders;
