import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CssBaseline,
    Grid,
    TextField,
    Typography,
    CircularProgress,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import Image from '../components/Image';
import { useGoogleLogin } from '@react-oauth/google';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import { Link, useNavigate } from 'react-router-dom';
import useErrorHandler from '../hooks/useErrorHandler';
import axios from 'axios';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';

const Login = () => {
    const googleLogin = useGoogleLogin({
        onSuccess: tokenResponse => console.log(tokenResponse),
    });
    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const theme = useTheme();
    const signIn = useSignIn();
    const errorHandler = useErrorHandler();
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));

    const handleLoginChange = e => {
        const { name, value } = e.target;
        setLoginData(prevData => ({ ...prevData, [name]: value }));
    };

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/user/api-token-auth/',
                loginData
            );
            const { userdetails, token } = response.data;
            signIn({
                auth: {
                    token,
                },
                userState: userdetails,
            });

            navigate('/');
        } catch (err) {
            errorHandler(err);
        } finally {
            setLoading(false);
        }
    };

    // const handleLoginSubmit = async e => {
    //     e.preventDefault();
    //     setLoading(true);
    //     setLoading(false);
    // };

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
                            <Grid item xs={12} lg={4}>
                                <Box
                                    sx={{
                                        padding: '40px',
                                    }}>
                                    <Typography
                                        variant='h4'
                                        sx={{ marginBottom: 3 }}>
                                        Login
                                    </Typography>
                                    <Box sx={{ marginBottom: 5 }}>
                                        <Typography color='text.secondary'>
                                            Welcome to Project management
                                            platform
                                        </Typography>
                                        <Typography color='text.secondary'>
                                            Log in to access your account
                                        </Typography>
                                    </Box>
                                    <form onSubmit={onSubmit}>
                                        <Typography color='text.secondary'>
                                            Username
                                        </Typography>
                                        <TextField
                                            name='username'
                                            variant='outlined'
                                            margin='dense'
                                            fullWidth
                                            size='small'
                                            placeholder='Username'
                                            value={loginData.username}
                                            onChange={handleLoginChange}
                                        />
                                        <Typography
                                            color='text.secondary'
                                            sx={{ marginTop: 1.5 }}>
                                            Password
                                        </Typography>
                                        <TextField
                                            name='password'
                                            variant='outlined'
                                            size='small'
                                            margin='dense'
                                            fullWidth
                                            placeholder='Password'
                                            type='password'
                                            value={loginData.password}
                                            onChange={handleLoginChange}
                                        />
                                        <Button
                                            type='submit'
                                            fullWidth
                                            sx={{
                                                mt: 2,
                                                background: '#02459E',
                                            }}
                                            variant='contained'
                                            color='primary'
                                            disabled={loading}>
                                            {loading ? (
                                                <CircularProgress
                                                    size={24}
                                                    sx={{
                                                        color: 'white',
                                                    }}
                                                />
                                            ) : (
                                                'Log In'
                                            )}
                                        </Button>
                                    </form>
                                    <Button
                                        onClick={() => googleLogin()}
                                        fullWidth
                                        sx={{
                                            mt: 2,
                                            // borderRadius: 10,
                                            textTransform: 'capitalize',
                                        }}
                                        variant='outlined'
                                        color='primary'>
                                        <Image
                                            name='google.png'
                                            sx={{ height: 25, px: 1 }}
                                        />
                                        Continue with Google
                                    </Button>
                                    <Box sx={{ mt: 4 }}>
                                        <Typography color='text.secondary'>
                                            New to the platform?{' '}
                                            <Link to='/signup'>Sign Up</Link>
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
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

export default Login;
