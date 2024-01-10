import React from 'react';
import './ClientCard.scss';
import ClientDetails from "../client-details/ClientDetails";
import EditClient from "../edit-client/EditClient.js";

const ClientCard = ({companyName, contactName, email}) => {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [clientDetails, setClientDetails] = React.useState(null);
    const [editModalVisible, setEditModalVisible] = React.useState(false);

    const handleClientDetailsClick = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/clients/byName/${companyName}`,{
                method: 'GET',
                    headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const details = await response.json();
            setClientDetails(details);
            setModalVisible(true);
        } catch (error) {
            console.error('Error fetching client details:', error);
        }
    };

    const closeDetails = () => {
        setModalVisible(false);
    };

    const handleEditClientDetails = () => {
        setEditModalVisible(true);
    };

    const saveClientDetails = (updatedClient) => {
        console.log(updatedClient);
        setEditModalVisible(false);
    };

    return (
        <div>
            <div className="client-card">
                <div className="company-name">{companyName}</div>
                <div className="contact-name">{contactName}</div>
                <div className="email">{email}</div>
                <button className="details-button" onClick={() => handleClientDetailsClick()}>Szczegóły</button>
            </div>
            {modalVisible && (
                <ClientDetails
                    client={clientDetails}
                    onClose={closeDetails}
                    onEdit={handleEditClientDetails}
                />
            )}
            {editModalVisible && (
                <EditClient
                    client={clientDetails}
                    onSave={saveClientDetails}
                    onClose={() => setEditModalVisible(false)}
                />
            )}
        </div>
    );
};

export default ClientCard;
