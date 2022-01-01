import React, {Suspense} from 'react';
import './App.css';
  import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
const Login = React.lazy(() => import('./components/login/login'));
const SignUp = React.lazy(() => import('./components/signup/signup'));
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/signup" element={
            <Suspense fallback={<div>Loading...</div>}>
              <SignUp/>
            </Suspense>
          }/>
          <Route path="/login" element={
            <Suspense fallback={<div>Loading...</div>}>
              <Login/>
            </Suspense>
          }/>
          <Route path="/" element={<>
            testing
          </>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
