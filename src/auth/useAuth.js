import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

export const useAuth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const isLoginOrRegister = window.location.pathname.match(/\/login|\/register/);

            if (!token && !isLoginOrRegister) {
                navigate('/login');
            }
        };

        checkAuth();
        const interval = setInterval(checkAuth, 1000);

        return () => clearInterval(interval);
    }, [navigate]);
};
