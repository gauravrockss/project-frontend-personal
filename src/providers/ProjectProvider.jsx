import React, { createContext, useContext, useEffect, useState } from 'react';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import { useNavigate } from 'react-router-dom';

const ProjectContext = createContext();

const ProjectProvider = ({ children }) => {
    const [projectId, setProjectId] = useState(null);
    const navigate = useNavigate();

    const changeProjectId = id => {
        setProjectId(id);
        localStorage.setItem('selectedProject', id);
    };
    const isAuthenticated = useIsAuthenticated();

    useEffect(() => {
        const projectId = localStorage.getItem('selectedProject');
        setProjectId(projectId);
        if (isAuthenticated && !projectId) {
            navigate('/project-selection');
        }
    }, [isAuthenticated, navigate]);

    return (
        <ProjectContext.Provider value={{ projectId, changeProjectId }}>
            {children}
        </ProjectContext.Provider>
    );
};

export default ProjectProvider;

export const useProjectId = () => useContext(ProjectContext).projectId;
export const useChnagePeojectId = () =>
    useContext(ProjectContext).changeProjectId;
