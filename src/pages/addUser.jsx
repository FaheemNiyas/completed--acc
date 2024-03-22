import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
<<<<<<< HEAD
import { FaUserShield, FaExclamationTriangle } from "react-icons/fa";
=======
import { FaUserShield } from "react-icons/fa";
>>>>>>> 93ede6f2a4ff650b8ef72d28f02bfdb6ba07e530
import "../styles/adduser.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

<<<<<<< HEAD
function AddUser() {
    // Insert data
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');

    // Authentication
    const [authUsername, setAuthUsername] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleAuthentication = () => {
        if (authUsername === 'admin' && authPassword === 'Admin@123') {
            setIsAuthenticated(true);
        } else {
            toast.error('Invalid credentials. Please try again!');
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            toast.success('Authentication successful!');
        }
    }, [isAuthenticated]);
=======

function AddUser() {

    //Insert data
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setrePassword] = useState();
>>>>>>> 93ede6f2a4ff650b8ef72d28f02bfdb6ba07e530

    const handleSubmit = (event) => {
        event.preventDefault();

<<<<<<< HEAD
        if (!isAuthenticated) {
            toast.error('Authentication required!');
            return;
        }

=======
>>>>>>> 93ede6f2a4ff650b8ef72d28f02bfdb6ba07e530
        const userData = {
            username: userName,
            email: email,
            password: password,
            repassword: rePassword
        };

        axios.post('http://localhost:3001/api/data', userData)
            .then(response => {
                console.log('User added successfully !!');
                toast.success('User added successfully!');
                setUserName('');
                setEmail('');
                setPassword('');
<<<<<<< HEAD
                setRePassword('');
=======
                setrePassword('');
>>>>>>> 93ede6f2a4ff650b8ef72d28f02bfdb6ba07e530
                axios.get('http://localhost:3001/api/data')
                    .then(response => {
                        setUsers(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching users', error);
                    });
            })
            .catch(error => {
                console.error('Error while adding user', error);
                toast.error('Failed to add user. Please try again!');
            });
    };

<<<<<<< HEAD
    // Retrieve data to the table from the db
=======
    //Retrive data to the table from the db
>>>>>>> 93ede6f2a4ff650b8ef72d28f02bfdb6ba07e530
    const [users, setUsers] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:3001/api/data')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching users', error);
            });
    }, []);

<<<<<<< HEAD
=======

>>>>>>> 93ede6f2a4ff650b8ef72d28f02bfdb6ba07e530
    // Delete the data from the database
    const handleDelete = (id) => {
        console.log('Deleting user with ID:', id);
        axios.delete(`http://localhost:3001/api/data/${id}`)
            .then(response => {
                console.log('User deleted successfully');
                toast.warning('User removed successfully!');
                setUsers(users.filter(user => user.id !== id));
            })
            .catch(error => {
                console.error('Error deleting user:', error);
            });
    };


<<<<<<< HEAD
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleAuthentication();
        }
    };

    const handleClearQuery = () => {
        const isConfirmed = window.confirm('All the running Balance will be deleted. Are you sure you want to delete all the running balance? ');

        if (isConfirmed) {
            clearRunningBalance();
        }
    };

    const clearRunningBalance = () => {
        // Make a DELETE request to your backend endpoint to clear running balance
        axios.delete('http://localhost:3001/api/clearRunningBalance')
            .then(response => {
                console.log('Running balance cleared successfully');
                toast.success('Running balance cleared successfully!');
                // Optionally, you can reload or update the data on the frontend
                // based on your application's requirements
            })
            .catch(error => {
                console.error('Error clearing running balance:', error);
                toast.error('Failed to clear running balance. Please try again!');
            });
    };

