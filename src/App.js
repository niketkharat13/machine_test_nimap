import React, {Suspense} from 'react';
import './App.css';
  import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
// const Login =
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
          <Route path="/" element={<>
            testing
          </>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;