import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    return (
        <div className="logout-container">
            <button onClick={handleLogout} className="btn-edit">
                Выйти
            </button>
        </div>
    );
};

export default Logout;
