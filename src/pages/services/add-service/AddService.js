import React, {useState} from 'react';
import './AddService.scss';
import Header from "../../../components/header/Header";
import {useAuth} from "../../../auth/useAuth";
import {useNavigate} from "react-router-dom";

const AddService = () => {
    useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        priceNet: '',
        imageUrl: '',
        additionalInformation: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleCancelAdding = () => {
        navigate("/services");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const serviceData = {
            name: formData.name,
            priceNet: formData.priceNet,
            imageUrl: formData.imageUrl,
            additionalInformation: formData.additionalInformation
        };

        try {
            const response = await fetch('http://localhost:8080/services', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(serviceData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Service added successfully');
            navigate("/services");
        } catch (error) {
            console.error('Error while adding service:', error);
        }
    };

    return (
        <div className="home-add-service">
            <Header/>
            <div className="add-service-container">
                <text className="service-text">Dodawanie usługi</text>
                <form className="add-service-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input type="text" id="name" placeholder="Nazwa" onChange={handleChange} required/>
                    </div>
                    <div className="input-group">
                        <input
                            type="number"
                            step="0.01"
                            id="priceNet"
                            placeholder="Cena netto"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-group">
                        <input type="text" id="imageUrl" placeholder="Link do zdjęcia" onChange={handleChange}/>
                    </div>
                    <div className="input-group">
                        <input type="text" id="additionalInformation" placeholder="Informacje dodatkowe" onChange={handleChange}/>
                    </div>
                    <button className="add-service-button" type="submit">Dodaj usługę</button>
                    <button className="cancel-adding-service" onClick={handleCancelAdding} >Anuluj</button>
                </form>
            </div>
        </div>
    );
};

export default AddService;
