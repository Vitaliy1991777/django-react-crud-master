import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import TaskList from './components/TaskList';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const isAuthenticated = !!(token && refreshToken);
    
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/tasks"
                    element={
                        <PrivateRoute>
                            <TaskList />
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/tasks" />} />
            </Routes>
        </Router>
    );
};

export default App;
