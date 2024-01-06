import React, {useState} from 'react';
import './AddProduct.css';
import Header from "../../../components/header/Header";
import {useAuth} from "../../../auth/useAuth";
import {useNavigate} from "react-router-dom";

const AddProduct = () => {
    useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        gtin: '',
        name: '',
        priceNet: '',
        imageUrl: '',
        additionalInformation: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleCancelAdding = () => {
        navigate("/products");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const productData = {
            gtin: formData.gtin,
            name: formData.name,
            priceNet: formData.priceNet,
            imageUrl: formData.imageUrl,
            additionalInformation: formData.additionalInformation
        };

        try {
            const response = await fetch('http://localhost:8080/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Product added successfully');
            navigate("/products");
        } catch (error) {
            console.error('Error while adding product:', error);
        }
    };

    return (
        <div className="home-add-product">
            <Header/>
            <div className="add-product-container">
                <text className="product-text">Dodawanie produktu</text>
                <form className="add-product-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="text"
                            id="gtin"
                            placeholder="Kod ean"
                            onChange={handleChange}
                            required
                        />
                    </div>
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
                    <button type="submit">Dodaj produkt</button>
                    <button className="cancel-adding" onClick={handleCancelAdding}>Anuluj</button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
