import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    IconButton,
    Tooltip,
    Typography,
    CircularProgress,
    CssBaseline,
    TextField,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import Image from '../../components/Image';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utilities/axios';
import AddIcon from '@mui/icons-material/Add';
import { useChnagePeojectId } from '../../providers/ProjectProvider';
import { useMessage } from '../../providers/Provider';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const ProjectSelection = () => {
    const user = useAuthUser();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const { showSuccess, showError } = useMessage();
    const [key, setKey] = useState('');
    const navigate = useNavigate();
    const selectProject = useChnagePeojectId();
    const handleProjectSelection = projectId => {
        selectProject(projectId);
        navigate(`/`);
    };

    const fetchProjects = useCallback(
        async function () {
            try {
                const response = await axiosInstance.get(`/api/projects/`);
                setProjects(response.data);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        },
        [setProjects]
    );

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleSubmit = async event => {
        event.preventDefault();
        try {
            const response = await axiosInstance.post('/api/projects/', {
                name,
                key,
                imageURL: 'http://example.com/image.png',
                owner: user.id,
            });
            const { success, errors } = response.data;
            if (!success) return showError(errors);

            showSuccess(success);

            navigate('/list-project');
        } catch (e) {
            showError(e.message);
        }
    };

    return (
        <>
            <CssBaseline />
            {loading ? (
                <CircularProgress />
            ) : projects?.length ? (
                <Box
                    sx={{
                        background:
                            'linear-gradient(to bottom, #F5F5F5, #A9A9A9)',
                        minHeight: '100vh',
                        height: '100%',
                        p: 0,
                        m: 0,
                    }}>
                    <Box sx={{ my: 3, mt: 3, px: 2 }}>
                        <Grid
                            container
                            spacing={4}
                            display='flex'
                            alignItems='center'>
                            <Grid item xs display='flex' alignItems='center'>
                                <Typography variant='h5'>Project</Typography>
                                <Typography
                                    variant='h5'
                                    color='text.secondary'
                                    sx={{ ml: 1 }}>
                                    {' '}
                                    List
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>

                    <Container maxWidth='md' sx={{ pt: 10, px: 2 }}>
                        <Grid
                            container
                            spacing={2}
                            display='flex'
                            alignItems='center'
                            mb={1}>
                            {projects.map((project, i) => (
                                <Grid item lg={4} sm={6} xs={12} key={i}>
                                    <Card
                                        sx={{
                                            pb: 0,
                                            cursor: 'pointer',
                                            // backgroundImage: 'none',
                                            minHeight: '160px',
                                            '&:hover': {
                                                backgroundColor:
                                                    'custom.cardHover',
                                            },
                                        }}
                                        onClick={() =>
                                            handleProjectSelection(project.id)
                                        }>
                                        <Box
                                            sx={{
                                                backgroundImage:
                                                    'linear-gradient(90deg, rgb(237, 228, 100),rgb(252, 152, 51))',
                                                textAlign: 'right',
                                                height: '60px',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                            }}>
                                            <Box sx={{ mt: 4, mx: 2 }}>
                                                <Image
                                                    src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnRQ4bYFmia4f1Se_Ui7AssWRCWI9r3j7RyHXjT0MjiA&s'
                                                    alt='#icon'
                                                    style={{
                                                        height: 50,
                                                        borderRadius: '8px',
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                        <CardContent sx={{ pb: 0 }}>
                                            <Box mt={2}>
                                                <Typography
                                                    color='text.tertiary'
                                                    fontWeight={500}>
                                                    {project.name}
                                                </Typography>
                                            </Box>
                                            <Box
                                                display='flex'
                                                alignItems='center'
                                                justifyContent='space-between'
                                                mt={1}
                                                pb={0}>
                                                <Tooltip
                                                    title={`${
                                                        'Project lead' +
                                                        ':  ' +
                                                        'Gaurav Gupta'
                                                    }`}
                                                    placement='bottom'>
                                                    <Avatar
                                                    // Example Avatar for project lead
                                                    // src='data:image/jpeg;base64,...'
                                                    />
                                                </Tooltip>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        height: '80vh',
                        width: '100%',
                    }}>
                    <Box sx={{ width: '150px' }}>
                        <Image name='noproject.svg' />
                    </Box>
                    <Typography
                        variant='h6'
                        color='text.secondary'
                        fontWeight='bold'
                        sx={{ mt: 1 }}>
                        You currently have no projects
                    </Typography>
                    <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ mt: 1 }}>
                        Let's create your first project in Clikkle Projects
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ maxWidth: '300px', mx: 'auto', mt: 3 }}>
                            <Box>
                                <Typography
                                    variant='caption'
                                    color='text.secondary'>
                                    Name
                                </Typography>
                                <TextField
                                    placeholder='Name'
                                    size='small'
                                    name='name'
                                    fullWidth
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </Box>
                            <Box mt={1}>
                                <Typography
                                    variant='caption'
                                    color='text.secondary'>
                                    Key
                                </Typography>
                                <TextField
                                    placeholder='Key'
                                    name='key'
                                    size='small'
                                    fullWidth
                                    value={key}
                                    onChange={e => setKey(e.target.value)}
                                />
                            </Box>
                        </Box>

                        <Button
                            type='submit'
                            startIcon={<AddIcon fontSize='small' />}
                            variant='contained'
                            size='small'
                            sx={{ mt: 2 }}>
                            Create New Project
                        </Button>
                    </form>
                </Box>
            )}
        </>
    );
};

export default ProjectSelection;

// {
//     /* <button onClick={createProject}>Create New Project</button> */
// }
