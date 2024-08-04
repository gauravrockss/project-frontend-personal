import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactAuthOutlet from '@auth-kit/react-router/AuthOutlet';
import Navbar from '../components/Navbar';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import ThemeContextProvider from '../style/theme';
// import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';

const AuthOutlet = () => {
    return (
        <ThemeContextProvider>
            <Navbar>
                <ReactAuthOutlet fallbackPath='/login' />
            </Navbar>
        </ThemeContextProvider>
    );
};

export default AuthOutlet;
