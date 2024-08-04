import React, { useState } from 'react';
import {
    Box,
    Card,
    CssBaseline,
    Grid,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import Image from '../../components/Image';
import Signup from './Signup';
import Login from './Login';

const AuthContainer = () => {
    const [showLogin, setShowLogin] = useState(false);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));

    const handleShowLogin = () => setShowLogin(true);
    const handleShowSignup = () => setShowLogin(false);
    console.log(showLogin);

    return (
        <>
            <CssBaseline />
            <Box
                sx={{
                    background: 'linear-gradient(to bottom, #F5F5F5, #A9A9A9)',
                    minHeight: '100vh',
                    padding: isSmallScreen ? '40px' : '0',
                }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '100vh',
                    }}>
                    <Card
                        sx={{
                            width: '100%',
                            maxWidth: { lg: '1200px', xs: '500px' },
                            padding: isSmallScreen ? '20px' : '0',
                        }}>
                        <Grid container spacing={2}>
                            {showLogin ? (
                                <Login handleShowSignup={handleShowSignup} />
                            ) : (
                                <Signup handleShowLogin={handleShowLogin} />
                            )}
                            {!isSmallScreen && (
                                <Grid
                                    item
                                    lg={8}
                                    sx={{
                                        padding: 0,
                                        margin: 0,
                                    }}>
                                    <Image
                                        name='singup3.jpg'
                                        sx={{
                                            height: '100%',
                                            width: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </Card>
                </Box>
            </Box>
        </>
    );
};

export default AuthContainer;
