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
    Menu,
    Avatar,
    ListItemAvatar,
} from '@mui/material';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './quill.css';
import axios from 'axios';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useMenu } from '../../../hooks/useMenu';
import {
    escapeDanger,
    formatTimeAgo,
    handleAxiosError,
} from '../../../utilities/function';
// import JoinInnerIcon from '@mui/icons-material/JoinInner';
// import LanIcon from '@mui/icons-material/Lan';
// import AttachmentIcon from '@mui/icons-material/Attachment';
import ShareIcon from '@mui/icons-material/Share';
import Image from '../../../components/Image';
import { IssueType, Priority } from '../../../services/stickerColor';
// import Label from './Label';
import { useSearchParams } from 'react-router-dom';
// import CopyIssueLink from './CopyIssueLink';
import { useMessage } from '../../../providers/Provider';

const CreateIssues = props => {
    const {
        closeModal,
        description,
        fetchIssues,
        reporter,
        priority,
        issueType,
        status,
        assignee,
        labels,
        comments,
        fetchComments,
        name,
        keyId,
        members,
        createdAt,
        setPageNo,
        memberTotalPage,
        memberCurrentPage,
    } = props;

    // const user = useUser();
    const { showError, showSuccess } = useMessage();
    const [searchParams] = useSearchParams();
    const [selectOption, setSelectOption] = useState({
        status: '',
        priority: '',
        issueType: '',
        assignee: '',
        reporter: '',
    });
    const [showDescription, setShowDescription] = useState(false);
    const [showTitle, setShowTitle] = useState(false);
    const [assignSelect, setAssignSelect] = useState(true);
    const [prioritySelect, setPrioritySelect] = useState(true);
    const [reporterSelect, setReporterSelect] = useState(true);
    const [issueTypeSelect, setIssueTypeSelect] = useState(true);
    const [text, setText] = useState('');
    const quillRef = useRef(null);
    const [comment, setComment] = useState('');
    const [commentState, setCommentState] = useState(false);
    const [activities, setActivities] = useState(null);
    const projectId = localStorage.getItem('selectedProject');

    const issueId = searchParams.get('issues');

    const buttonText = issueId ? 'Save' : 'Create';
    const method = issueId ? 'PATCH' : 'POST';
    const action = issueId
        ? `/organization/${''}/project/${projectId}/issue/${issueId}`
        : `/organization/${''}/project/${projectId}/issue`;
    const successMessage = issueId
        ? 'Issue updated successfully'
        : 'Issue created successfully';

    useEffect(() => {
        setText(description);
        setSelectOption({
            status: status || 'Backlog',
            priority: priority || 'Medium',
            issueType: issueType || 'Task',
            assignee: 'Gaurav Gupta',
            reporter: 'Gaurav Gupta',
        });
    }, [description, name, status, priority, issueType, assignee, reporter]);

    const handleChangeOption = e => {
        const { name, value } = e.target;
        setSelectOption(prevState => ({ ...prevState, [name]: value }));
    };

    // const handleChangeQuillSave = () => {
    //     setShowDescription(false);
    //     setText(text);
    // };

    // const handleChangeSave = () => {
    //     setShowTitle(false);
    // };

    // const handleChangeComments = value => {
    //     setComment(value);
    // };

    // const handleDeleteClick = () => {
    //     setConfirmDeleteDialogOpen(true);
    // };

    const handleConfirmDelete = useCallback(async () => {
        try {
            const response = await axios.delete(
                `/organization/${''}/project/${projectId}/issue/${issueId}`
            );
            const { success, message } = response.data;
            if (!success) return showError(message);
            showSuccess('Issue deleted successfully');

            fetchIssues();
            closeModal();
        } catch (e) {
            console.log(e);
        }
    }, [issueId, showSuccess, showError, closeModal, fetchIssues, projectId]);

    // const commentSave = useCallback(async () => {
    //     try {
    //         const response = await axios.post(
    //             `/organization/${''}/project/${projectId}/issue/info/${issueId}/comment`,
    //             {
    //                 description: comment,
    //             }
    //         );
    //         const { success, error } = response.data;
    //         if (!success) return showError(error);
    //         setCommentState(false);
    //         setComment('');
    //         fetchComments(issueId);
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }, [projectId, showError, issueId, comment, fetchComments]);

    // const issueActivity = useCallback(async () => {
    //     try {
    //         const response = await axios.get(
    //             `/organization/${''}/activity?issue=${issueId}`
    //         );
    //         const { success, error, activities } = response.data;
    //         if (!success) return showError(error);
    //         setActivities(activities);
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }, [issueId, showError]);

    const currentTime = new Date();
    const issueTime = new Date(createdAt);
    const differenceInMilliseconds = currentTime - issueTime;
    const formattedTimeAgo = formatTimeAgo(differenceInMilliseconds);

    useEffect(() => {
        const handleKeyPress = event => {
            if (
                event.key === 'm' ||
                (event.key === 'M' &&
                    document.activeElement.tagName !== 'INPUT')
            ) {
                setCommentState(true);
                quillRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

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
                    // overflowX: 'hidden',
                    // '::-webkit-scrollbar': { display: 'none' },
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
                            name={issueType ? IssueType[issueType] : 'Task.png'}
                            sx={{ width: 16, height: 16 }}
                        />

                        <Typography
                            variant='body2'
                            fontWeight={500}
                            sx={{ ml: 1 }}
                            color='text.secondary'>
                            {keyId}
                        </Typography>
                    </Box>
                    {/* Header right menu */}

                    <Box>
                        <IconButton
                            disableFocusRipple
                            disableTouchRipple
                            disableRipple>
                            <ShareIcon fontSize='small' />
                        </IconButton>
                        <IconButton
                            disableFocusRipple
                            disableTouchRipple
                            disableRipple>
                            <MoreHorizIcon sx={{ mx: 0.3 }} fontSize='small' />
                        </IconButton>
                        <IconButton
                            onClick={closeModal}
                            disableFocusRipple
                            disableTouchRipple
                            disableRipple>
                            <CloseIcon fontSize='small' />
                        </IconButton>
                    </Box>
                </Stack>

                {/* form */}
                <form>
                    <Grid container spacing={2}>
                        <Grid item lg={8}>
                            hii
                        </Grid>
                        <Grid item lg={4}>
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
                                {assignSelect ? (
                                    <Typography
                                        variant='body2'
                                        color='text.tertiary'
                                        sx={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            p: 0.5,
                                            cursor: 'pointer',
                                            borderRadius: '4px',
                                            '&:hover': {
                                                backgroundColor: 'white.light',
                                            },
                                        }}
                                        onClick={() => setAssignSelect(false)}>
                                        <Avatar
                                            sx={{
                                                height: 30,
                                                width: 30,
                                                mr: 1,
                                            }}
                                        />
                                        Gaurav Gupta
                                    </Typography>
                                ) : (
                                    <FormControl size='small' fullWidth>
                                        <Select
                                            size='small'
                                            displayEmpty
                                            sx={{ fontSize: '14px' }}
                                            name='assignee'
                                            value={selectOption.assignee}
                                            renderValue={v => {
                                                if (v.length === 0) {
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
                                                            <em>Unassigned</em>
                                                        </Box>
                                                    );
                                                }
                                                return v ? (
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
                                                        {members[v]?.fullName}
                                                    </Box>
                                                ) : (
                                                    ''
                                                );
                                            }}>
                                            <MenuItem value=''>
                                                <ListItemAvatar
                                                    sx={{ minWidth: '45px' }}>
                                                    <Avatar
                                                        sx={{
                                                            height: 30,
                                                            width: 30,
                                                            mr: 1,
                                                        }}
                                                    />
                                                </ListItemAvatar>
                                                <em>Unassigned</em>
                                            </MenuItem>
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
                                                            members[member]
                                                                ?.fullName
                                                        }
                                                    </MenuItem>
                                                )
                                            )}
                                            {/* Add pagination controls if needed */}
                                        </Select>
                                    </FormControl>
                                )}
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
                                {prioritySelect ? (
                                    <Box
                                        sx={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            p: 0.5,
                                            cursor: 'pointer',
                                            borderRadius: '4px',
                                            '&:hover': {
                                                backgroundColor: 'white.light',
                                            },
                                        }}
                                        onClick={() =>
                                            setPrioritySelect(false)
                                        }>
                                        <Image
                                            name={
                                                Priority[selectOption.priority]
                                            }
                                            sx={{ width: 16, height: 16 }}
                                        />
                                        <Typography
                                            variant='body2'
                                            color='text.tertiary'
                                            sx={{ ml: 1 }}>
                                            {selectOption.priority
                                                ? selectOption.priority
                                                : 'None'}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <FormControl size='small' fullWidth>
                                        <Select
                                            size='small'
                                            sx={{ fontSize: '14px' }}
                                            value={selectOption.priority}
                                            name='priority'
                                            // onChange={handleChangePriority}
                                            renderValue={selected => (
                                                <Box
                                                    display='flex'
                                                    alignItems='center'>
                                                    <Image
                                                        name={
                                                            Priority[
                                                                selectOption
                                                                    .priority
                                                            ]
                                                        }
                                                        sx={{
                                                            width: 16,
                                                            height: 16,
                                                            mr: 1,
                                                        }}
                                                    />
                                                    {selected}
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
                                )}
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
                                {reporterSelect ? (
                                    <Typography
                                        variant='body2'
                                        color='text.tertiary'
                                        sx={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            p: 0.5,
                                            cursor: 'pointer',
                                            borderRadius: '4px',
                                            '&:hover': {
                                                backgroundColor: 'white.light',
                                            },
                                        }}
                                        onClick={() =>
                                            setReporterSelect(false)
                                        }>
                                        <Avatar
                                            sx={{
                                                height: 30,
                                                width: 30,
                                                mr: 1,
                                            }}
                                        />
                                    </Typography>
                                ) : (
                                    <FormControl size='small' fullWidth>
                                        <Select
                                            size='small'
                                            displayEmpty
                                            sx={{ fontSize: '14px' }}
                                            name='reporter'
                                            value={selectOption.reporter}
                                            // onChange={handleChangeReporter}
                                            renderValue={selected => {
                                                const selectedOption =
                                                    members[selected]?.fullName;
                                                return selectedOption ? (
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
                                                            src={`https://api.files.clikkle.com/open/file/preview/${members[selected]?.photo}`}
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
                                                                src={`https://api.files.clikkle.com/open/file/preview/${members[member]?.photo}`}
                                                            />
                                                        </ListItemAvatar>
                                                        {
                                                            members[member]
                                                                ?.fullName
                                                        }
                                                    </MenuItem>
                                                )
                                            )}
                                        </Select>
                                    </FormControl>
                                )}
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
                                {issueTypeSelect ? (
                                    <Box
                                        sx={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            p: 0.5,
                                            cursor: 'pointer',
                                            borderRadius: '4px',
                                            '&:hover': {
                                                backgroundColor: 'white.light',
                                            },
                                        }}
                                        onClick={() =>
                                            setIssueTypeSelect(false)
                                        }>
                                        <Image
                                            name={
                                                IssueType[
                                                    selectOption.issueType
                                                ]
                                            }
                                            sx={{
                                                width: 16,
                                                height: 16,
                                                mr: 1,
                                            }}
                                        />
                                        <Typography
                                            variant='body2'
                                            color='text.tertiary'
                                            sx={{ ml: 1 }}>
                                            {selectOption.issueType || 'None'}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <FormControl size='small' fullWidth>
                                        <Select
                                            size='small'
                                            sx={{ fontSize: '14px' }}
                                            value={selectOption.issueType}
                                            name='issueType'
                                            // onChange={handleChangeIssueType}
                                            renderValue={selected => (
                                                <Box
                                                    display='flex'
                                                    alignItems='center'>
                                                    <Image
                                                        name={
                                                            IssueType[
                                                                selectOption
                                                                    .issueType
                                                            ]
                                                        }
                                                        sx={{
                                                            width: 16,
                                                            height: 16,
                                                            mr: 1,
                                                        }}
                                                    />
                                                    {selected}
                                                </Box>
                                            )}>
                                            <MenuItem value='Task'>
                                                <Image
                                                    name='Task.png'
                                                    sx={{
                                                        width: 16,
                                                        height: 16,
                                                        mr: 1,
                                                    }}
                                                />
                                                Task
                                            </MenuItem>
                                            <MenuItem value='Bug'>
                                                <Image
                                                    name='bug.png'
                                                    sx={{
                                                        width: 16,
                                                        height: 16,
                                                        mr: 1,
                                                    }}
                                                />
                                                Bug
                                            </MenuItem>
                                            <MenuItem value='Subtask'>
                                                <Image
                                                    name='subTask.png'
                                                    sx={{
                                                        width: 16,
                                                        height: 16,
                                                        mr: 1,
                                                    }}
                                                />
                                                Subtask
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 2 }}>
                        <Button
                            variant='contained'
                            color='primary'
                            type='submit'>
                            Submit
                        </Button>
                    </Box>
                </form>
            </Card>
        </>
    );
};

