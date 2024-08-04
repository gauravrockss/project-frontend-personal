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
import React, { useState } from 'react';
import Image from '../components/Image';
import { useGoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import useErrorHandler from '../hooks/useErrorHandler';
import { useMessage } from '../providers/Provider';
import axiosInstance from '../utilities/axios';

const Signup = () => {
    const login = useGoogleLogin({
        onSuccess: tokenResponse => console.log(tokenResponse),
    });
    const [signupData, setSignupData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const errorHandler = useErrorHandler();
    const navigate = useNavigate();
    const { showSuccess } = useMessage();

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));

    const handleSignupChange = e => {
        const { name, value } = e.target;
        setSignupData(prevData => ({ ...prevData, [name]: value }));
    };

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosInstance.post('/user/signup/', {
                ...signupData,
            });

            showSuccess('Account created');
            navigate('/login');
        } catch (err) {
            errorHandler(err);
        } finally {
            setLoading(false);
        }
    };

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
                                <Box sx={{ padding: '40px' }}>
                                    <Typography
                                        variant='h4'
                                        sx={{ marginBottom: 3 }}>
                                        Sign up
                                    </Typography>
                                    <Box sx={{ marginBottom: 5 }}>
                                        <Typography color='text.secondary'>
                                            Welcome to Project management
                                            platform
                                        </Typography>
                                        <Typography color='text.secondary'>
                                            Register as a member to register
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
                                            value={signupData.username}
                                            onChange={handleSignupChange}
                                        />
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                my: 2,
                                            }}>
                                            <TextField
                                                name='first_name'
                                                variant='outlined'
                                                margin='dense'
                                                fullWidth
                                                sx={{ mr: 2 }}
                                                size='small'
                                                placeholder='First Name'
                                                value={signupData.first_name}
                                                onChange={handleSignupChange}
                                            />
                                            <TextField
                                                name='last_name'
                                                variant='outlined'
                                                margin='dense'
                                                fullWidth
                                                size='small'
                                                placeholder='Last Name'
                                                value={signupData.last_name}
                                                onChange={handleSignupChange}
                                            />
                                        </Box>
                                        <Typography
                                            color='text.secondary'
                                            sx={{ marginTop: 1.5 }}>
                                            Email
                                        </Typography>
                                        <TextField
                                            name='email'
                                            variant='outlined'
                                            margin='dense'
                                            fullWidth
                                            size='small'
                                            placeholder='Email'
                                            value={signupData.email}
                                            onChange={handleSignupChange}
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
                                            value={signupData.password}
                                            onChange={handleSignupChange}
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
                                                'Create Account'
                                            )}
                                        </Button>
                                    </form>
                                    <Button
                                        onClick={() => login()}
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
                                            Already a member?{' '}
                                            <Link to='/login'>Sign In</Link>
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

export default Signup;
