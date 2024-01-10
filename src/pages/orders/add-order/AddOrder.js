import React, {useEffect, useState} from 'react';
import './AddOrder.scss';
import Header from "../../../components/header/Header";
import {useNavigate} from "react-router-dom";

const AddOrder = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [tempProductId, setTempProductId] = useState('');
    const [tempProductQuantity, setTempProductQuantity] = useState(0);
    const [tempServiceId, setTempServiceId] = useState('');
    const [tempServiceQuantity, setTempServiceQuantity] = useState(0);
    const [formData, setFormData] = useState({
        clientId: '',
        deadline: '',
        payment: 'TRANSFER',
        daysToPay: 'SEVEN',
        additionalInformation: ''
    });

    const loadData = async (url, setter) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8080/${url}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setter(data);
        } catch (error) {
            console.error('Error while loading data:', error);
        }
    };

    useEffect(() => {
        loadData('clients', setClients);
        loadData('products', setProducts);
        loadData('services', setServices);
    }, []);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value});
    };

    const handleCancelAdding = () => {
        navigate("/orders");
    };

    const handleItemChange = (itemType, itemId, itemQuantity) => {
        const parsedId = parseInt(itemId);
        const parsedQuantity = parseInt(itemQuantity);

        if (isNaN(parsedId) || isNaN(parsedQuantity)) {
            console.error("Invalid product or service ID or quantity:", itemId, itemQuantity);
            return;
        }

        const isProduct = itemType === 'product';
        const updatedItems = isProduct ? [...selectedProducts] : [...selectedServices];

        const index = updatedItems.findIndex(item => item[isProduct ? 'productId' : 'serviceId'] === parsedId);
        if (index >= 0) {
            if (parsedQuantity > 0) {
                updatedItems[index].quantity = parsedQuantity;
            } else {
                updatedItems.splice(index, 1);
            }
        } else if (parsedQuantity > 0) {
            updatedItems.push({[isProduct ? 'productId' : 'serviceId']: parsedId, quantity: parsedQuantity});
        }

        console.log("Updated items:", updatedItems);
        if (isProduct) {
            setSelectedProducts([...updatedItems]);
        } else {
            setSelectedServices([...updatedItems]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedProducts.length === 0 && selectedServices.length === 0) {
            alert("Please add at least one product or service.");
            return;
        }

        const token = localStorage.getItem('token');

        const deadlineWithTime = formData.deadline.includes('T')
            ? formData.deadline
            : `${formData.deadline}T12:00:00`;

        const formattedProductItems = selectedProducts.map(item => ({
            productId: item.productId,
            quantity: item.quantity
        }));

        const formattedServiceItems = selectedServices.map(item => ({
            serviceId: item.serviceId,
            quantity: item.quantity
        }));

        const orderData = {
            clientId: parseInt(formData.clientId),
            productOrderItems: formattedProductItems,
            serviceOrderItems: formattedServiceItems,
            deadline: deadlineWithTime,
            payment: formData.payment,
            daysToPay: formData.daysToPay,
            additionalInformation: formData.additionalInformation
        };
        console.log(orderData);
        try {
            const response = await fetch('http://localhost:8080/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Order added successfully');
            navigate("/orders");
        } catch (error) {
            console.error('Error while adding order:', error);
        }
    };


    return (
        <div className="home-add-order">
            <Header/>
            <div className="add-order-container">
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="clientId">Klient:</label>
                        <select className="order-select" id="clientId" value={formData.clientId} onChange={handleChange} required>
                            <option value="">Wybierz klienta</option>
                            {clients.map((client) => (
                                <option key={client.id} value={client.id}>{client.companyName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-row">
                        <div className="input-group">
                            <label htmlFor="product">Produkt:</label>
                            <select id="product" value={tempProductId} onChange={(e) => setTempProductId(e.target.value)}>
                                <option value="">Wybierz produkt</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>{product.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group">
                            <div className="input-with-button">
                                <input type="number" placeholder="Ilość" min="1" value={tempProductQuantity}
                                       onChange={(e) => setTempProductQuantity(e.target.value)} required />
                                <button className="add-item-button" type="button"
                                        onClick={() => handleItemChange('product', tempProductId, tempProductQuantity)}>Dodaj produkt
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="input-group">
                            <label htmlFor="service">Usługa:</label>
                            <select id="service" value={tempServiceId} onChange={(e) => setTempServiceId(e.target.value)}>
                                <option value="">Wybierz usługę</option>
                                {services.map((service) => (
                                    <option key={service.id} value={service.id}>{service.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group">
                            <div className="input-with-button">
                                <input type="number" placeholder="Ilość" min="1" value={tempServiceQuantity}
                                       onChange={(e) => setTempServiceQuantity(e.target.value)} required />
                                <button className="add-item-button" type="button"
                                        onClick={() => handleItemChange('service', tempServiceId, tempServiceQuantity)}>Dodaj usługę
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="input-group">
                        <label htmlFor="deadline">Przewidywany termin realizacji:</label>
                        <input type="date" id="deadline" value={formData.deadline} onChange={handleChange} required/>
                    </div>
                    <div className="input-group">
                        <label htmlFor="payment">Sposób zapłaty:</label>
                        <select id="payment" value={formData.payment} onChange={handleChange} required>
                            <option value="TRANSFER">Przelew</option>
                            <option value="CASH">Gotówka</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label htmlFor="daysToPay">Termin zapłaty:</label>
                        <select id="daysToPay" value={formData.daysToPay} onChange={handleChange} required>
                            <option value="SEVEN">7 dni</option>
                            <option value="FOURTEEN">14 dni</option>
                            <option value="THIRTY">30 dni</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label htmlFor="additionalInformation">Dodatkowe informacje:</label>
                        <input type="text" id="additionalInformation" value={formData.additionalInformation}
                               onChange={handleChange}/>
                    </div>
                    <button className="add-order-button" type="submit">Dodaj zamówienie</button>
                    <button className="cancel-order-button" type="button" onClick={handleCancelAdding}>Anuluj</button>
                </form>
            </div>
        </div>
    );
};

export default AddOrder;
