import {
    Avatar,
    Box,
    Button,
    Card,
    CircularProgress,
    IconButton,
    Skeleton,
    TextField,
    Tooltip,
    Typography,
    Modal,
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Draggable } from 'react-beautiful-dnd';
import ExpandCircleDownOutlinedIcon from '@mui/icons-material/ExpandCircleDownOutlined';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { handleAxiosError } from '../../../utilities/function';
import { useMessage } from '../../../providers/Provider';
import Image from '../../../components/Image'; // Ensure this component exists and is correctly imported
import { useSearchParams } from 'react-router-dom';
import { IssueType, Priority } from '../../../services/stickerColor';
import axiosInstance from '../../../utilities/axios';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import CreateIssues from './CreateIssues';

const BoardColumns = props => {
    const {
        fetchIssues,
        title,
        members,
        issues,

        fetchMoreIssue,
        loadMoreLoading,
        currentPage,
        issueList,
    } = props;

    const user = useAuthUser();
    const [searchParams, setSearchParams] = useSearchParams();
    const [projectState, setProjectState] = useState(false);
    const [createIssueState, setCreateIssueState] = useState(false);
    const [loading, setLoading] = useState(false);
    const [issueId, setIssueId] = useState(null);
    const [issueName, setIssueName] = useState('');
    const ProjectId = localStorage.getItem('selectedProject');

    const { showError, showSuccess } = useMessage();

    const openProject = t => {
        setProjectState(true);
        // setDeafultStatus(t);
    };

    const openIssueModal = id => {
        // const issue = issueList.find(issue => issue.id === id);
        // setSelectedIssue(issue);
        setProjectState(true);
    };
    const closeProject = () => setProjectState(false);

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosInstance.post(
                `/api/projects/${ProjectId}/issues/`,
                {
                    project: ProjectId,
                    name: issueName,
                    status: title,
                    reporter: user.id,
                    start_date: new Date().toISOString().split('T')[0],
                }
            );

            const { success, error } = response.data;
            if (!success) throw new Error(error);

            fetchIssues();
            showSuccess(success);
            setCreateIssueState(false);
        } catch (error) {
            handleAxiosError(error, showError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box height='100%'>
            <Card
                elevation={0}
                sx={{
                    bgcolor: 'background.default',
                    boxShadow: 'none',
                    borderRadius: '6px',
                    backgroundImage:
                        'linear-gradient(rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.04))',
                    height: '100%',
                    '&:hover': {
                        '#button': {
                            opacity: 1,
                        },
                    },
                }}>
                <Box
                    p={1.2}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                    <Typography
                        variant='caption'
                        sx={{
                            backgroundColor:
                                title === 'Done'
                                    ? 'lightGreen.light'
                                    : 'skyBlue.light',
                            fontWeight: 600,
                            color:
                                title === 'Done'
                                    ? 'lightGreen.dark'
                                    : 'skyBlue.dark',
                            px: 1,
                            py: 0.4,
                        }}>
                        {title}
                    </Typography>

                    <Typography
                        variant='caption'
                        sx={{
                            backgroundColor:
                                title === 'Done'
                                    ? 'lightGreen.light'
                                    : 'skyBlue.light',
                            color:
                                title === 'Done'
                                    ? 'lightGreen.dark'
                                    : 'skyBlue.dark',
                            fontWeight: 600,
                            px: 1,
                            py: 0.4,
                        }}>
                        {issueList?.filter(issue => issue.status === title)
                            .length || 0}
                    </Typography>
                </Box>

                <Box>
                    {issueList
                        ? issueList.map((issue, i) => (
                              <Draggable
                                  key={issue.id}
                                  draggableId={issue.id.toString()}
                                  index={i}>
                                  {provided => (
                                      <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}>
                                          <IssueCard
                                              issue={issue}
                                              openIssueModal={openIssueModal}
                                          />
                                      </div>
                                  )}
                              </Draggable>
                          ))
                        : Array(5)
                              .fill(5)
                              .map((_, i) => (
                                  <Card
                                      key={i}
                                      sx={{
                                          cursor: 'pointer',
                                          border: '1px solid',
                                          borderColor: 'transparent',
                                          backgroundImage: 'none',
                                          borderRadius: '6px',
                                          m: '5px',
                                          '&:hover': {
                                              background:
                                                  'rgba(255, 255, 255, 0.01)',
                                          },
                                      }}>
                                      <Box px={1} py={1}>
                                          <Box>
                                              <Skeleton width='100%' />
                                              <Skeleton width='90%' />
                                          </Box>
                                          <Box
                                              pt={2}
                                              display='flex'
                                              alignItems='center'
                                              justifyContent='space-between'>
                                              <Box
                                                  display='flex'
                                                  alignItems='center'>
                                                  <Skeleton
                                                      variant='circular'
                                                      width={20}
                                                      height={20}
                                                      sx={{ mr: 1 }}
                                                  />
                                              </Box>
                                              <Box
                                                  display='flex'
                                                  alignItems='center'>
                                                  <Skeleton
                                                      variant='circular'
                                                      width={20}
                                                      height={20}
                                                      sx={{ mr: 1 }}
                                                  />
                                                  <Skeleton
                                                      variant='circular'
                                                      width={20}
                                                      height={20}
                                                  />
                                              </Box>
                                          </Box>
                                      </Box>
                                  </Card>
                              ))}
                    {issues && issues.length >= 20 && (
                        <Button
                            id='button'
                            size='small'
                            disabled={
                                loadMoreLoading ||
                                issues.length ===
                                    issueList.filter(
                                        issue => issue.status === title
                                    ).length
                            }
                            endIcon={
                                loadMoreLoading ? (
                                    <CircularProgress
                                        size='20px'
                                        sx={{ color: 'inherit' }}
                                    />
                                ) : (
                                    <ExpandCircleDownOutlinedIcon fontSize='small' />
                                )
                            }
                            onClick={() =>
                                fetchMoreIssue(title, currentPage || 1)
                            }
                            fullWidth
                            sx={{ my: 0.3, opacity: 1 }}>
                            Load more
                        </Button>
                    )}
                    <form onSubmit={onSubmit}>
                        {createIssueState ? (
                            <Box
                                sx={{
                                    padding: '0px 2px 1.5px 2px',
                                    margin: 0,
                                }}>
                                <TextField
                                    name='name'
                                    placeholder='Enter title..'
                                    multiline
                                    maxRows={4}
                                    id='margin-none'
                                    margin='none'
                                    fullWidth
                                    value={issueName}
                                    onChange={e => setIssueName(e.target.value)}
                                />
                                <Box display='flex' justifyContent='end' mt={0}>
                                    <IconButton
                                        type='submit'
                                        sx={{
                                            mt: 0,
                                            width: 25,
                                            height: 25,
                                            backgroundColor:
                                                'background.default',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '4px',
                                            mr: 0.3,
                                        }}>
                                        {loading ? (
                                            <CircularProgress
                                                size={20}
                                                sx={{
                                                    color: 'inherit',
                                                    borderRadius: '50%',
                                                }}
                                            />
                                        ) : (
                                            <CheckIcon fontSize='small' />
                                        )}
                                    </IconButton>
                                    <IconButton
                                        onClick={() =>
                                            setCreateIssueState(false)
                                        }
                                        sx={{
                                            width: 25,
                                            height: 25,
                                            backgroundColor:
                                                'background.default',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '4px',
                                        }}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                        ) : (
                            <Button
                                id='button'
                                startIcon={<AddIcon fontSize='small' />}
                                size='small'
                                onClick={() => setCreateIssueState(true)}
                                fullWidth
                                sx={{ my: 0.3, opacity: 0 }}>
                                Create issues
                            </Button>
                        )}
                    </form>
                </Box>
            </Card>
            <Modal
                sx={{
                    overflowY: 'scroll',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                open={projectState}
                onClose={closeProject}>
                <>
                    <CreateIssues
                    // taskId={issueId}
                    // projectId={ProjectId}
                    // closeModal={closeProject}
                    // fetchIssues={fetchIssues}
                    // users={users}
                    />
                </>
            </Modal>
        </Box>
    );
};

export default BoardColumns;

const IssueCard = ({ issue, openIssueModal }) => {
    return (
        <Box
            sx={{
                padding: '0px 2px 1.5px 2px',
                margin: 0,
            }}>
            <Card
                onClick={() => openIssueModal(issue.id)}
                sx={{
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: 'transparent',
                    backgroundImage: 'none',
                    boxShadow:
                        'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',
                    m: 0.3,
                    borderRadius: '6px',

                    // minHeight: '110px',
                    '&:hover': {
                        backgroundColor: 'custom.cardHover',
                    },
                }}>
                <Box px={1} py={1}>
                    <Box
                        sx={{
                            maxWidth: '100%',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 4,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}>
                        <Typography variant='caption' color='text.tertiary'>
                            {issue.name}
                        </Typography>
                    </Box>
                    <Box
                        pt={2}
                        display='flex'
                        alignItems='center'
                        justifyContent='space-between'>
                        <Box display='flex' alignItems='center'>
                            <Tooltip
                                title={`${issue.issueType}`}
                                placement='bottom'>
                                <Box>
                                    <Image
                                        name={IssueType[issue.issueType]}
                                        sx={{
                                            width: 18,
                                            height: 18,
                                            mt: 1,
                                        }}
                                    />
                                </Box>
                            </Tooltip>
                        </Box>
                        <Box display='flex' alignItems='center'>
                            <Tooltip
                                title={`${issue.priority}`}
                                placement='bottom'>
                                <Box>
                                    <Image
                                        name={Priority[issue.priority]}
                                        sx={{ width: 16, height: 1, mt: 1 }}
                                    />
                                </Box>
                            </Tooltip>

                            <Tooltip
                                title={`${'Gaurav Gupta'}`}
                                placement='bottom'>
                                <Box>
                                    <Avatar
                                        sx={{
                                            ml: 1,
                                            width: 22,
                                            height: 22,
                                        }}
                                    />
                                </Box>
                            </Tooltip>
                        </Box>
                    </Box>
                </Box>
            </Card>
        </Box>
    );
};
