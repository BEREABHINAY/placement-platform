import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import LessonView from "./pages/LessonView";
import Tests from "./pages/Tests";
import TakeTest from "./pages/TakeTest";
import Certificates from "./pages/Certificates";
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import CompanyDashboard from "./pages/dashboards/CompanyDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import { meRequest } from "./api/authApi";
import { setLoading, setAuthenticated, setUnauthenticated } from "./store/authSlice";

export default function App() {
  const dispatch = useDispatch();

  // On first load, check if a valid session cookie already exists.
  useEffect(() => {
    dispatch(setLoading());
    meRequest()
      .then(({ data }) => dispatch(setAuthenticated(data.user)))
      .catch(() => dispatch(setUnauthenticated()));
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Every route below shares the persistent Navbar (back button, nav links, user menu) */}
      <Route element={<AppLayout />}>
        <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
        <Route path="/courses/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
        <Route path="/courses/:id/modules/:moduleId" element={<ProtectedRoute><LessonView /></ProtectedRoute>} />
        <Route path="/tests" element={<ProtectedRoute><Tests /></ProtectedRoute>} />
        <Route path="/tests/:id" element={<ProtectedRoute roles={["student"]}><TakeTest /></ProtectedRoute>} />
        <Route path="/certificates" element={<ProtectedRoute roles={["student"]}><Certificates /></ProtectedRoute>} />

        <Route path="/dashboard/student" element={
          <ProtectedRoute roles={["student"]}><StudentDashboard /></ProtectedRoute>
        } />
        <Route path="/dashboard/company" element={
          <ProtectedRoute roles={["company"]}><CompanyDashboard /></ProtectedRoute>
        } />
        <Route path="/dashboard/admin" element={
          <ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
}
