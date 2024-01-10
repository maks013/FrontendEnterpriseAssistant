import React, {useState} from 'react';
import './ClientDetails.scss'
import ConfirmationModal from '../../../components/confirmation/ConfirmationModal';

const ClientDetails = ({client, onClose, onEdit}) => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    if (!client) return null;

    const openConfirmModal = () => {
        setIsConfirmModalOpen(true)
    };
    const closeConfirmModal = () => setIsConfirmModalOpen(false);

    const handleDeleteClientClick = async () => {
        openConfirmModal();
    };

    const confirmDeletion = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/clients/${client.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.status === 500) {
                alert('Ten klient ma przypisane zamówienia i nie można go usunąć.')
            } else {
                throw new Error('Network response was not ok');
            }
            closeConfirmModal();
        } catch (error) {
            console.error('Error deleting client:', error);
            closeConfirmModal();
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{client.companyName}</h2>
                <p>NIP: {client.taxIdNumber}</p>
                <p>Adres: {client.address.street}</p>
                <p>Miasto: {client.address.city}</p>
                <p>Kod pocztowy: {client.address.postalCode}</p>
                <p>Imię i nazwisko przedstawiciela: {client.representative.name} {client.representative.surname}</p>
                <p>Nr telefonu: {client.representative.phoneNumber}</p>
                <p>E-mail: {client.representative.email}</p>
                <button className="edit-button" onClick={onEdit}>Edytuj dane</button>
                <button className="delete-button" onClick={() => handleDeleteClientClick()}>Usuń klienta</button>
                <button className="close-button" onClick={onClose}>Zamknij</button>
            </div>
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                message="Czy na pewno chcesz usunąć tego klienta?"
                onConfirm={confirmDeletion}
                onCancel={closeConfirmModal}
            />
        </div>
    );
};

export default ClientDetails;
