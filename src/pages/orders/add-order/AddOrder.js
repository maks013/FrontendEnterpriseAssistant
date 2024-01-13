import React, {useEffect, useState} from 'react';
import './AddOrder.scss';
import Header from "../../../components/header/Header";
import {useNavigate} from "react-router-dom";


const AddOrderItemRow = ({ item, index, itemType, onItemChange, onItemDelete, products, services }) => {
    return (
        <div className="form-row" key={`${itemType}-${index}`}>
            <div className="input-group">
                <select
                    value={item[itemType + 'Id']}
                    onChange={(e) => onItemChange(index, { ...item, [itemType + 'Id']: e.target.value })}
                    required
                >
                    <option value="">{itemType === 'product' ? 'Wybierz produkt' : 'Wybierz usługę'}</option>
                    {(itemType === 'product' ? products : services).map((option) => (
                        <option key={option.id} value={option.id}>{option.name}</option>
                    ))}
                </select>
            </div>
            <div className="input-group">
                <input
                    type="number"
                    placeholder="Quantity"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => onItemChange(index, { ...item, quantity: e.target.value })}
                    required
                />
            </div>
            <div className="input-group">
                <button className="cancel-order-button" type="button" onClick={() => onItemDelete(index, itemType)}>Anuluj</button>
            </div>
        </div>
    );
};

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

    const handleAddItem = (itemType) => {
        const newEntry = itemType === 'product'
            ? { productId: '', quantity: 1 }
            : { serviceId: '', quantity: 1 };

        if (itemType === 'product') {
            setSelectedProducts([...selectedProducts, newEntry]);
        } else {
            setSelectedServices([...selectedServices, newEntry]);
        }
    };

    const handleItemChange = (index, updatedItem, itemType) => {
        if (itemType === 'product') {
            const newList = [...selectedProducts];
            newList[index] = updatedItem;
            setSelectedProducts(newList);
        } else {
            const newList = [...selectedServices];
            newList[index] = updatedItem;
            setSelectedServices(newList);
        }
    };

    const handleItemDelete = (index, itemType) => {
        if (itemType === 'product') {
            const newList = [...selectedProducts];
            newList.splice(index, 1);
            setSelectedProducts(newList);
        } else {
            const newList = [...selectedServices];
            newList.splice(index, 1);
            setSelectedServices(newList);
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
            <Header />
            <div className="add-order-container">
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="clientId">Klient:</label>
                        <select
                            id="clientId"
                            value={formData.clientId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Wybierz klienta</option>
                            {clients.map((client) => (
                                <option key={client.id} value={client.id}>{client.companyName}</option>
                            ))}
                        </select>
                    </div>
                    {selectedProducts.map((product, index) => (
                        <AddOrderItemRow
                            key={`product-${product.productId}-${index}`}
                            item={product}
                            index={index}
                            itemType="product"
                            onItemChange={(index, item) => handleItemChange(index, item, 'product')}
                            onItemDelete={(index) => handleItemDelete(index, 'product')}
                            products={products}
                            services={services}
                        />
                    ))}

                    <button className="add-order-button" type="button" onClick={() => handleAddItem('product')}>+ Dodaj produkt</button>

                    {selectedServices.map((service, index) => (
                        <AddOrderItemRow
                            key={`service-${index}`}
                            item={service}
                            index={index}
                            itemType="service"
                            onItemChange={handleItemChange}
                            onItemDelete={handleItemDelete}
                            products={products}
                            services={services}
                        />
                    ))}
                    <button className="add-order-button" type="button" onClick={() => handleAddItem('service')}>+ Dodaj usługę</button>

                    <div className="input-group">
                        <label htmlFor="deadline">Przewidywany termin realizacji:</label>
                        <input
                            type="date"
                            id="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="payment">Metoda płatności:</label>
                        <select
                            id="payment"
                            value={formData.payment}
                            onChange={handleChange}
                            required
                        >
                            <option value="TRANSFER">Przelew</option>
                            <option value="CASH">Gotówka</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label htmlFor="daysToPay">Dni do zapłaty:</label>
                        <select
                            id="daysToPay"
                            value={formData.daysToPay}
                            onChange={handleChange}
                            required
                        >
                            <option value="SEVEN">7 dni</option>
                            <option value="FOURTEEN">14 dni</option>
                            <option value="THIRTY">30 dni</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label htmlFor="additionalInformation">Dodatkowe informacje:</label>
                        <input
                            type="text"
                            id="additionalInformation"
                            value={formData.additionalInformation}
                            onChange={handleChange}
                        />
                    </div>

                    <button className="add-order-button" type="submit">Dodaj zamówienie</button>
                    <button className="cancel-order-button" type="button" onClick={handleCancelAdding}>Anuluj</button>
                </form>
            </div>
        </div>
    );
};

export default AddOrder;
