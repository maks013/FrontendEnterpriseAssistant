import './InvoiceCard.scss';
import ConfirmationModal from "../../../components/confirmation/ConfirmationModal";
import React, {useEffect, useRef, useState} from "react";
import {format} from 'date-fns';


const InvoiceCard = ({id, number, issueDate, orderId}) => {
    const [showOptions, setShowOptions] = useState(false);
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

    const downloadInvoice = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/invoices/download/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.setAttribute('download', `invoice-${id}.pdf`); // lub inna nazwa pliku
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            } else {
                alert('Pobieranie faktury nie powiodło się!');
            }
        } catch (error) {
            console.error('Error downloading invoice:', error);
        }
    };


    const openConfirmModal = () => {
        setIsConfirmModalOpen(true)
    };

    const closeConfirmModal = () => {
        setIsConfirmModalOpen(false)
    };

    const confirmSending = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/invoices/send/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.status === 500) {
                alert('Wysyłanie faktury nie powiodło się!')
            } else {
                throw new Error('Network response was not ok');
            }
            closeConfirmModal();
        } catch (error) {
            console.error('Error deleting order:', error);
            closeConfirmModal();
        }
    };

    const formattedCreatedAt = format(new Date(issueDate), 'dd-MM-yyyy');

    return (
        <div className="invoice-card">
            <div className="invoice-details">
                <div className="invoice-number">Faktura: {number}</div>
                <div className="invoice-issueDate">Data utworzenia: {formattedCreatedAt}</div>
                <div className="invoice-orderId">Zamówienie: {orderId}</div>
            </div>
            <div className="invoice-options" ref={optionsRef}>
                <div className="invoice-options-button" onClick={() => setShowOptions(!showOptions)}>⋮</div>
                {showOptions && (
                    <div className="invoice-options-menu">
                        <div className="invoice-option" onClick={downloadInvoice}>Pobierz</div>
                        <div className="invoice-option" onClick={openConfirmModal}>Prześlij do klienta</div>
                    </div>
                )}
            </div>
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                message="Czy na pewno chcesz przesłać fakturę do klienta?"
                onConfirm={confirmSending}
                onCancel={closeConfirmModal}
            />
        </div>
    );
};

export default InvoiceCard;
