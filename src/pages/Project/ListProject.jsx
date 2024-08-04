import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Tooltip,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import Image from '../../components/Image';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../utilities/axios';
import AddIcon from '@mui/icons-material/Add';
import { useMessage } from '../../providers/Provider';

const ListProject = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [projects, setProjects] = useState([]);
    const { showSuccess, showError } = useMessage();
    const [anchorElSettings, setAnchorElSettings] = React.useState(null);
    const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] =
        useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [loading, setLoading] = useState(true);

    // Extract projectId from URL
    const query = new URLSearchParams(location.search);
    const projectId = query.get('projectId');

    // Fetch projects from the API
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

    const openSettingsMenu = (event, id) => {
        setAnchorElSettings(event.currentTarget);
        setSelectedProject(id);
    };

    const closeSettingsMenu = () => {
        setAnchorElSettings(null);
        setSelectedProject(null);
    };

    const handleDeleteClick = () => {
        setOpenConfirmDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axiosInstance.delete(`/api/projects/${selectedProject}/`);
            setProjects(
                projects.filter(project => project.id !== selectedProject)
            );

            showSuccess('Project deleted successfully');
        } catch (e) {
            console.error('Error deleting project:', e);
        } finally {
            setOpenConfirmDeleteDialog(false);
            setAnchorElSettings(null);
        }
    };

    const handleDeleteClose = () => {
        setOpenConfirmDeleteDialog(false);
    };

    return (
        <>
            {loading ? (
                <CircularProgress />
            ) : projects?.length ? (
                <Box>
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
                                        elevation={0}
                                        sx={{
                                            pb: 0,
                                            cursor: 'pointer',
                                            backgroundImage: 'none',
                                            minHeight: '160px',
                                            backgroundColor:
                                                project.id === Number(projectId)
                                                    ? 'custom.selectedCard'
                                                    : '',
                                            '&:hover': {
                                                backgroundColor:
                                                    'custom.cardHover',
                                            },
                                        }}
                                        onClick={() =>
                                            navigate(`/view-project`)
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
                                            <IconButton
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    openSettingsMenu(
                                                        e,
                                                        project.id
                                                    );
                                                }}
                                                sx={{
                                                    background: 'none',
                                                    '&:hover': {
                                                        background: 'none',
                                                    },
                                                }}>
                                                <MoreVertIcon size='small' />
                                            </IconButton>
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
                                    <Menu
                                        anchorOrigin={{
                                            vertical: 'right',
                                            horizontal: 'right',
                                        }}
                                        transformOrigin={{
                                            vertical: 'right',
                                            horizontal: 'right',
                                        }}
                                        anchorEl={anchorElSettings}
                                        open={Boolean(anchorElSettings)}
                                        onClose={closeSettingsMenu}
                                        onClick={e => e.stopPropagation()}>
                                        <MenuItem
                                            onClick={e => {
                                                e.stopPropagation();
                                                handleDeleteClick();
                                            }}>
                                            Delete
                                        </MenuItem>
                                    </Menu>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>

                    {/* Confirm Delete Dialog */}
                    <Dialog
                        open={openConfirmDeleteDialog}
                        onClose={handleDeleteClose}>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogContent>
                            Are you sure you want to delete this project?
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDeleteClose} color='primary'>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleDeleteConfirm}
                                color='secondary'>
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
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
                    <Link to='/create_project'>
                        <Button
                            startIcon={<AddIcon fontSize='small' />}
                            variant='contained'
                            size='small'
                            sx={{ mt: 2 }}>
                            Create New Project
                        </Button>
                    </Link>
                </Box>
            )}
        </>
    );
};

export default ListProject;