export default CreateIssues;

//  <Dialog
//                 open={confirmDeleteDialogOpen}
//                 onClose={handleCancelDelete}
//                 aria-labelledby='alert-dialog-title'
//                 aria-describedby='alert-dialog-description'>
//                 <DialogTitle id='alert-dialog-title'>
//                     Confirm Delete
//                 </DialogTitle>
//                 <DialogContent>
//                     <DialogContentText id='alert-dialog-description'>
//                         Are you sure you want to delete the Task
//                     </DialogContentText>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button
//                         onClick={handleCancelDelete}
//                         color='primary'
//                         style={{ color: 'white' }}>
//                         Cancel
//                     </Button>

//                     <Button
//                         variant='contained'
//                         onClick={handleConfirmDelete}
//                         disabled={deleteLoading}
//                         endIcon={
//                             deleteLoading && (
//                                 <CircularProgress
//                                     size='20px'
//                                     sx={{ color: 'inherit' }}
//                                 />
//                             )
//                         }
//                         style={{ backgroundColor: '#ff2121', border: 'none' }}
//                         autoFocus>
//                         Delete
//                     </Button>
//                 </DialogActions>
//             </Dialog>
{
    /* <Menu
anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'right',
}}
transformOrigin={{
    vertical: 'top',
    horizontal: 'right',
}}
anchorEl={anchorElSettings}
open={Boolean(anchorElSettings)}
onClose={closeSettingsMenu}>
<MenuItem
    onClick={() => {
        handleDeleteClick();
    }}>
    Delete
</MenuItem>
</Menu> */
}
