import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
// import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
// import PersonIcon from '@mui/icons-material/Person';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import HomeIcon from '@mui/icons-material/HomeOutlined';

const fileManager = [
    {
        name: 'Dashboard',
        icon: <HomeIcon fontSize='small' />,
        to: '/',
    },
    {
        name: 'Projects',
        icon: <AssignmentOutlinedIcon fontSize='small' />,
        to: '/list-project',
    },

    // {
    //     name: 'Trash',
    //     icon: <DeleteOutlinedIcon fontSize='small' />,
    //     to: '/trash',
    // },
];

const yourWork = [
    {
        name: 'Your Work',
        icon: <WorkOutlineOutlinedIcon fontSize='small' />,
        to: '/your-work',
    },
    // {
    //     name: 'Team',
    //     icon: <PeopleIcon fontSize='small' />,
    //     to: '/team',
    // },
    // {
    //     name: 'Shared by me',
    //     icon: <PersonIcon fontSize='small' />,
    //     to: '/shared-by-me',
    // },
];

export { fileManager, yourWork };
