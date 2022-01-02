import React, {Suspense, useState, useEffect} from 'react';
import './App.css';
  import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
const Login = React.lazy(() => import('./components/login/login'));
const SignUp = React.lazy(() => import('./components/signup/signup'));
const User = React.lazy(() => import('./components/User/User'));
const Task = React.lazy(() => import('./components/Task/Task'));
const Home = React.lazy(() => import('./components/Home/home'));
let CryptoJS = require("crypto-js");
const bcrypt = require('bcryptjs');
function App() {
  const [loggedInUser, setIsLoggedInUSer] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    try {
      if (loggedInUser == null) {
        let userCookie = document.cookie.split('; ').filter(row => row.startsWith("logged_in_user"));
        if (userCookie.length > 0) {
          let userDetails = JSON.parse(userCookie[0].split("logged_in_user=")[1]);
          console.log(userDetails, 'userDetails')
          setIsLoggedInUSer({
            ...userDetails,
            decryptedPassword: decryptPassword(userDetails.cp)
          })
          setIsLoggedIn(true);
        }
      }
    } catch (error) {
      console.log(error, 'error');
    }
    
  }, []);
  // console.log(loggedInUser, 'loggedInUser');
  console.log(isLoggedIn, 'isLoggedIn')
  const decryptPassword  = (cp) => {
    console.log(cp, 'cp');
    let bytes  = CryptoJS.AES.decrypt(cp, 'secret key 123');
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
  const encryptPassword = (pwd) => {
    let password = bcrypt.hashSync(pwd, bcrypt.genSaltSync());
    let cp = CryptoJS.AES.encrypt(JSON.stringify(pwd), 'secret key 123').toString();
    return {
      password,
      cp
    }
  }
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/signup" element={
            <Suspense fallback={<div>Loading...</div>}>
              <SignUp encryptPassword={encryptPassword} />
            </Suspense>
          }/>
          <Route path="/login" element={
            <Suspense fallback={<div>Loading...</div>}>
              <Login setIsLoggedInUSer={setIsLoggedInUSer} decryptPassword={decryptPassword} />
            </Suspense>
          }/>
          <Route path="/user" element={
            <Suspense fallback={<div>Loading...</div>}>
              <User loggedInUser={loggedInUser} encryptPassword={encryptPassword} />
            </Suspense>
          }/>
          <Route path="/task" element={
            <Suspense fallback={<div>Loading...</div>}>
              <Task userDetails={loggedInUser} />
            </Suspense>
          }/>
          <Route path="/home" element={
            <Suspense fallback={<div>Loading...</div>}>
              <Home userDetails={loggedInUser} />
            </Suspense>
          }/>
          {/* <Route path="/" element={<>
            testing
          </>}/> */}
        </Routes>
        {/* {
          !isLoggedIn ? <Navigate to='/login' /> : null
        } */}
      </div>
    </BrowserRouter>
  );
}

export default App;
