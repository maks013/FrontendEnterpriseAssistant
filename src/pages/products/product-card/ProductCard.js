import React, {useState, useRef, useEffect} from 'react';
import './ProductCard.css';
import EditProduct from "../edit-product/EditProduct.js";
import ConfirmationModal from "../../../components/confirmation/ConfirmationModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';


const ProductCard = ({id, gtin, name, priceGross, priceNet, imageUrl, additionalInformation}) => {
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

    const saveProductDetails = (updatedClient) => {
        console.log(updatedClient);
        setEditMode(false);
    };

    const openConfirmModal = () => {
        setIsConfirmModalOpen(true)
    };

    const closeConfirmModal = () => setIsConfirmModalOpen(false);

    const handleDeleteProduct = async () => {
        openConfirmModal();
    };

    const confirmDeletion = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.status === 500) {
                alert('Ten produkt ma przypisane zamówienia i nie można go usunąć.')
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
        <div className="product-card">
            <div className="product-image-container">
                {imageUrl ? (
                    <img src={imageUrl} alt={name} className="product-image"/>
                ) : (
                    <div className="product-image-placeholder">
                        <FontAwesomeIcon icon={faQuestionCircle} />
                    </div>
                )}
            </div>
            <div className="product-details">
                <div className="product-name">{name}</div>
                <div className="product-gtin">Kod gtin: {gtin}</div>
                <div className="product-price">Cena Brutto: {parseFloat(priceGross).toFixed(2)} PLN</div>
                <div className="product-price">Cena Netto: {parseFloat(priceNet).toFixed(2)} PLN</div>
                <div className="product-additional-information">{additionalInformation}</div>
            </div>
            <div className="product-options" ref={optionsRef}>
                <div className="product-options-button" onClick={() => setShowOptions(!showOptions)}>⋮</div>
                {showOptions && (
                    <div className="product-options-menu">
                        <div className="product-option" onClick={handleEdit}>Edytuj</div>
                        <div className="product-option" onClick={handleDeleteProduct}>Usuń</div>
                    </div>
                )}
            </div>
            {editMode && (
                <EditProduct
                    product={{id, gtin, name, priceGross, priceNet, imageUrl, additionalInformation}}
                    onSave={saveProductDetails}
                    onClose={handleCloseEdit}
                />
            )}
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                message="Czy na pewno chcesz usunąć ten produkt?"
                onConfirm={confirmDeletion}
                onCancel={closeConfirmModal}
            />
        </div>
    );
};

export default ProductCard;
