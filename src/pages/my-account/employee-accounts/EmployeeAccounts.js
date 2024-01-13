import React, {useState, useEffect} from 'react';
import Header from "../../../components/header/Header";
import "./EmployeeAccounts.scss";

const EmployeeAccounts = () => {
    const [users, setUsers] = useState([]);


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            setUsers(data);
        } else {
            console.error('Error fetching users');
        }
    };


    const handleActivateUser = async (userId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8080/users/enable/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchData();
        } catch (error) {
            console.error('Error activating user:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8080/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchData();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    if (users.length === 0) {
        return <div>Ładowanie listy użytkowników...</div>;
    }

    return (
        <div>
            <Header/>
            <div className="employee-list">
                {users.map(user => (
                    <div key={user.id} className="employee-card">
                        <p className="details"><strong>Imię i nazwisko: </strong>{user.fullName}</p>
                        <p className="details"><strong>Nazwa użytkownika: </strong>{user.username}</p>
                        <p className="details"><strong>Email: </strong>{user.email}</p>
                        <p className="details"><strong>Aktywny: </strong>{user.enabled ? 'Tak' : 'Nie'}</p>
                        <button className="edit-button" onClick={() => handleActivateUser(user.id)}>Aktywuj</button>
                        <button className="delete-button" onClick={() => handleDeleteUser(user.id)}>Usuń</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmployeeAccounts;
