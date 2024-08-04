import React, { useCallback, useEffect, useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Image from '../../components/Image';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { projectsImg } from '../../services/stickerColor';
import axiosInstance from '../../utilities/axios';
import { useMessage } from '../../providers/Provider';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const CreateProject = () => {
    const { id: projectId } = useParams();
    const navigate = useNavigate();
    const { showSuccess, showError } = useMessage();
    const user = useAuthUser() || {};
    const [name, setName] = useState('');
    const [key, setKey] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] =
        useState(false);

    const buttonText = projectId ? 'Save' : 'Create';
    const method = projectId ? 'PATCH' : 'POST';
    const action = projectId ? `/api/projects//${projectId}` : `/api/projects/`;
    const successMessage = projectId
        ? 'Project updated successfully'
        : 'Project created successfully';

    const fetchProject = useCallback(async () => {
        try {
            const response = await axios.get(
                `/organization/project/${projectId}`
            );
            const { project, success, errors } = response.data;
            if (!success) return showError(errors);

            setName(project.name);
            setKey(project.key);
        } catch (e) {
            showError(e.message);
        }
    }, [projectId, showError]);

    const handleDelete = useCallback(async () => {
        setDeleteLoading(true);
        try {
            const response = await axios.delete(
                `/organization/project/${projectId}`
            );
            const { success, message } = response.data;

            if (!success) return showError(message);

            showSuccess('Project deleted successfully');
            setConfirmDeleteDialogOpen(false);
            setDeleteLoading(false);
            navigate('/projects');
        } catch (e) {
            showError(e.message);
            setDeleteLoading(false);
        }
    }, [projectId, showSuccess, showError, navigate]);

    useEffect(() => {
        if (projectId) fetchProject();
    }, [fetchProject, projectId]);

    const handleSubmit = async event => {
        event.preventDefault();
        try {
            const response = await axiosInstance({
                method,
                url: action,
                data: {
                    name,
                    key,
                    imageURL: 'http://example.com/image.png',
                    owner: user.id,
                },
            });
            const { success, errors } = response.data;
            if (!success) return showError(errors);

            showSuccess(successMessage);
            if (!projectId) {
                setName('');
                setKey('');
            }
            navigate('/list-project');
        } catch (e) {
            showError(e.message);
        }
    };

    return (
        <>
            <Box my={3}>
                {!projectId && (
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
                                    Details
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                )}
                <Box mt={4}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Image
                            name='project.png'
                            alt='#icon'
                            style={{ height: 100 }}
                        />
                        <Box>
                            <Button
                                variant='outlined'
                                size='small'
                                sx={{ fontSize: '11px', my: 1 }}>
                                Change icon
                            </Button>
                        </Box>
                    </Box>
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
                            <Button
                                type='submit'
                                size='small'
                                sx={{ mt: 3 }}
                                variant='contained'>
                                {buttonText}
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Box>

            {projectId && (
                <Box sx={{ ml: 2 }}>
                    <IconButton
                        onClick={() => setConfirmDeleteDialogOpen(true)}>
                        <MoreVertIcon fontSize='small' />
                    </IconButton>
                    <Menu
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(confirmDeleteDialogOpen)}
                        onClose={() => setConfirmDeleteDialogOpen(false)}>
                        <MenuItem onClick={handleDelete}>Delete</MenuItem>
                    </Menu>
                </Box>
            )}

            <Dialog
                open={confirmDeleteDialogOpen}
                onClose={() => setConfirmDeleteDialogOpen(false)}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'>
                <DialogTitle id='alert-dialog-title'>
                    Confirm Delete
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                        Are you sure you want to delete the project?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setConfirmDeleteDialogOpen(false)}
                        color='primary'>
                        Cancel
                    </Button>
                    <Button
                        variant='contained'
                        onClick={handleDelete}
                        disabled={deleteLoading}
                        endIcon={
                            deleteLoading && (
                                <CircularProgress
                                    size='20px'
                                    sx={{ color: 'inherit' }}
                                />
                            )
                        }
                        style={{ backgroundColor: '#ff2121', border: 'none' }}
                        autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CreateProject;
