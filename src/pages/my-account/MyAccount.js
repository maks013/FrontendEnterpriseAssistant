import React, { useState, useEffect } from 'react';
import Header from "../../components/header/Header";
import "./MyAccount.scss";
import {useNavigate} from "react-router-dom";

const MyAccount = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();


    const handleViewEmployeeAccounts = () => {
        navigate('/employee-accounts');
    }

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/users/user', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUserData(data);
            } else {
                console.error('Error fetching user data');
            }
        };

        fetchData();
    }, []);


    if (!userData) {
        return <div>Ładowanie danych użytkownika...</div>;
    }

    return (
        <div>
            <Header/>
        <div>
            <h2 className="myacc-name">Dane użytkownika</h2>
            <p className="myacc-text"><strong>Imię i nazwisko: </strong>{userData.fullName}</p>
            <p className="myacc-text"><strong>Nazwa użytkownika: </strong>{userData.username}</p>
            <p className="myacc-text"><strong>Email: </strong>{userData.email}</p>
            {userData.username === 'admin' && (
                <button  className="employees-btn" onClick={handleViewEmployeeAccounts}>Lista pracowników</button>
            )}
        </div>
        </div>
    );
};

export default MyAccount;
