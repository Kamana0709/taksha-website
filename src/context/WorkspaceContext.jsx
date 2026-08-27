import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const WorkspaceContext = createContext();

export const useWorkspace = () => useContext(WorkspaceContext);

// Default data removed, fetching from backend instead

export const WorkspaceProvider = ({ children }) => {
  const [data, setData] = useState({ tasks: [], interns: [], announcements: [] });
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return; // Don't fetch if not logged in

    const fetchData = async () => {
      try {
        const [tasksRes, internsRes, announcementsRes] = await Promise.all([
          axios.get(`${API_URL}/tasks`),
          user.role === 'MENTOR' ? axios.get(`${API_URL}/users/interns`) : Promise.resolve({ data: [] }),
          axios.get(`${API_URL}/announcements`)
        ]);

        setData({
          tasks: tasksRes.data,
          interns: internsRes.data,
          announcements: announcementsRes.data
        });
      } catch (err) {
        console.error("Failed to fetch workspace data", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  const createTask = async (task) => {
    try {
      const res = await axios.post(`${API_URL}/tasks`, task);
      setData(prev => ({ ...prev, tasks: [...prev.tasks, res.data] }));
    } catch (err) {
      console.error(err);
    }
  };

  const updateTaskStatus = async (taskId, newStatus, extraProps = {}) => {
    try {
      const res = await axios.put(`${API_URL}/tasks/${taskId}/status`, { status: newStatus, ...extraProps });
      setData(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => t.id === taskId ? res.data : t)
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const updateTaskDetails = async (taskId, updatedData) => {
    try {
      const res = await axios.put(`${API_URL}/tasks/${taskId}`, updatedData);
      setData(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => t.id === taskId ? res.data : t)
      }));
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.response?.data?.error || 'Failed to update task' };
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`);
      setData(prev => ({
        ...prev,
        tasks: prev.tasks.filter(t => t.id !== taskId)
      }));
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.response?.data?.error || 'Failed to delete task' };
    }
  };

  const createIntern = async (internData) => {
    try {
      const res = await axios.post(`${API_URL}/users/interns`, internData);
      setData(prev => ({ ...prev, interns: [...prev.interns, res.data] }));
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.response?.data?.error || 'Failed to create intern' };
    }
  };

  const createAnnouncement = async (announcement) => {
    try {
      const res = await axios.post(`${API_URL}/announcements`, announcement);
      setData(prev => ({ ...prev, announcements: [res.data, ...prev.announcements] }));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && user) return null; // Loading

  return (
    <WorkspaceContext.Provider value={{ 
      tasks: data.tasks, 
      interns: data.interns, 
      announcements: data.announcements || [],
      createTask, 
      updateTaskStatus,
      updateTaskDetails,
      deleteTask,
      createAnnouncement,
      createIntern
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};
