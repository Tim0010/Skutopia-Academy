import { Navigate, useLocation } from "react-router-dom";
import { Fragment } from "react";
import ForbiddenPage from "@/pages/forbidden";

// Centralized configuration for route access by role
const routeAccess = {
  instructor: ["/instructor", "/instructor/create-new-course", "/instructor/edit-course"],
  user: ["/", "/home", "/courses", "/course/details", "/student-courses", "/course-progress"],
};

// Default route for each role
const roleDefaultRoutes = {
  instructor: "/instructor",
  user: "/",
};

// Helper function to check if a user is authorized for a path
function checkRoleAccess(role, path) {
  return routeAccess[role]?.some((route) => path.startsWith(route));
}

// RouteGuard component
function RouteGuard({ authenticated, user, element }) {
  const location = useLocation();

  // 1. Loading state during authentication check
  if (authenticated === undefined || user === undefined) {
    return <div>Loading...</div>; // Replace with a proper loading spinner or skeleton
  }

  // 2. Redirect unauthenticated users to the auth page
  if (!authenticated && !location.pathname.includes("/auth")) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // 3. Redirect authenticated users away from auth pages
  if (authenticated && location.pathname.includes("/auth")) {
    const defaultRoute = roleDefaultRoutes[user.role];
    return <Navigate to={defaultRoute} replace />;
  }

  // 4. Role-based access control
  if (authenticated && user && !checkRoleAccess(user.role, location.pathname)) {
    // Optional: Uncomment to redirect unauthorized users to their default role route
    // return <Navigate to={roleDefaultRoutes[user.role]} replace />;
    
    // Optional: Show a 403 Forbidden page for unauthorized access
    return <ForbiddenPage />;
  }

  // 5. Allow access to authorized routes
  return <Fragment>{element}</Fragment>;
}

export default RouteGuard;
