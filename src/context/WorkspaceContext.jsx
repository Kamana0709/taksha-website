import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const WorkspaceContext = createContext();

export const useWorkspace = () => useContext(WorkspaceContext);

// Default data removed, fetching from backend instead

export const WorkspaceProvider = ({ children }) => {
  const [data, setData] = useState({ projects: [], tasks: [], interns: [], announcements: [], submissions: [] });
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return; // Don't fetch if not logged in

    const fetchData = async () => {
      try {
        const [projectsRes, tasksRes, internsRes, announcementsRes, submissionsRes] = await Promise.all([
          axios.get(`${API_URL}/projects`),
          axios.get(`${API_URL}/tasks`),
          user.role === 'MENTOR' ? axios.get(`${API_URL}/users/interns`) : Promise.resolve({ data: [] }),
          axios.get(`${API_URL}/announcements`),
          axios.get(`${API_URL}/submissions`)
        ]);

        setData({
          projects: projectsRes.data,
          tasks: tasksRes.data,
          interns: internsRes.data,
          announcements: announcementsRes.data,
          submissions: submissionsRes.data
        });
      } catch (err) {
        console.error("Failed to fetch workspace data", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Poll every 5 seconds for real-time updates across portals
    const intervalId = setInterval(fetchData, 5000);
    
    return () => clearInterval(intervalId);
  }, [user]);

  const createProject = async (projectData) => {
    try {
      const res = await axios.post(`${API_URL}/projects`, projectData);
      setData(prev => ({ ...prev, projects: [res.data, ...prev.projects] }));
      return { success: true, project: res.data };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.response?.data?.error || 'Failed to create project' };
    }
  };

  const createTask = async (task) => {
    try {
      const res = await axios.post(`${API_URL}/tasks`, task);
      setData(prev => ({ 
        ...prev, 
        tasks: [...prev.tasks, res.data],
        projects: prev.projects.map(p => p.id === task.projectId ? { ...p, tasks: [...(p.tasks || []), res.data] } : p)
      }));
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

  const submitTaskWork = async (submissionData) => {
    try {
      const res = await axios.post(`${API_URL}/submissions`, submissionData);
      setData(prev => ({
        ...prev,
        submissions: [res.data, ...prev.submissions],
        tasks: prev.tasks.map(t => t.id === submissionData.taskId ? { ...t, status: 'REVIEW', submissionLink: submissionData.githubUrl } : t)
      }));
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.response?.data?.error || 'Failed to submit work' };
    }
  };

  const reviewSubmission = async (submissionId, reviewData) => {
    try {
      const res = await axios.put(`${API_URL}/submissions/${submissionId}/review`, reviewData);
      const updatedSubmission = res.data;
      const taskStatus = reviewData.status === 'Approved' ? 'DONE' : 'CHANGES_REQUESTED';
      
      setData(prev => ({
        ...prev,
        submissions: prev.submissions.map(s => s.id === submissionId ? updatedSubmission : s),
        tasks: prev.tasks.map(t => t.id === updatedSubmission.taskId ? { ...t, status: taskStatus, feedback: reviewData.mentorFeedback } : t)
      }));
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.response?.data?.error || 'Failed to review submission' };
    }
  };

  if (loading && user) return null; // Loading

  return (
    <WorkspaceContext.Provider value={{ 
      projects: data.projects,
      tasks: data.tasks, 
      interns: data.interns, 
      announcements: data.announcements || [],
      submissions: data.submissions || [],
      createProject,
      createTask, 
      updateTaskStatus,
      updateTaskDetails,
      deleteTask,
      createAnnouncement,
      createIntern,
      submitTaskWork,
      reviewSubmission
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};
