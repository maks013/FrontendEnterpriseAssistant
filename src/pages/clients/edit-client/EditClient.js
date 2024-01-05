import React from 'react';
import './EditClient.css';

const EditClient = ({client, onSave, onClose}) => {
    const [formData, setFormData] = React.useState({
        ...client,
        representative: {...client.representative},
        address: {...client.address}
    });

    const [editedFields, setEditedFields] = React.useState({
        representative: false,
        address: false,
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        const nameParts = name.split('.');

        setFormData(prevData => {
            if (nameParts.length === 2) {
                const [mainKey, subKey] = nameParts;
                return {
                    ...prevData,
                    [mainKey]: {
                        ...prevData[mainKey],
                        [subKey]: value
                    }
                };
            }
            return {
                ...prevData,
                [name]: value
            };
        });

        setEditedFields({...editedFields, [nameParts[0]]: true});
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const clientId = formData.id;

        try {
            if (editedFields.address) {
                console.log('Sending client info:', formData.address)
                await updateData(`http://localhost:8080/clients/address/${clientId}`, formData.address);
            }
            if (editedFields.representative) {
                await updateData(`http://localhost:8080/clients/representative/${clientId}`, formData.representative);
            }

            onSave();
        } catch (error) {
            console.error('Error updating client:', error);
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

    if (!client) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <form onSubmit={handleSubmit}>
                    <h2>Edytuj Dane Klienta</h2>
                    <label>
                        Nazwa firmy: {formData.companyName}
                    </label>
                    <label>
                        NIP: {formData.taxIdNumber}
                    </label>
                    <label>
                        Adres:
                        <input
                            type="text"
                            name="address.street"
                            value={formData.address.street}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Miasto:
                        <input
                            type="text"
                            name="address.city"
                            value={formData.address.city}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Kod pocztowy:
                        <input
                            type="text"
                            name="address.postalCode"
                            value={formData.address.postalCode}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Imię przedstawiciela:
                        <input
                            type="text"
                            name="representative.name"
                            value={formData.representative.name}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Nazwisko przedstawiciela:
                        <input
                            type="text"
                            name="representative.surname"
                            value={formData.representative.surname}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Nr telefonu:
                        <input
                            type="text"
                            name="representative.phoneNumber"
                            value={formData.representative.phoneNumber}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        E-mail:
                        <input
                            type="text"
                            name="representative.email"
                            value={formData.representative.email}
                            onChange={handleChange}
                        />
                    </label>
                    <button className="save-button" type="submit">Zapisz</button>
                    <button className="cancel-button" type="button" onClick={onClose}>Anuluj</button>
                </form>
            </div>
        </div>
    );
};

export default EditClient;
