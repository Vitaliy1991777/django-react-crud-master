import React, { useState } from 'react';
import axiosInstance from '../api/axios';

const TaskForm = ({ task, onSave }) => {
    const [title, setTitle] = useState(task ? task.title : '');
    const [description, setDescription] = useState(task ? task.description : '');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (task) {
                // Редактирование существующей задачи
                await axiosInstance.put(`tasks/${task.id}/`, { title, description });
            } else {
                // Создание новой задачи
                await axiosInstance.post('tasks/', { title, description });
            }

            setTitle('');
            setDescription('');
            setError('');
            onSave();
        } catch (err) {
            setError('Не удалось сохранить задачу. Попробуйте позже.');
        }
    };

    // Остальной код компонента остается без изменений
};

export default TaskForm;
