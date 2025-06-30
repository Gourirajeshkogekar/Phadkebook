import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // to show loading state while waiting for the response
  const [userId, setUserId] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Track visibility of the password
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      setRememberMe(true); // Mark the "Remember Me" checkbox as checked
    }
  }, []);

  const navigate = useNavigate();

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;
    if (!username) {
      formErrors.username = "Username is required";
    }
    if (!password) {
      formErrors.password = "Password is required";
    } else if (!/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(password)) {
      formErrors.password =
        "Password must contain Alphabets, Numbers and a special character";
    }
    setErrors(formErrors);
    return isValid;
  };

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   if (!validateForm()) return;

  //   setLoading(true);
  //   try {
  //     const response = await fetch(
  //       `https://publication.microtechsolutions.co.in/php/Usernameget.php?Name=${username}&Password=${password}`
  //     );
  //     const data = await response.json();
  //     console.log('API Response:', data);

  //     if (data.UserId) {
  //       sessionStorage.setItem("UserId", data.UserId);
  //       sessionStorage.setItem("Name", username); // Assuming the Name is the same as the username
  //       console.log('UserId set in sessionStorage:', data.UserId);  // Verify sessionStorage
  //       toast.success(data.message);

  //         // Store username in localStorage if "Remember Me" is checked
  //     if (rememberMe) {
  //       localStorage.setItem('username', username); // Only store the username
  //     } else {
  //       localStorage.removeItem('username'); // Remove it if not checked
  //     }
  //       navigate('/dashboard');
  //     }else {
  //       // If UserId is not returned, display the backend message (or a default message if none exists)
  //       toast.error(data.error );
  //     }
  //   } catch (error) {
  //     console.error("Login API error:", error);
  //     toast.error("An error occurred. Please try again later.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://publication.microtechsolutions.net.in/php/Usernameget.php?Name=${username}&Password=${password}`
      );
      const data = await response.json();
      console.log("API Response:", data);

      if (data.Id) {
        sessionStorage.setItem("UserId", data.Id);
        sessionStorage.setItem("Name", username); // Assuming the Name is the same as the username
        console.log("UserId set in sessionStorage:", data.Id); // Verify sessionStorage
        toast.success(data.message);

        // Store username in localStorage if "Remember Me" is checked
        if (rememberMe) {
          localStorage.setItem("username", username); // Only store the username
        } else {
          localStorage.removeItem("username"); // Remove it if not checked
        }

        // navigate('/dashboard');
        navigate("/coverpage");
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Login API error:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <h5 style={{ fontSize: "20px", color: "Highlight" }}>
          Login To Phadke Prakashan
        </h5>

        <div className="login-form">
          <div>
            <label className="login-label">
              Username<b className="required">*</b>
            </label>
            <div>
              <TextField
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="login-control"
                placeholder="Enter Username"
              />
            </div>
            <div>
              {errors.username && (
                <div className="error-text">{errors.username}</div>
              )}
            </div>
          </div>

          <div className="login-input-container">
            <label className="login-label">
              Password<b className="required">*</b>
            </label>
            <div>
              <TextField
                id="password"
                name="password"
                type={showPassword ? "text" : "password"} // Toggle password visibility
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-control"
                placeholder="Enter Password"
                // variant="outlined"
                // style={{marginTop:'20px'}}
                // fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div>
              {errors.password && (
                <div className="error-text">{errors.password}</div>
              )}
            </div>
          </div>

          <div className="login-checkbox-container">
            <label>
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember Me
            </label>
          </div>

          <div className="login-btn-container">
            <Button
              onClick={handleLogin}
              style={{ color: "#fff", backgroundColor: "#0a60bd" }}
              className="login-btn"
              disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Login"}
            </Button>
          </div>
        </div>

        {errors.api && <div className="error-text">{errors.api}</div>}
        <ToastContainer />
      </div>
    </div>
  );
}

export default Login;

// import React, { useState, useEffect } from "react";
// import './Login.css'
// import { Link, useNavigate } from 'react-router-dom';
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { CiFacebook, CiTwitter, CiInstagram, } from "react-icons/ci";
// import logo from './book.jpg';
// import { ToastContainer, toast } from 'react-toastify';
// import { Button } from "@mui/material";

// const Login = () => {

//   const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [errors, setErrors] = useState({});
//     const [loading, setLoading] = useState(false); // to show loading state while waiting for the response
//   const [userId, setUserId] = useState('');
//   const [showPassword, setShowPassword] = useState(false); // Track visibility of the password
//   const [rememberMe, setRememberMe] = useState(false);

//   useEffect(() => {
//     const storedUsername = localStorage.getItem('username');
//     if (storedUsername) {
//       setUsername(storedUsername);
//       setRememberMe(true);  // Mark the "Remember Me" checkbox as checked
//     }
//   }, []);

