import React, {useEffect, useState} from 'react';
import './OrderDetails.scss'
import {format, differenceInCalendarDays} from 'date-fns';

const OrderDetails = ({order, onClose}) => {
    const [productsDetails, setProductsDetails] = useState([]);
    const [servicesDetails, setServicesDetails] = useState([]);

    useEffect(() => {
        const fetchProductDetails = async (productName) => {
            try {
                const response = await fetch(`http://localhost:8080/products/name/${productName}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`Network response was not ok (status: ${response.status})`);
                }
                return response.json();
            } catch (error) {
                console.error('Error fetching product details:', error);
                return null;
            }
        };

        const fetchServiceDetails = async (serviceName) => {
            try {
                const response = await fetch(`http://localhost:8080/services/name/${serviceName}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`Network response was not ok (status: ${response.status})`);
                }
                return response.json();
            } catch (error) {
                console.error('Error fetching service details:', error);
                return null;
            }
        };

        Promise.all(order.productOrderItems.map(item => fetchProductDetails(item.name)))
            .then(details => setProductsDetails(details.filter(detail => detail !== null)));

        Promise.all(order.serviceOrderItems.map(item => fetchServiceDetails(item.name)))
            .then(details => setServicesDetails(details.filter(detail => detail !== null)));

    }, [order.productOrderItems, order.serviceOrderItems]);

    if (!order) return null;

    const statusClasses = {
        PROCESSING: 'processing',
        CANCELED: 'canceled',
        COMPLETED: 'completed'
    };

    const statusTexts = {
        PROCESSING: 'Aktywne',
        CANCELED: 'Anulowane',
        COMPLETED: 'Zakończone'
    };

    const paymentMapping = {
        TRANSFER: 'Przelew',
        CASH: 'Gotówka'
    };

    const daysToPayMapping = {
        SEVEN: '7 dni',
        FOURTEEN: '14 dni',
        THIRTY: '30 dni'
    };

    const statusClass = statusClasses[order.status] || 'unknown';
    const statusLabel = statusTexts[order.status] || order.status;

    const formattedCreatedAt = format(new Date(order.createdAt), 'dd-MM-yyyy');
    const deadline = format(new Date(order.deadline), 'dd-MM-yyyy');
    const daysToDeadline = differenceInCalendarDays(new Date(order.deadline), new Date());
    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Zamówienie: {order.id}</h2>
                <p>Data utworzenia: {formattedCreatedAt}</p>
                <p>Termin realizacji: {deadline} (pozostało {daysToDeadline} dni)</p>
                <p>Metoda płatności: {paymentMapping[order.payment]}</p>
                <p>Dni do zapłaty: {daysToPayMapping[order.daysToPay]}</p>
                <text>Status: </text>
                <text className={`order-status-details ${statusClass}`}>{statusLabel}</text>
                <p>Dodatkowe informacje: {order.additionalInformation}</p>

                <h3>Produkty:</h3>
                <ul>
                    {order.productOrderItems.map((item) => {
                        const productDetails = productsDetails.find((product) => product.id === item.productId) || {};
                        return (
                            <li key={item.id} className="product-order-details">
                                <img src={productDetails.imageUrl} alt={item.name} className="order-details-image"/>
                                <div className="details-order-text">
                                    <h4 className="item-name">{item.name}</h4>
                                    <p>GTIN: {productDetails.gtin}</p>
                                    <p>Cena jedn. netto: {item.unitPriceNet} zł</p>
                                    <p>Cena jedn. brutto: {item.unitPriceGross} zł</p>
                                    <p>Ilość: {item.quantity} szt.</p>
                                    <p>Informacje dodatkowe: {productDetails.additionalInformation}</p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                <h3>Usługi:</h3>
                <ul>
                    {order.serviceOrderItems.map((item) => {
                        const serviceDetails = servicesDetails.find((service) => service.id === item.serviceId) || {};
                        return (
                            <li key={item.id} className="service-order-details">
                                <img src={serviceDetails.imageUrl} alt={item.name} className="order-details-image"/>
                                <div className="details-order-text">
                                    <h4 className="item-name">{item.name}</h4>
                                    <p>Cena jedn. netto: {item.unitPriceNet} zł</p>
                                    <p>Cena jedn. brutto: {item.unitPriceGross} zł</p>
                                    <p>Ilość: {item.quantity}</p>
                                    <p>Informacje dodatkowe: {serviceDetails.additionalInformation}</p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                <button className="close-button" onClick={onClose}>Zamknij</button>
            </div>
        </div>
    );
};

export default OrderDetails;
