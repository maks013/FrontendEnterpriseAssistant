import React, {useState} from "react";

const EditOrderStatus = ({order, onSave, onClose}) => {
    const [status, setStatus] = useState('PROCESSING');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        const url = `http://localhost:8080/orders/status/${order.id}`;
        const data = {status};

        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            onSave();
            console.log("Status updated successfully");
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <form onSubmit={handleSubmit}>
                    <h2>Edytuj Status Zamówienia</h2>
                    <label htmlFor="status">Status Zamówienia:</label>
                    <div className="status-select-wrapper">
                        <select className="status-select" id="status" value={status}
                                onChange={e => setStatus(e.target.value)}>
                            <option value="PROCESSING">Aktywne</option>
                            <option value="CANCELED">Anulowane</option>
                            <option value="COMPLETED">Zakończone</option>
                        </select>
                    </div>
                    <button className="save-button" type="submit">Zapisz</button>
                    <button className="cancel-button" onClick={onClose}>Anuluj</button>
                </form>
            </div>
        </div>
    );
};

export default EditOrderStatus;
