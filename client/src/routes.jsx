import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/protected-route";
import HomePage from "@/pages/home";
import ScholarshipsPage from "@/pages/scholarships";
import InstructorDashboardPage from "@/pages/instructor/dashboard";
import AddNewCoursePage from "@/pages/instructor/add-new-course";
import StudentHomePage from "@/pages/student/home";
import StudentViewCoursesPage from "@/pages/student/courses";
import StudentViewCourseDetailsPage from "@/pages/student/course-details";
import StudentCoursesPage from "@/pages/student/my-courses";
import StudentViewCourseProgressPage from "@/pages/student/course-progress";
import PaypalPaymentReturnPage from "@/pages/payment/return";
import NotFoundPage from "@/pages/404";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/scholarships" element={<ScholarshipsPage />} />

      {/* Instructor Routes */}
      <Route
        path="/instructor"
        element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <InstructorDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/create-new-course"
        element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <AddNewCoursePage />
          </ProtectedRoute>
        }
      />

      {/* Student Routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentHomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentViewCoursesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/course/details/:id"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentViewCourseDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student-courses"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentCoursesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/course-progress/:courseId"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentViewCourseProgressPage />
          </ProtectedRoute>
        }
      />

      {/* Payment Routes */}
      <Route
        path="/payment/return"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <PaypalPaymentReturnPage />
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
