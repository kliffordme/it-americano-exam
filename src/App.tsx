import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import TodoList from './components/TodoList';
import TodoInput from './components/TodoInput';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

interface User {
  name: string;
  [key: string]: any;
}

interface UserRegistrationDetails {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ErrorResponse {
  message: string;
}

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_PROJECT_API}/users/me`, { withCredentials: true });
        setUser(response.data);
        getTodos(response.data.UserId)
      } catch (error) {
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  //test

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_PROJECT_API}/users/me`, { withCredentials: true });
      setUser(response.data);
      getTodos(response.data.UserId)
    } catch (error) {
      setUser(null);
    }
  };

  const handleLogin = async (e:any) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_PROJECT_API}/users/login`, {
        email: email,
        password: password
      },  { withCredentials: true });

      if (response.data && response.data.auth) {
        // After successful login, refresh the auth status
        checkAuth();
      }
    } catch (error) {
      console.log(error);
      alert('Login failed');
    }
  };

  // Replace this with actual registration logic
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const userDetails: UserRegistrationDetails = { name, email, password, confirmPassword };

    try {
      const register = await axios.post(`${process.env.REACT_APP_PROJECT_API}/users`, userDetails)
      alert('Registration form submitted, try logging in now');
    } catch (error) {
      const axiosError = error as AxiosError; // Type cast error as AxiosError

        const errorResponse = axiosError.response?.data as ErrorResponse;
      
        if (axiosError.response) {
          switch (axiosError.response.status) {
            case 400:
              setError(errorResponse?.message || 'Passwords do not match');
              break;
            case 401:
              setError(errorResponse?.message || 'Unauthorized: The client must authenticate itself to get the requested response.');
              break;
            case 500:
              setError(errorResponse?.message || 'Internal Server Error: The server has encountered a situation it doesn\'t know how to handle.');
              break;
            default:
              setError(`An error occurred: ${errorResponse?.message || 'Unknown error'}`);
          }
        } else {
          setError('Network error: Please check your internet connection or try again later.');
        }
    }
  };

  const getTodos = async (userId: string) => {
    try {
      const data = await axios.get(`${process.env.REACT_APP_PROJECT_API}/todos/${userId}`)
      setTodos(data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_PROJECT_API}/users/logout`, {}, { withCredentials: true });
      if (response.data && response.data.auth === false) {
        setUser(null);
        setTodos([]);
      }
    } catch (error) {
      console.log(error);
      alert('Logout failed');
    }
  };

  return (
    <Router>
      <div style={{width: '700px', height:'700px', margin: "50px auto", borderRadius:'10px', border: '1px solid lightblue', overflowY: 'auto', backgroundColor:'white'}}>
        <Routes>
          <Route path="/register" element={
            <div style={{width: '200px', margin: 'auto', paddingTop:'50px'}}>
              <form onSubmit={handleRegister}>
                <label>
                  <div>
                  Name:
                  </div>
                  <div  style={{paddingBottom: '14px'}}>
                  <input onChange={(e)=>setName(e.target.value)} style={{borderRadius:'5px', outline:'none', padding: '5px', marginTop:'5px'}} type="text" required placeholder='enter your name'/>
                  </div>
                </label>
                <label>
                  <div>
                  Email:
                  </div>
                  <div  style={{paddingBottom: '14px'}}>
                  <input onChange={(e)=>setEmail(e.target.value)} style={{borderRadius:'5px', outline:'none', padding: '5px', marginTop:'5px'}} type="email" required placeholder='enter your email'/>
                  </div>
                </label>
                <label>
                  <div>
                  Password:
                  </div>
                  <div  style={{paddingBottom: '14px'}}>
                  <input onChange={(e)=>setPassword(e.target.value)} style={{borderRadius:'5px', outline:'none', padding: '5px', marginTop:'5px'}} type="password" required placeholder='enter your password' />
                  </div>
                </label>
                <label>
                  <div>
                  Confirm Password:
                  </div>
                  <div  style={{paddingBottom: '14px'}}>
                  <input onChange={(e)=>setConfirmPassword(e.target.value)} style={{borderRadius:'5px', outline:'none', padding: '5px', marginTop:'5px'}} type="password" required placeholder='confirm your password' />
                  </div>
                </label>
                <button type="submit" style={{color: 'white', backgroundColor:'grey', padding: '2px 20px', borderRadius:'4px', cursor:'pointer'}}>Register</button>
              </form>
              <p>Already have an account? <Link to="/login">Login</Link></p>
              {error && <p>{error}</p>}

            </div>
          }/>
          <Route path="/login" element={
            !user ? (
              <div style={{width: '200px', margin: 'auto', paddingTop:'50px'}}>
              <form onSubmit={handleLogin}>
              <label>
                  <div>
                  Email:
                  </div>
                  <div  style={{paddingBottom: '14px'}}>
                  <input onChange={(e)=>setEmail(e.target.value)} style={{borderRadius:'5px', outline:'none', padding: '5px', marginTop:'5px'}} type="email" required placeholder='enter your email'/>
                  </div>
                </label>
                <label>
                  <div>
                  Password:
                  </div>
                  <div  style={{paddingBottom: '14px'}}>
                  <input onChange={(e)=>setPassword(e.target.value)} style={{borderRadius:'5px', outline:'none', padding: '5px', marginTop:'5px'}} type="password" required placeholder='enter your password' />
                  </div>
                </label>
                  <button type="submit" style={{color: 'white', backgroundColor:'grey', padding: '2px 20px', borderRadius:'4px', cursor:'pointer'}}>Login</button>
                </form>
                <p>Don't have an account? <Link to="/register">Register</Link></p>
              </div>
            ) : (
              <div style={{margin:"20px auto"}}>
                <div style={{display: 'flex', justifyContent:'flex-end', paddingRight: '40px'}}>
                  <button onClick={handleLogout}>Logout</button>
                </div>
                <TodoInput userId={user.UserId} getTodos={getTodos}/>
                <TodoList todos={todos} getTodos={getTodos}/>
              </div>
            )
          }/>
          <Route path="/" element={
            user ? (
              <div style={{margin:"20px auto"}}>
                <div style={{display: 'flex', justifyContent:'flex-end', paddingRight: '40px'}}>
                  <button onClick={handleLogout}>Logout</button>
                </div>
                <TodoInput userId={user.UserId} getTodos={getTodos}/>
                <TodoList todos={todos} getTodos={getTodos}/>
              </div>
            ) : (
              <div style={{width: '350px', margin: 'auto', paddingTop:'50px'}}>
                <h1>FORD'S TODO APP</h1>
                <p>You are not logged in.</p>
                <p><Link to="/login">Login</Link> or <Link to="/register">Register</Link></p>
              </div>
            )
          }/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;