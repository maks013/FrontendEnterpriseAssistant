import React, {useState} from 'react';
import './AddClient.css';
import Header from "../../../components/header/Header";
import {useAuth} from "../../../auth/useAuth";
import {useNavigate} from "react-router-dom";

const AddClient = () => {
    useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        taxIdNumber: '',
        companyName: '',
        street: '',
        postalCode: '',
        city: '',
        nameOfRepresentative: '',
        surnameOfRepresentative: '',
        phoneNumber: '',
        emailAddress: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const clientData = {
            taxIdNumber: formData.taxIdNumber,
            companyName: formData.companyName,
            address: {
                postalCode: formData.postalCode,
                city: formData.city,
                street: formData.street
            },
            representative: {
                name: formData.nameOfRepresentative,
                surname: formData.surnameOfRepresentative,
                phoneNumber: formData.phoneNumber,
                email: formData.emailAddress
            }
        };

        try {
            const response = await fetch('http://localhost:8080/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(clientData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Client added successfully');
            navigate("/clients");
        } catch (error) {
            console.error('Error while adding client:', error);
        }
    };

    return (
        <div className="home-add-client">
            <Header/>
            <div className="add-client-container">
                <text className="client-text">Dane klienta</text>
                <form className="add-client-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input type="text" id="taxIdNumber" placeholder="NIP" onChange={handleChange} required/>
                    </div>
                    <div className="input-group">
                        <input type="text" id="companyName" placeholder="Nazwa firmy" onChange={handleChange} required/>
                    </div>
                    <div className="input-group">
                        <input type="text" id="street" placeholder="Adres" onChange={handleChange} required/>
                    </div>
                    <div className="input-group">
                        <input type="text" id="postalCode" placeholder="Kod pocztowy" onChange={handleChange} required/>
                    </div>
                    <div className="input-group">
                        <input type="text" id="city" placeholder="Miasto" onChange={handleChange} required/>
                    </div>
                    <div className="input-group">
                        <input type="text" id="nameOfRepresentative" placeholder="Imię przedstawiciela" onChange={handleChange} required/>
                    </div>
                    <div className="input-group">
                        <input type="text" id="surnameOfRepresentative" placeholder="Nazwisko przedstawiciela" onChange={handleChange} required/>
                    </div>
                    <div className="input-group">
                        <input type="text" id="phoneNumber" placeholder="Numer telefonu" onChange={handleChange} required/>
                    </div>
                    <div className="input-group">
                        <input type="text" id="emailAddress" placeholder="Adres e-mail" onChange={handleChange} required/>
                    </div>
                    <button type="submit">Dodaj klienta</button>
                </form>
            </div>
        </div>
    );
};

export default AddClient;
