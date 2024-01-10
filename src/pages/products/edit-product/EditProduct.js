import React, {useState} from 'react';
import './EditProduct.scss';

const EditProduct = ({product, onSave, onClose}) => {
    const [formData, setFormData] = useState({...product});

    const dataForUpdate = {
        name: formData.name,
        priceNet: formData.priceNet,
        imageUrl: formData.imageUrl,
        additionalInformation: formData.additionalInformation
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const productId = formData.id;

        console.log(formData)
        try {
            await updateData(`http://localhost:8080/products/${productId}`, dataForUpdate);

            onSave();
            onClose();
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const updateData = async (url, data) => {
        const token = localStorage.getItem('token');
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Edytuj Produkt</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Nazwa produktu:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Cena Netto:
                        <input
                            type="number"
                            step="0.01"
                            name="priceNet"
                            value={formData.priceNet}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Url obrazka:
                        <input
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Dodatkowe informacje:
                        <input
                            name="additionalInformation"
                            value={formData.additionalInformation}
                            onChange={handleChange}
                        />
                    </label>
                    <div className="modal-actions">
                        <button className="save-button" type="submit">Zapisz</button>
                        <button className="cancel-button" type="button" onClick={onClose}>Anuluj</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
