import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Typography,
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './quill.css';

const Comments = () => {
    const [allState, setAllState] = useState(false);
    const [activityState, setActivityState] = useState(false);
    const [editLoading] = useState(false);
    const [editStates, setEditStates] = useState(Array(3).fill(false));
    const [editComment, setEditComment] = useState('');

    // Demo data
    const demoMembers = {
        1: { fullName: 'John Doe', photo: 'john_doe_photo_url' },
        2: { fullName: 'Jane Smith', photo: 'jane_smith_photo_url' },
    };

    const demoActivities = [
        {
            performerId: 1,
            time: '2024-08-01T12:00:00Z',
            description: 'Activity 1 description.',
        },
        {
            performerId: 2,
            time: '2024-08-02T14:00:00Z',
            description: 'Activity 2 description.',
        },
    ];

    const demoComments = [
        {
            userId: 1,
            createdAt: '2024-08-01T10:00:00Z',
            description: 'Comment 1 description.',
            fullName: 'John Doe',
        },
        {
            userId: 2,
            createdAt: '2024-08-02T11:00:00Z',
            description: 'Comment 2 description.',
            fullName: 'Jane Smith',
        },
    ];

    const handleChangeEdit = (i, description) => {
        setEditComment(description);
        const resetEditStates = [...editStates];
        resetEditStates[i] = true;
        setEditStates(resetEditStates);
    };

    const handleChangeEditQuillCancel = i => {
        const resetEditStates = [...editStates];
        resetEditStates[i] = false;
        setEditStates(resetEditStates);
    };

    const handleChange = value => {
        setEditComment(value);
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

    return (
        <>
            <Box display='flex' alignItems='center' my={2}>
                <Typography variant='body2' color='text.tertiary'>
                    Show :
                </Typography>
                <Typography
                    variant='caption'
                    fontWeight='500'
                    sx={{
                        px: 1,
                        py: 0.4,
                        ml: 1,
                        cursor: 'pointer',
                        backgroundColor: 'white.light',
                        color: 'text.tertiary',
                        '&:hover': {
                            backgroundColor: 'white.light',
                            color: 'text.tertiary',
                        },
                    }}
                    onClick={() => {
                        setAllState(true);
                        setActivityState(false);
                    }}>
                    All
                </Typography>
                <Typography
                    variant='caption'
                    fontWeight='500'
                    sx={{
                        px: 1,
                        py: 0.4,
                        ml: 1,
                        cursor: 'pointer',
                        backgroundColor: 'white.light',
                        color: 'text.tertiary',
                        '&:hover': {
                            backgroundColor: 'white.light',
                            color: 'text.tertiary',
                        },
                    }}
                    onClick={() => {
                        setAllState(false);
                        setActivityState(false);
                    }}>
                    Comments
                </Typography>
                <Typography
                    variant='caption'
                    fontWeight='500'
                    sx={{
                        px: 1,
                        py: 0.4,
                        ml: 1,
                        cursor: 'pointer',
                        backgroundColor: 'white.light',
                        color: 'text.tertiary',
                        '&:hover': {
                            backgroundColor: 'white.light',
                            color: 'text.tertiary',
                        },
                    }}
                    onClick={() => {
                        setActivityState(true);
                        setAllState(false);
                    }}>
                    History
                </Typography>
            </Box>

            {allState ? (
                <>
                    <Box>
                        {demoActivities.map(activity => {
                            const currentTime = new Date();
                            const activiteTime = new Date(activity.time);
                            const differenceInMilliseconds =
                                currentTime - activiteTime;

                            const formattedTimeAgo = formatTimeAgo(
                                differenceInMilliseconds
                            );
                            return (
                                <Box display='flex' alignItems='start' mb={2}>
                                    <Avatar
                                        sx={{
                                            height: 30,
                                            width: 30,
                                            mr: 2,
                                        }}
                                        src={
                                            demoMembers[activity.performerId]
                                                ?.photo
                                        }
                                    />
                                    <Box>
                                        <Typography
                                            variant='body2'
                                            color='text.tertiary'
                                            sx={{
                                                mb: 0.5,
                                            }}>
                                            {
                                                demoMembers[
                                                    activity.performerId
                                                ]?.fullName
                                            }
                                            <Typography
                                                variant='caption'
                                                color='text.secondary'
                                                sx={{
                                                    ml: 3,
                                                }}>
                                                {formattedTimeAgo}
                                            </Typography>
                                        </Typography>

                                        <Typography
                                            variant='caption'
                                            color='text.secondary'>
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: escapeDanger(
                                                        activity.description.replace(
                                                            /<img/g,
                                                            '<img style="width: 100%; max-width: 400px; height: auto; display:block; padding:5px"'
                                                        )
                                                    ),
                                                }}></div>
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                    <Box>
                        {demoComments.map((comment, i) => {
                            const currentTime = new Date();
                            const activiteTime = new Date(comment.createdAt);
                            const differenceInMilliseconds =
                                currentTime - activiteTime;

                            const formattedTimeAgo = formatTimeAgo(
                                differenceInMilliseconds
                            );
                            return (
                                <Box display='flex' alignItems='start' mb={2}>
                                    <Avatar
                                        sx={{
                                            height: 30,
                                            width: 30,
                                            mr: 2,
                                        }}
                                        src={demoMembers[comment.userId]?.photo}
                                    />
                                    <Box>
                                        <Typography
                                            variant='body2'
                                            color='text.tertiary'
                                            sx={{
                                                mb: 0.5,
                                            }}>
                                            {comment.fullName}
                                            <Typography
                                                variant='caption'
                                                color='text.secondary'
                                                sx={{
                                                    ml: 3,
                                                }}>
                                                {formattedTimeAgo}
                                            </Typography>
                                        </Typography>

                                        {editStates[i] ? (
                                            <Box sx={{ width: '100%' }}>
                                                <ReactQuill
                                                    theme='snow'
                                                    value={editComment}
                                                    modules={modules}
                                                    formats={formats}
                                                    onChange={handleChange}
                                                    className='.richtextWrap'
                                                />

                                                <Box mt={1}>
                                                    <Button
                                                        disabled={editLoading}
                                                        endIcon={
                                                            editLoading && (
                                                                <CircularProgress
                                                                    size='20px'
                                                                    sx={{
                                                                        color: 'inherit',
                                                                    }}
                                                                />
                                                            )
                                                        }
                                                        variant='contained'
                                                        size='small'>
                                                        Save
                                                    </Button>
                                                    <Button
                                                        variant='outlined'
                                                        size='small'
                                                        sx={{ ml: 1 }}
                                                        onClick={() => {
                                                            handleChangeEditQuillCancel(
                                                                i
                                                            );
                                                        }}>
                                                        Cancel
                                                    </Button>
                                                </Box>
                                            </Box>
                                        ) : (
                                            <>
                                                <Typography
                                                    variant='caption'
                                                    color='text.secondary'>
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html: escapeDanger(
                                                                comment.description.replace(
                                                                    /<img/g,
                                                                    '<img style="width: 100%; max-width: 400px; height: auto; display:block; padding:5px"'
                                                                )
                                                            ),
                                                        }}></div>
                                                </Typography>

                                                <Box mt={0.5}>
                                                    <Typography
                                                        variant='caption'
                                                        color='text.tertiary'
                                                        fontWeight='bold'
                                                        onClick={() =>
                                                            handleChangeEdit(
                                                                i,
                                                                comment.description
                                                            )
                                                        }
                                                        sx={{
                                                            mr: 1,
                                                            cursor: 'pointer',
                                                            '&:hover': {
                                                                borderBottom:
                                                                    '1px solid grey',
                                                            },
                                                        }}>
                                                        Edit
                                                    </Typography>
                                                    <Typography
                                                        variant='caption'
                                                        color='text.tertiary'
                                                        fontWeight='bold'
                                                        sx={{
                                                            cursor: 'pointer',
                                                            '&:hover': {
                                                                textDecoration:
                                                                    'underline',
                                                            },
                                                        }}>
                                                        Delete
                                                    </Typography>
                                                </Box>
                                            </>
                                        )}
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                </>
            ) : activityState ? (
                <Box>
                    {demoActivities.map((activity, i) => {
                        const currentTime = new Date();
                        const activiteTime = new Date(activity.time);
                        const differenceInMilliseconds =
                            currentTime - activiteTime;

                        const formattedTimeAgo = formatTimeAgo(
                            differenceInMilliseconds
                        );
                        return (
                            <Box display='flex' alignItems='start' mb={2}>
                                <Avatar
                                    sx={{
                                        height: 30,
                                        width: 30,
                                        mr: 2,
                                    }}
                                    src={
                                        demoMembers[activity.performerId]?.photo
                                    }
                                />
                                <Box>
                                    <Typography
                                        variant='body2'
                                        color='text.tertiary'
                                        sx={{
                                            mb: 0.5,
                                        }}>
                                        {
                                            demoMembers[activity.performerId]
                                                ?.fullName
                                        }
                                        <Typography
                                            variant='caption'
                                            color='text.secondary'
                                            sx={{
                                                ml: 3,
                                            }}>
                                            {formattedTimeAgo}
                                        </Typography>
                                    </Typography>

                                    <Typography
                                        variant='caption'
                                        color='text.secondary'>
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: escapeDanger(
                                                    activity.description.replace(
                                                        /<img/g,
                                                        '<img style="width: 100%; max-width: 400px; height: auto; display:block; padding:5px"'
                                                    )
                                                ),
                                            }}></div>
                                    </Typography>
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            ) : (
                <Box>
                    {demoComments.map((comment, i) => {
                        const currentTime = new Date();
                        const activiteTime = new Date(comment.createdAt);
                        const differenceInMilliseconds =
                            currentTime - activiteTime;

                        const formattedTimeAgo = formatTimeAgo(
                            differenceInMilliseconds
                        );
                        return (
                            <Box display='flex' alignItems='start' mb={2}>
                                <Avatar
                                    sx={{
                                        height: 30,
                                        width: 30,
                                        mr: 2,
                                    }}
                                    src={demoMembers[comment.userId]?.photo}
                                />
                                <Box>
                                    <Typography
                                        variant='body2'
                                        color='text.tertiary'
                                        sx={{
                                            mb: 0.5,
                                        }}>
                                        {comment.fullName}
                                        <Typography
                                            variant='caption'
                                            color='text.secondary'
                                            sx={{
                                                ml: 3,
                                            }}>
                                            {formattedTimeAgo}
                                        </Typography>
                                    </Typography>

                                    {editStates[i] ? (
                                        <Box sx={{ width: '100%' }}>
                                            <ReactQuill
                                                theme='snow'
                                                value={editComment}
                                                modules={modules}
                                                formats={formats}
                                                onChange={handleChange}
                                                className='.richtextWrap'
                                            />

                                            <Box mt={1}>
                                                <Button
                                                    disabled={editLoading}
                                                    endIcon={
                                                        editLoading && (
                                                            <CircularProgress
                                                                size='20px'
                                                                sx={{
                                                                    color: 'inherit',
                                                                }}
                                                            />
                                                        )
                                                    }
                                                    variant='contained'
                                                    size='small'>
                                                    Save
                                                </Button>
                                                <Button
                                                    variant='outlined'
                                                    size='small'
                                                    sx={{ ml: 1 }}
                                                    onClick={() => {
                                                        handleChangeEditQuillCancel(
                                                            i
                                                        );
                                                    }}>
                                                    Cancel
                                                </Button>
                                            </Box>
                                        </Box>
                                    ) : (
                                        <>
                                            <Typography
                                                variant='caption'
                                                color='text.secondary'>
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: escapeDanger(
                                                            comment.description.replace(
                                                                /<img/g,
                                                                '<img style="width: 100%; max-width: 400px; height: auto; display:block; padding:5px"'
                                                            )
                                                        ),
                                                    }}></div>
                                            </Typography>

                                            <Box mt={0.5}>
                                                <Typography
                                                    variant='caption'
                                                    color='text.tertiary'
                                                    fontWeight='bold'
                                                    onClick={() =>
                                                        handleChangeEdit(
                                                            i,
                                                            comment.description
                                                        )
                                                    }
                                                    sx={{
                                                        mr: 1,
                                                        cursor: 'pointer',
                                                        '&:hover': {
                                                            borderBottom:
                                                                '1px solid grey',
                                                        },
                                                    }}>
                                                    Edit
                                                </Typography>
                                                <Typography
                                                    variant='caption'
                                                    color='text.tertiary'
                                                    fontWeight='bold'
                                                    sx={{
                                                        cursor: 'pointer',
                                                        '&:hover': {
                                                            textDecoration:
                                                                'underline',
                                                        },
                                                    }}>
                                                    Delete
                                                </Typography>
                                            </Box>
                                        </>
                                    )}
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            )}
        </>
    );
};

const formatTimeAgo = differenceInMilliseconds => {
    const differenceInMinutes = Math.floor(
        differenceInMilliseconds / (1000 * 60)
    );
    const differenceInHours = Math.floor(
        differenceInMilliseconds / (1000 * 60 * 60)
    );
    const differenceInDays = Math.floor(
        differenceInMilliseconds / (1000 * 60 * 60 * 24)
    );
    const differenceInMonths = Math.floor(
        differenceInMilliseconds / (1000 * 60 * 60 * 24 * 30)
    );
    const differenceInYears = Math.floor(
        differenceInMilliseconds / (1000 * 60 * 60 * 24 * 365)
    );

    if (differenceInMinutes < 1) {
        return 'Just now';
    } else if (differenceInMinutes < 60) {
        return `${differenceInMinutes} minute${
            differenceInMinutes > 1 ? 's' : ''
        } ago`;
    } else if (differenceInHours < 24) {
        return `${differenceInHours} hour${
            differenceInHours > 1 ? 's' : ''
        } ago`;
    } else if (differenceInDays < 30) {
        return `${differenceInDays} day${differenceInDays > 1 ? 's' : ''} ago`;
    } else if (differenceInMonths < 12) {
        return `${differenceInMonths} month${
            differenceInMonths > 1 ? 's' : ''
        } ago`;
    } else {
        return `${differenceInYears} year${
            differenceInYears > 1 ? 's' : ''
        } ago`;
    }
};

const escapeDanger = html => {
    const div = document.createElement('div');
    div.innerText = html;
    return div.innerHTML;
};

export default Comments;
