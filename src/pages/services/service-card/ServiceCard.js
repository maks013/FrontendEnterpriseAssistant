import React, {useState, useRef, useEffect} from 'react';
import './ServiceCard.css';
import EditService from "../edit-service/EditService";
import ConfirmationModal from "../../../components/confirmation/ConfirmationModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';


const ServiceCard = ({id, name, priceGross, priceNet, imageUrl, additionalInformation}) => {
    const [showOptions, setShowOptions] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const optionsRef = useRef(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const handleClickOutside = (event) => {
        if (optionsRef.current && !optionsRef.current.contains(event.target)) {
            setShowOptions(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleCloseEdit = () => {
        setEditMode(false);
    };

    const saveServiceDetails = (updatedClient) => {
        console.log(updatedClient);
        setEditMode(false);
    };

    const openConfirmModal = () => {
        setIsConfirmModalOpen(true)
    };

    const closeConfirmModal = () => setIsConfirmModalOpen(false);

    const handleDeleteService = async () => {
        openConfirmModal();
    };

    const confirmDeletion = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/services/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.status === 500) {
                alert('Ta usługa ma przypisane zamówienia i nie można jej usunąć.')
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
        <div className="service-card">
            <div className="service-image-container">
                {imageUrl ? (
                    <img src={imageUrl} alt={name} className="service-image"/>
                ) : (
                    <div className="service-image-placeholder">
                        <FontAwesomeIcon icon={faQuestionCircle} />
                    </div>
                )}
            </div>
            <div className="service-details">
                <div className="service-name">{name}</div>
                <div className="service-price">Cena Brutto: {parseFloat(priceGross).toFixed(2)} PLN</div>
                <div className="service-price">Cena Netto: {parseFloat(priceNet).toFixed(2)} PLN</div>
                <div className="service-additional-information">{additionalInformation}</div>
            </div>
            <div className="service-options" ref={optionsRef}>
                <div className="service-options-button" onClick={() => setShowOptions(!showOptions)}>⋮</div>
                {showOptions && (
                    <div className="service-options-menu">
                        <div className="service-option" onClick={handleEdit}>Edytuj</div>
                        <div className="service-option" onClick={handleDeleteService}>Usuń</div>
                    </div>
                )}
            </div>
            {editMode && (
                <EditService
                    service={{id, name, priceGross, priceNet, imageUrl, additionalInformation}}
                    onSave={saveServiceDetails}
                    onClose={handleCloseEdit}
                />
            )}
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                message="Czy na pewno chcesz usunąć tę usługę?"
                onConfirm={confirmDeletion}
                onCancel={closeConfirmModal}
            />
        </div>
    );
};

export default ServiceCard;
