import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import Logout from './Logout';
import '../App.css';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '' });
// eslint-disable-next-line
    const [error, setError] = useState('');


    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axiosInstance.get('tasks/');
            setTasks(response.data);
        } catch (err) {
            setError('Ошибка при загрузке задач. Попробуйте позже.');
        }
    };

    const handleDelete = async (taskId) => {
        try {
            await axiosInstance.delete(`tasks/${taskId}/`);
            setTasks(tasks.filter((task) => task.id !== taskId));
        } catch (error) {
            console.error('Ошибка при удалении задачи:', error);
        }
    };

    const handleEdit = (task) => {
        setSelectedTask(task);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setIsEditing(false);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setSelectedTask(null);
        setShowModal(false);
        setNewTask({ title: '', description: '' });
    };

    const handleSave = async () => {
        try {
            if (isEditing && selectedTask) {
                const response = await axiosInstance.put(`tasks/${selectedTask.id}/`, selectedTask);
                setTasks(tasks.map((task) =>
                    task.id === selectedTask.id ? response.data : task
                ));
            } else {
                const response = await axiosInstance.post('tasks/', newTask);
                setTasks([...tasks, response.data]);
            }
            handleModalClose();
        } catch (error) {
            console.error('Ошибка при сохранении задачи:', error);
        }
    };

    const handleNewTask = () => {
        setNewTask({ title: '', description: '' });
        setSelectedTask(null);
        setIsEditing(false);
        setShowModal(true);
    };

    return (
        <div className="task-list">
            <h2 className="text-center">Список задач</h2>
            <div className="tasks-container">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className="task-item"
                        onClick={() => handleTaskClick(task)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="task-content">
                            <h4>{task.title}</h4>
                            <p>{task.description}</p>
                        </div>
                        <div className="task-actions">
                            <button
                                className="btn-edit"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(task);
                                }}
                            >
                                Изменить
                            </button>
                            <button
                                className="btn-delete"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(task.id);
                                }}
                            >
                                Удалить
                            </button>
                        </div>
                    </div>
                ))}
                <button className="btn-add" onClick={handleNewTask}>
                    + Новая задача
                </button>
            </div>

            <div className="logout-container">
                <Logout /> {/* Кнопка "Выйти" */}
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>{isEditing ? 'Изменение задачи' : selectedTask ? 'Просмотр задачи' : 'Новая задача'}</h3>
                        {isEditing ? (
                            <>
                                <input
                                    type="text"
                                    placeholder="Название"
                                    value={selectedTask?.title || ''}
                                    onChange={(e) =>
                                        setSelectedTask({
                                            ...selectedTask,
                                            title: e.target.value,
                                        })
                                    }
                                />
                                <textarea
                                    placeholder="Описание"
                                    value={selectedTask?.description || ''}
                                    onChange={(e) =>
                                        setSelectedTask({
                                            ...selectedTask,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </>
                        ) : selectedTask ? (
                            <>
                                <p>{selectedTask.title}</p>
                                <p>{selectedTask.description}</p>
                            </>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    placeholder="Название"
                                    value={newTask.title}
                                    onChange={(e) =>
                                        setNewTask({
                                            ...newTask,
                                            title: e.target.value,
                                        })
                                    }
                                />
                                <textarea
                                    placeholder="Описание"
                                    value={newTask.description}
                                    onChange={(e) =>
                                        setNewTask({
                                            ...newTask,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </>
                        )}

                        {isEditing || !selectedTask ? (
                            <button onClick={handleSave} className="btn-save">
                                {isEditing ? 'Сохранить' : 'Добавить'}
                            </button>
                        ) : null}

                        <button className="btn-close" onClick={handleModalClose}>
                            Закрыть
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskList;

