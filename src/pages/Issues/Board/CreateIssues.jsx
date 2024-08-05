import {
    Button,
    Card,
    IconButton,
    Stack,
    Typography,
    MenuItem,
    FormControl,
    Select,
    Box,
    Grid,
    TextField,
    Divider,
    Avatar,
    ListItemAvatar,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
} from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './quill.css';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { escapeDanger, formatTimeAgo } from '../../../utilities/function';

import ShareIcon from '@mui/icons-material/Share';
import Image from '../../../components/Image';
import { IssueType } from '../../../services/stickerColor';
import Comments from './Comments';
import axiosInstance from '../../../utilities/axios';
import { useMessage } from '../../../providers/Provider';
import CopyIssueLink from './CopyIssueLink';

const CreateIssues = props => {
    const {
        task,
        closeProject,
        members,
        ProjectId,
        selectedIssue,
        fetchIssues,
        setProjectState,
    } = props;
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] =
        useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [name, setName] = useState(task.name || '');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [selectOption, setSelectOption] = useState({
        status: '',
        priority: '',
        issueType: '',
        assignee: '',
        reporter: '',
    });
    const [showDescription, setShowDescription] = useState(false);
    const [showTitle, setShowTitle] = useState(false);
    const { showError, showSuccess } = useMessage();
    const [text, setText] = useState(task.description || '');
    const quillRef = useRef(null);

    useEffect(() => {
        setSelectOption({
            status: task.status || 'Backlog',
            priority: task.priority || 'Medium',
            issueType: task.issueType || 'Task',
            assignee: task.assignee,
            reporter: task.reporter,
        });
    }, [task]);

    const handleChangeOption = e => {
        const name = e.target.name;
        const value = e.target.value;
        setSelectOption({ ...selectOption, [name]: value });
    };

    const currentTime = new Date();
    const issueTime = new Date(task.startDate);
    const differenceInMilliseconds = currentTime - issueTime;
    const formattedTimeAgo = formatTimeAgo(differenceInMilliseconds);

    const handleChangeAssign = e => {
        const name = e.target.name;
        const value = e.target.value;
        setSelectOption({ ...selectOption, [name]: value });
    };
    const handleChangePriority = e => {
        const name = e.target.name;
        const value = e.target.value;
        setSelectOption({ ...selectOption, [name]: value });
    };
    const handleChangeReporter = e => {
        const name = e.target.name;
        const value = e.target.value;
        setSelectOption({ ...selectOption, [name]: value });
    };
    const handleChangeIssueType = e => {
        const name = e.target.name;
        const value = e.target.value;
        setSelectOption({ ...selectOption, [name]: value });
    };

    const modules = useMemo(
        () => ({
            toolbar: {
                container: [
                    [{ header: [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [
                        { list: 'ordered' },
                        { list: 'bullet' },
                        { indent: '-1' },
                        { indent: '+1' },
                    ],
                    ['link', 'image'],
                    ['clean'],
                ],
            },
        }),
        []
    );

    const formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
    ];

    const handleChange = value => {
        setText(value);
    };

    const handleChangeSave = () => {
        setName(name);
        setShowTitle(false);
    };
    const handleChangeCancel = () => {
        setShowTitle(false);
    };

    const handleChangeQuillSave = () => {
        setText(text);
        setShowDescription(false);
    };
    const handleChangeQuillCancel = () => {
        setShowDescription(false);
    };

    const updateIssue = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosInstance.patch(
                `/api/projects/${ProjectId}/issues/${selectedIssue}/`,
                {
                    ...selectOption,
                    description: text,
                    name,
                }
            );
            setProjectState(false);
            fetchIssues();
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const handleClickOpenDialog = () => {
        setConfirmDeleteDialogOpen(true);
    };

    const handleCancelDelete = () => {
        setConfirmDeleteDialogOpen(false);
    };

    const handleConfirmDelete = async () => {
        setDeleteLoading(true);
        try {
            await axiosInstance.delete(
                `/api/projects/${ProjectId}/issues/${selectedIssue}/`
            );

            fetchIssues();
            showSuccess('Issue deleted successfully');

            setProjectState(false);
        } catch (error) {
            // Handle error (e.g., show an error message)
            showError('Failed to delete issue', error);
        } finally {
            setDeleteLoading(false);
            setConfirmDeleteDialogOpen(false);
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Card
                sx={{
                    position: 'relative',
                    boxShadow: 'rgba(0, 0, 0, 0.45) 0px 25px 20px -20px',
                    borderRadius: '8px',
                    maxWidth: '1250px',
                    border: 2,
                    borderColor: 'rgba(255, 255, 255, 0.07)',
                    width: '100%',
                    p: 2,
                    mx: 2,
                    height: { xs: '85vh', xl: '70vh' },
                    // maxHeight: '75vh',
                    overflowY: 'auto',
                    pb: 2,
                }}>
                <Stack
                    direction='row'
                    justifyContent='space-between'
                    alignItems='center'
                    mb={1}>
                    {/* issuestype */}
                    <Box display='flex' alignItems='center'>
                        <Image
                            name={
                                selectOption.issueType
                                    ? IssueType[task.issueType]
                                    : 'Task.png'
                            }
                            sx={{ width: 16, height: 16 }}
                        />

                        <Typography
                            variant='body2'
                            fontWeight={500}
                            sx={{ ml: 1 }}
                            color='text.secondary'>
                            {selectOption.status}
                        </Typography>
                    </Box>
                    {/* Header right menu */}

                    <Box>
                        <IconButton
                            disableFocusRipple
                            disableTouchRipple
                            onClick={handleClickOpen}
                            disableRipple>
                            <ShareIcon fontSize='small' />
                        </IconButton>
                        <IconButton
                            disableFocusRipple
                            disableTouchRipple
                            onClick={handleClickOpenDialog}
                            disableRipple>
                            <MoreHorizIcon sx={{ mx: 0.3 }} fontSize='small' />
                        </IconButton>
                        <IconButton
                            onClick={closeProject}
                            disableFocusRipple
                            disableTouchRipple
                            disableRipple>
                            <CloseIcon fontSize='small' />
                        </IconButton>
                    </Box>
                </Stack>

                {/* form */}
                <form onSubmit={updateIssue}>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item lg={8} xs={12}>
                            <Box
                                sx={{
                                    p: 2,
                                    maxHeight: { xs: '60vh', xl: '50vh' },
                                    overflowY: 'auto',
                                    overflowX: 'auto',
                                }}>
                                <Box sx={{ mb: 1 }}>
                                    <Typography
                                        variant='caption'
                                        color='text.tertiary'
                                        sx={{ pl: 0.8 }}>
                                        Title
                                    </Typography>
                                    {showTitle ? (
                                        <>
                                            <TextField
                                                name='name'
                                                size='small'
                                                fullWidth
                                                placeholder='Enter Title'
                                                multiline
                                                value={name}
                                                onChange={e =>
                                                    setName(e.target.value)
                                                }
                                                // maxRows={4}
                                                id='margin-none'
                                                margin='none'
                                                sx={{
                                                    m: 0,
                                                    mb: 0,

                                                    ' & .MuiFormControl-root .MuiTextField-root':
                                                        {
                                                            mb: 0,
                                                        },
                                                }}
                                                // variant='borderNone'
                                            />
                                            <Box
                                                display='flex'
                                                justifyContent='end'
                                                mb={0}
                                                pb={0}>
                                                <IconButton
                                                    sx={{
                                                        mt: 0,
                                                        width: 25,
                                                        height: 25,
                                                        backgroundColor:
                                                            'background.default',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'center',
                                                        borderRadius: '4px',
                                                        mr: 0.3,
                                                    }}>
                                                    <CheckIcon
                                                        fontSize='small'
                                                        onClick={
                                                            handleChangeSave
                                                        }
                                                    />
                                                </IconButton>

                                                <IconButton
                                                    sx={{
                                                        width: 25,
                                                        height: 25,
                                                        backgroundColor:
                                                            'background.default',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'center',
                                                        borderRadius: '4px',
                                                    }}>
                                                    <CloseIcon
                                                        onClick={
                                                            handleChangeCancel
                                                        }
                                                    />
                                                </IconButton>
                                            </Box>
                                        </>
                                    ) : (
                                        <Typography
                                            onClick={() => setShowTitle(true)}
                                            sx={{
                                                maxWidth: '100%',
                                                display: '-webkit-box',
                                                WebkitBoxOrient: 'vertical',
                                                WebkitLineClamp: 3,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                py: 1,
                                                pl: 0.8,
                                                borderRadius: '4px',
                                                '&:hover': {
                                                    backgroundColor:
                                                        'white.light',
                                                },
                                            }}
                                            color='text.tertiary'
                                            variant='h6'>
                                            {name || 'Add a Title...'}
                                        </Typography>
                                    )}
                                </Box>

                                {/* descriptions */}
                                <Box mt={1}>
                                    <Typography
                                        variant='caption'
                                        color='text.tertiary'
                                        sx={{ pl: 0.8 }}>
                                        Description
                                    </Typography>
                                    <Box mt={1} width='100%'>
                                        {showDescription ? (
                                            <>
                                                <ReactQuill
                                                    theme='snow'
                                                    value={text}
                                                    modules={modules}
                                                    formats={formats}
                                                    onChange={handleChange}
                                                    ref={quillRef}
                                                    className='.richtextWrap'
                                                />
                                                <Box mt={1}>
                                                    <Button
                                                        variant='contained'
                                                        size='small'
                                                        onClick={
                                                            handleChangeQuillSave
                                                        }>
                                                        {' '}
                                                        Save
                                                    </Button>
                                                    <Button
                                                        variant='outlined'
                                                        size='small'
                                                        sx={{ ml: 1 }}
                                                        onClick={
                                                            handleChangeQuillCancel
                                                        }>
                                                        {' '}
                                                        Cancel
                                                    </Button>
                                                </Box>
                                            </>
                                        ) : (
                                            <Box sx={{ width: '100%' }}>
                                                <Typography
                                                    onClick={() =>
                                                        setShowDescription(true)
                                                    }
                                                    color='text.tertiary'
                                                    sx={{
                                                        width: '100%',
                                                        fontSize: '14px',
                                                        py: 1,
                                                        pl: 0.8,
                                                        borderRadius: '4px',
                                                        '&:hover': {
                                                            backgroundColor:
                                                                'white.light',
                                                        },
                                                    }}>
                                                    {text ? (
                                                        <div
                                                            dangerouslySetInnerHTML={{
                                                                __html: escapeDanger(
                                                                    text.replace(
                                                                        /<img/g,
                                                                        '<img style="width: 100%; max-width: 400px; height: auto; display:block; padding:5px"'
                                                                    )
                                                                ),
                                                            }}></div>
                                                    ) : (
                                                        'Add a description...'
                                                    )}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>

                                <Box mt={10}>
                                    <Divider />
                                    <Comments />
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item lg={4}>
                            <Box
                                sx={{
                                    border: 1,
                                    borderColor: 'rgba(255, 255, 255, 0.07)',
                                }}>
                                <Box p={1}>
                                    <Typography
                                        variant='body2'
                                        color='text.secondary'
                                        fontWeight={500}>
                                        Details
                                    </Typography>
                                </Box>
                                <Divider />
                                <Box p={2}>
                                    <Grid container spacing={2}>
                                        {/* Assignee Field */}
                                        <Grid item xs={4}>
                                            <Typography
                                                variant='caption'
                                                color='text.secondary'
                                                fontWeight={500}>
                                                Assignee
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <FormControl size='small' fullWidth>
                                                <Select
                                                    size='small'
                                                    displayEmpty
                                                    sx={{ fontSize: '14px' }}
                                                    name='assignee'
                                                    value={
                                                        selectOption.assignee ||
                                                        ''
                                                    }
                                                    onChange={
                                                        handleChangeAssign
                                                    }
                                                    renderValue={value => {
                                                        if (
                                                            value.length === 0
                                                        ) {
                                                            return (
                                                                <Box
                                                                    display='flex'
                                                                    alignItems='center'
                                                                    p={0}>
                                                                    <Avatar
                                                                        sx={{
                                                                            height: 25,
                                                                            width: 25,
                                                                            mr: 1,
                                                                        }}
                                                                    />
                                                                    <em>
                                                                        Unassigned
                                                                    </em>
                                                                </Box>
                                                            );
                                                        }
                                                        return value ? (
                                                            <Box
                                                                display='flex'
                                                                alignItems='center'
                                                                p={0}>
                                                                <Avatar
                                                                    sx={{
                                                                        height: 25,
                                                                        width: 25,
                                                                        mr: 1,
                                                                    }}
                                                                />
                                                                {
                                                                    members[
                                                                        value
                                                                    ]?.username
                                                                }
                                                            </Box>
                                                        ) : (
                                                            ''
                                                        );
                                                    }}>
                                                    <MenuItem value=''>
                                                        <Box
                                                            display='flex'
                                                            alignItems='center'
                                                            p={0}>
                                                            <Avatar
                                                                sx={{
                                                                    height: 30,
                                                                    width: 30,
                                                                    mr: 1,
                                                                }}
                                                            />
                                                            <em>Unassigned</em>
                                                        </Box>
                                                    </MenuItem>
                                                    {Object.keys(members).map(
                                                        member => (
                                                            <MenuItem
                                                                key={member}
                                                                value={member}>
                                                                <Box
                                                                    display='flex'
                                                                    alignItems='center'
                                                                    p={0}>
                                                                    <Avatar
                                                                        sx={{
                                                                            height: 30,
                                                                            width: 30,
                                                                            mr: 1,
                                                                        }}
                                                                    />
                                                                    {
                                                                        members[
                                                                            member
                                                                        ]
                                                                            ?.username
                                                                    }
                                                                </Box>
                                                            </MenuItem>
                                                        )
                                                    )}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {/* Priority Field */}
                                        <Grid item xs={4}>
                                            <Typography
                                                variant='caption'
                                                color='text.secondary'
                                                fontWeight={500}>
                                                Priority
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <FormControl size='small' fullWidth>
                                                <Select
                                                    size='small'
                                                    sx={{ fontSize: '14px' }}
                                                    value={
                                                        selectOption.priority ||
                                                        ''
                                                    }
                                                    name='priority'
                                                    onChange={
                                                        handleChangePriority
                                                    }
                                                    renderValue={selected => (
                                                        <Box
                                                            display='flex'
                                                            alignItems='center'>
                                                            <Image
                                                                name={
                                                                    selected
                                                                        ? `${selected.toLowerCase()}.png`
                                                                        : 'default.png'
                                                                }
                                                                sx={{
                                                                    width: 16,
                                                                    height: 16,
                                                                    mr: 1,
                                                                }}
                                                            />
                                                            {selected || 'None'}
                                                        </Box>
                                                    )}>
                                                    <MenuItem value='Lowest'>
                                                        <Image
                                                            name='lowest.png'
                                                            sx={{
                                                                width: 16,
                                                                height: 16,
                                                                mr: 1,
                                                            }}
                                                        />
                                                        Lowest
                                                    </MenuItem>
                                                    <MenuItem value='Low'>
                                                        <Image
                                                            name='low.png'
                                                            sx={{
                                                                width: 16,
                                                                height: 16,
                                                                mr: 1,
                                                            }}
                                                        />
                                                        Low
                                                    </MenuItem>
                                                    <MenuItem value='Medium'>
                                                        <Image
                                                            name='medium.png'
                                                            sx={{
                                                                width: 16,
                                                                height: 16,
                                                                mr: 1,
                                                            }}
                                                        />
                                                        Medium
                                                    </MenuItem>
                                                    <MenuItem value='High'>
                                                        <Image
                                                            name='high.png'
                                                            sx={{
                                                                width: 16,
                                                                height: 16,
                                                                mr: 1,
                                                            }}
                                                        />
                                                        High
                                                    </MenuItem>
                                                    <MenuItem value='Highest'>
                                                        <Image
                                                            name='highest.png'
                                                            sx={{
                                                                width: 16,
                                                                height: 16,
                                                                mr: 1,
                                                            }}
                                                        />
                                                        Highest
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {/* Reporter Field */}
                                        <Grid item xs={4}>
                                            <Typography
                                                variant='caption'
                                                color='text.secondary'
                                                fontWeight={500}>
                                                Reporter
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <FormControl size='small' fullWidth>
                                                <Select
                                                    size='small'
                                                    displayEmpty
                                                    sx={{ fontSize: '14px' }}
                                                    name='reporter'
                                                    value={
                                                        selectOption.reporter ||
                                                        ''
                                                    }
                                                    onChange={
                                                        handleChangeReporter
                                                    }
                                                    renderValue={selected => {
                                                        const selectedOption =
                                                            members[selected]
                                                                ?.username;
                                                        return selectedOption ? (
                                                            <Box
                                                                display='flex'
                                                                alignItems='center'>
                                                                <Avatar
                                                                    sx={{
                                                                        height: 25,
                                                                        width: 25,
                                                                        mr: 1,
                                                                    }}
                                                                />
                                                                {selectedOption}
                                                            </Box>
                                                        ) : (
                                                            <em>Unassigned</em>
                                                        );
                                                    }}>
                                                    {Object.keys(members).map(
                                                        member => (
                                                            <MenuItem
                                                                key={member}
                                                                value={member}>
                                                                <ListItemAvatar
                                                                    sx={{
                                                                        minWidth:
                                                                            '45px',
                                                                    }}>
                                                                    <Avatar
                                                                        sx={{
                                                                            height: 30,
                                                                            width: 30,
                                                                            mr: 1,
                                                                        }}
                                                                    />
                                                                </ListItemAvatar>
                                                                {
                                                                    members[
                                                                        member
                                                                    ]?.username
                                                                }
                                                            </MenuItem>
                                                        )
                                                    )}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {/* Issue Type Field */}
                                        <Grid item xs={4}>
                                            <Typography
                                                variant='caption'
                                                color='text.secondary'
                                                fontWeight={500}>
                                                Issue Type
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <FormControl size='small' fullWidth>
                                                <Select
                                                    size='small'
                                                    displayEmpty
                                                    sx={{ fontSize: '14px' }}
                                                    value={
                                                        selectOption.issueType ||
                                                        ''
                                                    }
                                                    name='issueType'
                                                    onChange={
                                                        handleChangeIssueType
                                                    }
                                                    renderValue={selected => (
                                                        <Box
                                                            display='flex'
                                                            alignItems='center'>
                                                            <Image
                                                                name={
                                                                    IssueType[
                                                                        selected
                                                                    ] ||
                                                                    'default.png'
                                                                } // Fallback to default image
                                                                sx={{
                                                                    width: 16,
                                                                    height: 16,
                                                                    mr: 1,
                                                                }}
                                                            />
                                                            {selected || 'None'}
                                                        </Box>
                                                    )}>
                                                    <MenuItem value=''>
                                                        <Image
                                                            name='default.png'
                                                            sx={{
                                                                width: 16,
                                                                height: 16,
                                                                mr: 1,
                                                            }}
                                                        />
                                                        None
                                                    </MenuItem>
                                                    {Object.keys(IssueType).map(
                                                        issueType => (
                                                            <MenuItem
                                                                key={issueType}
                                                                value={
                                                                    issueType
                                                                }>
                                                                <Image
                                                                    name={
                                                                        IssueType[
                                                                            issueType
                                                                        ]
                                                                    }
                                                                    sx={{
                                                                        width: 16,
                                                                        height: 16,
                                                                        mr: 1,
                                                                    }}
                                                                />
                                                                {issueType}
                                                            </MenuItem>
                                                        )
                                                    )}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {/* status */}
                                        <Grid item xs={4}>
                                            <Typography
                                                variant='caption'
                                                color='text.secondary'
                                                fontWeight={500}>
                                                Status
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <FormControl size='small' fullWidth>
                                                <Select
                                                    size='small'
                                                    displayEmpty
                                                    value={
                                                        selectOption.status ||
                                                        ''
                                                    }
                                                    sx={{ fontSize: '14px' }}
                                                    name='status'
                                                    onChange={
                                                        handleChangeOption
                                                    }
                                                    renderValue={selected => (
                                                        <Box
                                                            display='flex'
                                                            alignItems='center'>
                                                            <Typography
                                                                variant='body2'
                                                                color='text.tertiary'>
                                                                {selected ||
                                                                    'None'}
                                                            </Typography>
                                                        </Box>
                                                    )}>
                                                    <MenuItem value=''>
                                                        <Typography
                                                            variant='body2'
                                                            color='text.tertiary'>
                                                            None
                                                        </Typography>
                                                    </MenuItem>
                                                    <MenuItem value='Backlog'>
                                                        <Typography variant='body2'>
                                                            Backlog
                                                        </Typography>
                                                    </MenuItem>
                                                    <MenuItem value='To Do'>
                                                        <Typography variant='body2'>
                                                            To Do
                                                        </Typography>
                                                    </MenuItem>
                                                    <MenuItem value='In Progress'>
                                                        <Typography variant='body2'>
                                                            In Progress
                                                        </Typography>
                                                    </MenuItem>
                                                    <MenuItem value='Review'>
                                                        <Typography variant='body2'>
                                                            Review
                                                        </Typography>
                                                    </MenuItem>
                                                    <MenuItem value='Done'>
                                                        <Typography variant='body2'>
                                                            Done
                                                        </Typography>
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                            <Box mt={2}>
                                <Typography
                                    variant='body2'
                                    fontWeight='bold'
                                    color='text.secondary'>
                                    Created Date :{' '}
                                    {new Date(task.startDate).toLocaleString()}
                                </Typography>
                            </Box>
                            <Box mt={2}>
                                <Typography
                                    variant='body2'
                                    fontWeight='bold'
                                    color='text.secondary'>
                                    Created at : {formattedTimeAgo}
                                </Typography>
                            </Box>
                            <Box sx={{ mt: 2, textAlign: 'right' }}>
                                <Button
                                    variant='contained'
                                    color='primary'
                                    disabled={loading}
                                    endIcon={
                                        loading && (
                                            <CircularProgress
                                                size='20px'
                                                sx={{ color: 'inherit' }}
                                            />
                                        )
                                    }
                                    type='submit'>
                                    Submit
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Card>
            <Dialog
                open={confirmDeleteDialogOpen}
                onClose={handleCancelDelete}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'>
                <DialogTitle id='alert-dialog-title'>
                    Confirm Delete
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                        Are you sure you want to delete the Task?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCancelDelete}
                        color='primary'
                        style={{ color: 'white' }}>
                        Cancel
                    </Button>
                    <Button
                        variant='contained'
                        onClick={handleConfirmDelete}
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

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'>
                <CopyIssueLink handleClose={handleClose} />
            </Dialog>
        </>
    );
};

export default CreateIssues;
