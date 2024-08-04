import {
    Grid,
    Modal,
    FormControl,
    MenuItem,
    Stack,
    Box,
    Typography,
    CircularProgress,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import BoardColumns from './BoardColumns';
import { useParams, useSearchParams } from 'react-router-dom';
import { Select } from '../../../components/Select';
import Search from '../../../components/Search';
import { useMessage } from '../../../providers/Provider';
import { useProjectId } from '../../../providers/ProjectProvider';
import axiosInstance from '../../../utilities/axios';

const statuses = ['Backlog', 'To Do', 'In Progress', 'Review', 'Done'];
const priorities = ['Lowest', 'Low', 'Medium', 'High', 'Highest'];
const types = ['Task', 'Bug'];

const Index = props => {
    const { members } = props;
    const [searchParams, setSearchParams] = useSearchParams();
    const [openIssue, setOpenIssue] = useState(
        Boolean(searchParams.get('issues'))
    );
    const [issueList, setIssueList] = useState({});
    const projectId = localStorage.getItem('selectedProject');
    const { showError } = useMessage();
    const [query, setQuery] = useState({
        assignee: '',
        priority: '',
        type: '',
        search: '',
    });

    const handleChangeQuery = e => {
        const name = e.target.name;
        const value = e.target.value;
        setQuery({ ...query, [name]: value });
    };

    const onDragEnd = result => {
        const { source, destination } = result;
        if (!destination) return;

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        )
            return;

        const updatedIssues = Array.from(issueList[source.droppableId]);
        const [movedIssue] = updatedIssues.splice(source.index, 1);
        movedIssue.status = destination.droppableId;
        issueList[destination.droppableId].splice(
            destination.index,
            0,
            movedIssue
        );

        setIssueList({ ...issueList });
        // UpdateIssues(destination.droppableId, movedIssue._id); // Uncomment this to update the backend
    };

    const fetchIssues = useCallback(async () => {
        try {
            const response = await axiosInstance.get(
                `/api/projects/${projectId}/issues/`
            );

            const issuesList = {};
            for (const status of statuses) {
                issuesList[status] = [];
            }

            for (const issue of response.data) {
                issuesList[issue.status].push(issue);
            }

            console.log(issueList);
            setIssueList(issuesList);
            console.log(issueList);
        } catch (e) {
            console.log(e);
            showError('Failed to fetch issues');
        }
    }, [setIssueList, projectId, showError]);

    useEffect(() => {
        fetchIssues();
    }, [fetchIssues]);

    return (
        <Box>
            <Stack
                my={2}
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent='space-between'
                px={2}>
                <Search
                    placeholder='Search this board'
                    sx={{ height: '35px', width: '100%' }}
                    value={query.search}
                    onChange={e =>
                        setQuery({ ...query, search: e.target.value })
                    }
                />
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    sx={{ mt: { xs: 2, sm: 0 } }}
                    spacing={2}
                    mb={1}
                    justifyContent='space-between'>
                    <FormControl size='small'>
                        <Select
                            sx={{
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                paddingTop: '0px',
                                paddingBottom: '0px',
                                width: '100%',
                            }}
                            value={query.assignee}
                            name='assignee'
                            displayEmpty
                            onChange={handleChangeQuery}
                            filter={members[query.assignee]?.fullName}
                            clear={() => setQuery({ ...query, assignee: '' })}
                            renderValue={v => {
                                if (!query.assignee) return 'Assignee';
                                return members[v]?.fullName;
                            }}>
                            {Object.keys(members).map(member => (
                                <MenuItem key={member} value={member}>
                                    {members[member]?.fullName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl size='small'>
                        <Select
                            sx={{
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                paddingTop: '0px',
                                paddingBottom: '0px',
                                width: '100%',
                            }}
                            value={query.priority}
                            name='priority'
                            displayEmpty
                            onChange={handleChangeQuery}
                            filter={query.priority}
                            clear={() => setQuery({ ...query, priority: '' })}
                            renderValue={v => {
                                if (!query.priority) return 'Priority';
                                return v;
                            }}>
                            {priorities.map(priority => (
                                <MenuItem key={priority} value={priority}>
                                    {priority}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl size='small'>
                        <Select
                            sx={{
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: 500,
                                width: '100%',
                                cursor: 'pointer',
                                paddingTop: '0px',
                                paddingBottom: '0px',
                            }}
                            value={query.type}
                            name='type'
                            displayEmpty
                            onChange={handleChangeQuery}
                            filter={query.type}
                            clear={() => setQuery({ ...query, type: '' })}
                            renderValue={v => {
                                if (!query.type) return 'Issue Type';
                                return v;
                            }}>
                            {types.map(type => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
            </Stack>
            <Box
                sx={{
                    height: {
                        xs: 'calc(100vh - 470px)',
                        sm: 'calc(100vh - 290px)',
                    },
                    overflow: 'auto',
                    px: 2,
                }}>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Grid
                        container
                        spacing={2}
                        mb={3}
                        flexWrap='nowrap'
                        sx={{
                            '&>.MuiGrid-item': {
                                flexBasis: '280px',
                                flexShrink: 0,
                            },
                        }}>
                        {statuses.map(status => (
                            <Grid
                                item
                                key={status}
                                lg={2.4}
                                md={4}
                                sm={6}
                                xs={12}>
                                <Droppable droppableId={status}>
                                    {provided => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            style={{ height: '100%' }}>
                                            <BoardColumns
                                                issueList={
                                                    issueList[status] || []
                                                }
                                                fetchIssues={fetchIssues}
                                                title={status}
                                            />
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </Grid>
                        ))}
                    </Grid>
                </DragDropContext>
                {Object.keys(issueList).length === 0 && (
                    <Box
                        display='flex'
                        justifyContent='center'
                        alignItems='center'
                        height='100%'>
                        <Typography variant='h6' color='textSecondary'>
                            No issues to display
                        </Typography>
                    </Box>
                )}
            </Box>
            {/* <Modal
                sx={{
                    overflowY: 'scroll',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                open={openIssue}
                onClose={() => setOpenIssue(false)}>
                Modal content
            </Modal> */}
        </Box>
    );
};

export default Index;
