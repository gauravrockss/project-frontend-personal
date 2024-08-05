import React from 'react';
import ReactAuthOutlet from '@auth-kit/react-router/AuthOutlet';
import Navbar from '../components/Navbar';
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
