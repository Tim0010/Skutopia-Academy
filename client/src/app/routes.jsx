import { createBrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "@/components/error/error-boundary";
import { RouteGuard } from "@/components/auth/route-guard";

// Layouts
import RootLayout from "@/layouts/root-layout";
import DashboardLayout from "@/layouts/dashboard-layout";

// Pages
import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import UnauthorizedPage from "@/pages/unauthorized";
import StudentDashboard from "@/pages/student/dashboard";
import ParentDashboard from "@/pages/parent/dashboard";
import InstructorDashboard from "@/pages/instructor/dashboard";
import CareerGuidance from "@/pages/career-guidance";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "unauthorized",
        element: <UnauthorizedPage />,
      },
      {
        path: "student",
        element: (
          <RouteGuard allowedRoles={["student"]}>
            <DashboardLayout />
          </RouteGuard>
        ),
        children: [
          {
            path: "dashboard",
            element: <StudentDashboard />,
          },
          {
            path: "career-guidance",
            element: <CareerGuidance />,
          },
          // Add more student routes here
        ],
      },
      {
        path: "parent",
        element: (
          <RouteGuard allowedRoles={["parent"]}>
            <DashboardLayout />
          </RouteGuard>
        ),
        children: [
          {
            path: "dashboard",
            element: <ParentDashboard />,
          },
          // Add more parent routes here
        ],
      },
      {
        path: "instructor",
        element: (
          <RouteGuard allowedRoles={["instructor"]}>
            <DashboardLayout />
          </RouteGuard>
        ),
        children: [
          {
            path: "dashboard",
            element: <InstructorDashboard />,
          },
          // Add more instructor routes here
        ],
      },
    ],
  },
]);
