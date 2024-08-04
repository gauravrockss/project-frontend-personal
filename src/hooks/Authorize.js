// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { getCookie, setCookie } from '../utilities/cookies';
// import axios from 'axios';
// import Signup from '../pages/auth/Signup';
// import Loading from '../components/Loading';

// import axiosInstance from '../utilities/axios';
// import ProjectSelection from '../pages/Project/ProjectSelection';
// import Login from '../pages/auth/Login';

// const authorizeContext = createContext();

// const AuthorizationProvider = ({ children }) => {
//     const [content, setContent] = useState(<Loading />);
//     const [user, setUser] = useState({});
//     const [projectId, setProjectId] = useState(null);

//     const authorize = (loggedIn, cb) => {
//         if (loggedIn) {
//             // Check if a project is selected in local storage
//             const selectedProject = localStorage.getItem('selectedProject');
//             if (selectedProject) {
//                 // Redirect to the application content
//                 setContent(children);
//             } else {
//                 // Redirect to project selection page
//                 setContent(<ProjectSelection />);
//             }
//         } else {
//             setContent(<Signup />);
//         }
//         if (typeof cb === 'function') cb(setUser);
//     };

//     useEffect(() => {
//         (async () => {
//             try {
//                 const token = getCookie('token');
//                 const projectId = localStorage.getItem('selectedProject');
//                 if (!token) throw new Error('Token not found');
//                 const response = await axiosInstance.get('/user/profile/', {
//                     headers: {
//                         Authorization: `token ${token}`,
//                     },
//                 });
//                 const user = response.data;
//                 setProjectId(projectId);
//                 authorize(true, setUser => setUser(user));
//             } catch (err) {
//                 authorize(false);
//             }
//         })();
//     }, []); // eslint-disable-line react-hooks/exhaustive-deps

//     const signup = async signupData => {
//         try {
//             await axios.post('/user/signup/', signupData);
//             setContent(<Login />);
//         } catch (error) {
//             console.error('Signup error:', error);
//         }
//     };

//     const login = async credentials => {
//         try {
//             const response = await axios.post(
//                 '/user/api-token-auth/',
//                 credentials
//             );
//             const { token } = response.data;
//             setCookie('token', token);
//             const userProfileResponse = await axios.get('/user/profile/', {
//                 headers: {
//                     Authorization: `token ${token}`,
//                 },
//             });
//             const user = userProfileResponse.data;
//             setUser(user);
//             // Check if a project is selected in local storage
//             const selectedProject = localStorage.getItem('selectedProject');
//             if (selectedProject) {
//                 setContent(children);
//             } else {
//                 setContent(<ProjectSelection />);
//             }
//         } catch (error) {
//             console.error('Login error:', error);
//         }
//     };

//     return (
//         <authorizeContext.Provider
//             value={{
//                 authorize,
//                 setUser,
//                 login,
//                 user,
//                 signup,
//                 handleProjectSelection,
//                 projectId,
//             }}>
//             {content}
//         </authorizeContext.Provider>
//     );
// };

// const useAuthorize = () => useContext(authorizeContext).authorize;
// const useUser = () => useContext(authorizeContext).user;
// const useProjectId = () => useContext(authorizeContext).projectId;
// const useSetUser = () => useContext(authorizeContext).setUser;
// const useSignup = () => useContext(authorizeContext).signup;
// const useLogin = () => useContext(authorizeContext)?.login;
// const useHandleProjectSelection = () =>
//     useContext(authorizeContext).handleProjectSelection;

// export default AuthorizationProvider;
// export {
//     useAuthorize,
//     useUser,
//     useSetUser,
//     useSignup,
//     useLogin,
//     useHandleProjectSelection,
//     useProjectId,
// };