//     const navigate = useNavigate();

//     const validateForm = () => {
//       let formErrors = {};
//       let isValid = true;
//       if (!username) {
//         formErrors.username = 'Username is required';
//       }
//       if (!password) {
//         formErrors.password = 'Password is required';
//       } else if (!/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(password)) {
//         formErrors.password = 'Password must contain Alphabets, Numbers and a special character';
//       }
//       setErrors(formErrors);
//       return isValid;
//     };

//   //   // const handleLogin = async (e) => {
//   //   //   e.preventDefault();
//   //   //   if (!validateForm()) return;

//   //   //   setLoading(true);
//   //   //   try {
//   //   //     const response = await fetch(
//   //   //       `https://publication.microtechsolutions.co.in/php/Usernameget.php?Name=${username}&Password=${password}`
//   //   //     );
//   //   //     const data = await response.json();
//   //   //     console.log('API Response:', data);

//   //   //     if (data.UserId) {
//   //   //       sessionStorage.setItem("UserId", data.UserId);
//   //   //       sessionStorage.setItem("Name", username); // Assuming the Name is the same as the username
//   //   //       console.log('UserId set in sessionStorage:', data.UserId);  // Verify sessionStorage
//   //   //       toast.success(data.message);

//   //   //         // Store username in localStorage if "Remember Me" is checked
//   //   //     if (rememberMe) {
//   //   //       localStorage.setItem('username', username); // Only store the username
//   //   //     } else {
//   //   //       localStorage.removeItem('username'); // Remove it if not checked
//   //   //     }
//   //   //       navigate('/dashboard');
//   //   //     }else {
//   //   //       // If UserId is not returned, display the backend message (or a default message if none exists)
//   //   //       toast.error(data.error );
//   //   //     }
//   //   //   } catch (error) {
//   //   //     console.error("Login API error:", error);
//   //   //     toast.error("An error occurred. Please try again later.");
//   //   //   } finally {
//   //   //     setLoading(false);
//   //   //   }
//   //   // };

//     const handleLogin = async (e) => {
//       e.preventDefault();
//       if (!validateForm()) return;

//       setLoading(true);
//       try {
//         const response = await fetch(
//           `https://publication.microtechsolutions.co.in/php/Usernameget.php?Name=${username}&Password=${password}`
//         );
//         const data = await response.json();
//         console.log('API Response:', data);

//         if (data.UserId) {
//           sessionStorage.setItem("UserId", data.UserId);
//           sessionStorage.setItem("Name", username); // Assuming the Name is the same as the username
//           console.log('UserId set in sessionStorage:', data.UserId);  // Verify sessionStorage
//           toast.success(data.message);

//           // Store username in localStorage if "Remember Me" is checked
//           if (rememberMe) {
//             localStorage.setItem('username', username); // Only store the username
//           } else {
//             localStorage.removeItem('username'); // Remove it if not checked
//           }

//           // navigate('/dashboard');
//           navigate('/coverpage')
//         } else {
//           toast.error(data.error);
//         }
//       } catch (error) {
//         console.error("Login API error:", error);
//         toast.error("An error occurred. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     return (
//         <>
//             <div>
//                 <div className='adminlogin-container'>
//                     <div className='company-info'>

//                         <div className="logo">
//                             <img src={logo} alt="" />
//                         </div>

//                         <div className="social-icons">
//                             <CiTwitter className="sicon" />
//                             <CiFacebook className="sicon" />
//                             <CiInstagram className="sicon" />
//                         </div>

//                     </div>

//                     <div className='login-container'>
//                         <form autoComplete="off" className='login-form'>
//                             <h2>LOGIN</h2>
//                             <label htmlFor="email">Username</label>
//                             <input
//                                 id="username"
//                                 name="username"
//                                 type="text"
//                                 value={username}
//                                 onChange={(e)=>setUsername(e.target.value)}
//                                 className='login-control'
//                                 placeholder="Enter your email"
//                             />

//                             <label htmlFor="password">Password</label>
//                             <div className="password-container">
//                                 <input

//                                     id="password"
//                                     name="password" value={password}
//                                     type={showPassword ? "text" : "password"}
//                                     onChange={(e)=>setPassword(e.target.value)}
//                                     className="login-control"
//                                     placeholder="Enter your password"
//                                 />
//                                 <div className="showpass" onClick={() => setShowPassword(!showPassword)}>
//                                     {!showPassword ? <FaEyeSlash className="eye-icon" /> : <FaEye className="eye-icon" />}
//                                 </div>
//                             </div>

//                             <Button style={{ margin: '0 auto' }} type="submit" className="loginformbtn" onClick={handleLogin}>
//                                 LOGIN
//                             </Button>

//                         </form>
//                     </div>

//                 </div>

//             </div>

//         </>

//     )
// }

// export default Login
