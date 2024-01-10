import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import './Login.scss';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = {
            username: username,
            password: password
        };

        try {
            const response = await axios.post("http://localhost:8080/auth/login", data);
            if (response.status === 200) {
                const result = response.data;
                localStorage.setItem('token', result.token);
                console.log('Login successful', result);
                navigate('/home');
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            console.error('There was an error!', error);
        }
    };

    return (
        <div className="login-container">
            <h1>Logowanie</h1>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        type="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
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
                <button className="login-button" type="submit">Zaloguj się</button>
            </form>
            <p className="register-link">
                Nie masz konta? <a href="/register">Zarejestruj się.</a>
            </p>
        </div>
    );
};

export default Login;
