import './OrderCard.scss';
import ConfirmationModal from "../../../components/confirmation/ConfirmationModal";
import React, {useEffect, useRef, useState} from "react";
import EditOrderStatus from "../edit-status/EditOrderStatus";
import {format, differenceInCalendarDays} from 'date-fns';
import OrderDetails from "../order-details/OrderDetails";


const OrderCard = ({id, createdAt, deadline, status, clientName}) => {
    const [showOptions, setShowOptions] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [modalVisible, setModalVisible] = React.useState(false);
    const optionsRef = useRef(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [orderDetails, setOrderDetails] = React.useState(null);

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

    const handleEditStatus = () => {
        setEditMode(true);
    };

    const handleCloseEdit = () => {
        setEditMode(false);
    };

    const closeDetails = () => {
        setModalVisible(false);
    };

    const saveOrderStatus = (updatedOrder) => {
        console.log(updatedOrder);
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
            const response = await fetch(`http://localhost:8080/orders/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.status === 500) {
                alert('Usuwanie zamówienia nie powiodło się.')
            } else {
                throw new Error('Network response was not ok');
            }
            closeConfirmModal();
        } catch (error) {
            console.error('Error deleting order:', error);
            closeConfirmModal();
        }
    };

    const createInvoice = async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:8080/invoices/create/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
        } catch (error) {
            console.error('Error creating invoice:', error);
        }
    };

    const formattedCreatedAt = format(new Date(createdAt), 'dd-MM-yyyy');
    const daysToDeadline = differenceInCalendarDays(new Date(deadline), new Date());

    const statusClasses = {
        PROCESSING: 'processing',
        CANCELED: 'canceled',
        COMPLETED: 'completed'
    };

    const statusTexts = {
        PROCESSING: 'Aktywne',
        CANCELED: 'Anulowane',
        COMPLETED: 'Zakończone'
    };

    const statusClass = statusClasses[status] || 'unknown';
    const statusLabel = statusTexts[status] || status;

    const handleOrderDetailsClick = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/orders/${id}`,{
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const details = await response.json();
            setOrderDetails(details);
            setModalVisible(true);
        } catch (error) {
            console.error('Error fetching client details:', error);
        }
    };

    return (
        <div className="order-card">
            <div className="order-details">
                <div className="order-id">Zamówienie: {id}</div>
                <div className="order-createdAt">Data utworzenia: {formattedCreatedAt}</div>
                <div className="order-daysToDeadline">Czas realizacji, pozostało jeszcze: {daysToDeadline} dni</div>
                <div className={`order-status ${statusClass}`}>{statusLabel}</div>
                <div className="order-clientName">{clientName}</div>
            </div>
            <div className="order-options" ref={optionsRef}>
                <div className="order-options-button" onClick={() => setShowOptions(!showOptions)}>⋮</div>
                {showOptions && (
                    <div className="order-options-menu">
                        <div className="order-option" onClick={handleOrderDetailsClick}>Wyświetl szczegóły</div>
                        <div className="order-option" onClick={handleEditStatus}>Edytuj status</div>
                        <div className="order-option" onClick={createInvoice}>Wygeneruj fakturę</div>
                        <div className="order-option" onClick={handleDeleteService}>Usuń</div>
                    </div>
                )}
            </div>
            {modalVisible && (
                <OrderDetails
                    order={orderDetails}
                    onClose={closeDetails}
                />
            )}
            {editMode && (
                <EditOrderStatus
                    order={{id, status}}
                    onSave={saveOrderStatus}
                    onClose={handleCloseEdit}
                />
            )}
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                message="Czy na pewno chcesz usunąć to zamówienie?"
                onConfirm={confirmDeletion}
                onCancel={closeConfirmModal}
            />
        </div>
    );
};

export default OrderCard;
