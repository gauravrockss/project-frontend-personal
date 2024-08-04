import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './utilities/axios';

//pages
import Dashboard from './pages/Dashboard';

// import Labels from './pages/ViewProject/Labels';
import CreateProject from './pages/Project/CreateProject';
import ListProject from './pages/Project/ListProject';
import Issues from './pages/Issues';
import Login from './auth/Login';
import Signup from './auth/Signup';
import Provider from './providers/Provider';
import AuthOutlet from './providers/AuthOutlet';
import ProjectSelection from './pages/Project/ProjectSelection';

const App = () => {
    return (
        <Provider>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route
                    path='/project-selection'
                    element={<ProjectSelection />}
                />

                <Route path='/' element={<AuthOutlet />}>
                    <Route index element={<Dashboard />} />
                    <Route path='/list-project' element={<ListProject />} />
                    <Route path='/create_project' element={<CreateProject />} />
                    <Route path='/view-project' element={<Issues />} />
                </Route>
            </Routes>
        </Provider>
    );
};

export default App;
