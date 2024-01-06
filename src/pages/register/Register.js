import React, {useState} from 'react';
import './Register.css';
import {useNavigate} from "react-router-dom";
import axios from "axios";

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setfullName] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = {
            username: username,
            password: password,
            fullName: fullName,
            email: email
        };

        try {
            const response = await axios.post("http://localhost:8080/auth/register", data);
            if (response.status === 201) {
                const result = response.data;
                console.log('Registration successful', result);
                navigate('/login');
            } else {
                throw new Error('Registration failed');
            }
        } catch (error) {
            console.error('There was an error!', error);
        }
    };

    return (
        <div className="register-container">
            <h1>Rejestracja</h1>
            <form className="register-form" onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setfullName(e.target.value)}
                        placeholder="Imię i nazwisko"
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-mail"
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Nazwa użytkownika"
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Hasło"
                        required
                    />
                </div>
                <button className="register-button"  type="submit">Załóż konto</button>
            </form>
            <p className="login-link">
                Mam już konto. <a href="/login">Zaloguj się.</a>
            </p>
        </div>
    );
};

export default Register;
