import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/common/Navbar';
import Signup from './pages/Signup';
import Login from './pages/Login';
import OpenRoute from './components/core/Auth/OpenRoute';
import VerifyEmail from './pages/verifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/updatePassword';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/core/Auth/CloseRoute';
import { ACCOUNT_TYPE } from "./utils/constants";
import Contact from './pages/Contact';
import MyProfile from './components/core/Dashboard/My-Profile'
import Error from './pages/Error';
import Settings from './components/core/Dashboard/Settings'
import Cart from './components/core/Dashboard/Cart'
import EnrolledCourses from './components/core/Dashboard/EnrolledCourses'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from './reducers/reducer';
import AddCourse from './components/core/Dashboard/AddCourse';
import MyCourses from './components/core/Dashboard/MyCourses';
import EditCourse from './components/core/Dashboard/EditCourse';
import Catalog from './pages/Catalog';
import CourseDetails from './pages/CourseDetails';



function App() {


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state : RootState) => state.profile);

  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar/>
      <Routes>


        <Route path="/" element={<Home/>} />

        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />

        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />

        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />

        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />

        <Route
          path="resetPassword/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />


        <Route
          path="/about"
          element={
            <About/>
          }
        />

        <Route
          path="/contact"
          element={
            <Contact/>
          }
        />

        <Route 
          path="catalog/:catalogName" 
          element={
            <Catalog />
          } 
        />

        <Route 
          path="courses/:courseId" 
          element={
            <CourseDetails />
          } 
        />   


        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard/>
            </PrivateRoute>   
          }
        >

          <Route path="/dashboard/my-profile" element={<MyProfile />} />
          <Route path="/dashboard/Settings" element={<Settings />} />


          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route path="/dashboard/cart" element={<Cart />} />
              <Route path="/dashboard/enrolled-courses" element={<EnrolledCourses />}/>
            </>
          )}

          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="/dashboard/add-course" element={<AddCourse />} />
              <Route path="/dashboard/my-courses" element={<MyCourses />} />
              <Route path="/dashboard/edit-course/:courseId"element={<EditCourse />} />
            </>
          )}

          <Route path="*" element={<Error/>} />

        </Route>



      </Routes>
    </div>
  );
}

export default App;