=======
>>>>>>> 93ede6f2a4ff650b8ef72d28f02bfdb6ba07e530
    return (
        <div className="container mt-1">
            <div className="">
                <div className="card">
                    <div className="card-body shadow p-5">
<<<<<<< HEAD
                        {!isAuthenticated ? (
                            <div className="authentication-popup">
                                <h3 className="pb-3 text-center">
                                    <ToastContainer />
                                    <FaUserShield className="adduser-icon" />
                                    <b className="p-2 ">AUTHENTICATION</b>
                                </h3>
                                <form>
                                    <div className="form-group">
                                        <input type="text" required className="form-control" value={authUsername} onChange={(e) => setAuthUsername(e.target.value)} placeholder="Username"  onKeyPress={handleKeyPress}/>
                                    </div>
                                    <div className="form-group">
                                        <input type="password" required className="form-control" value={authPassword} onChange={(e) =>  setAuthPassword(e.target.value)} placeholder="Password"  onKeyPress={handleKeyPress}/>
                                    </div>
                                    <div className="align-content-center d-flex justify-content-center pt-3">
                                        <button type="button" className="btn btn-outline-dark align-content-center" onClick={handleAuthentication}>Authenticate</button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <>
                                <button type="button" className="btn btn-outline-warning mr-2" onClick={handleClearQuery}>
                                    <FaExclamationTriangle className="mr-1" /> CLEAR RUNNING BALANCE
                                </button>
                                <h3 className="pb-3 text-center">
                                    <ToastContainer />
                                    <FaUserShield className="adduser-icon" />
                                    <b className="p-2 ">ADD USERS</b>
                                </h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <input type="text" required className="form-control" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="User Name" />
                                    </div>
                                    <div className="form-group">
                                        <input type="email" required className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                                    </div>
                                    <div className="form-group">
                                        <input type="password" required className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="password" required className="form-control" value={rePassword} onChange={(e) => setRePassword(e.target.value)} placeholder=" Re Enter Password"
                                        />
                                    </div>
                                    <div className="align-content-center d-flex justify-content-center pt-3">
                                        <button type="submit" className="btn btn-outline-dark align-content-center">Submit</button>
                                    </div>
                                </form>
                                <div className='mt-4'>
                                    <table className="table shadow text-center">
                                        <thead className="thead-dark">
                                            <tr>
                                                <th scope="col">NO</th>
                                                <th scope="col">NAME</th>
                                                <th scope="col">EMAIL</th>
                                                <th scope="col">PASSWORD</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user, index) => (
                                                <tr key={user.id}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td>{user.username}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.password}</td>
                                                    <td className='text-center'>
                                                        <button type="button" className="btn btn-outline-danger" onClick={() => handleDelete(user.id)}>Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                </div>
=======
                        <h3 className="pb-3 text-center">
                            <ToastContainer />
                            <FaUserShield className="adduser-icon" />
                            <b className="p-2 ">ADD USERS</b>
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input type="text" required className="form-control" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="User Name" />
                            </div>
                            <div className="form-group">
                                <input type="email" required className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                            </div>
                            <div className="form-group">
                                <input type="password" required className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                            </div>
                            <div className="form-group">
                                <input
                                    type="password" required className="form-control" value={rePassword} onChange={(e) => setrePassword(e.target.value)} placeholder=" Re Enter Password"
                                />
                            </div>
                            <div className="align-content-center d-flex justify-content-center pt-3">
                                <button type="submit" className="btn btn-outline-dark align-content-center">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className='mt-4'>
                    <table class="table shadow text-center">
                        <thead class="thead-dark">
                            <tr>
                                <th scope="col">NO</th>
                                <th scope="col">NAME</th>
                                <th scope="col">EMAIL</th>
                                <th scope="col">PASSWORD</th> 
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user.id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.password}</td>
                                    <td className='text-center'>
                                        <button type="button" className="btn btn-outline-danger" onClick={() => handleDelete(user.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
>>>>>>> 93ede6f2a4ff650b8ef72d28f02bfdb6ba07e530
            </div>
        </div>
    );
};

export default AddUser;