import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isLoaded, isSignedIn, user } = useUser();

  // Show loading state
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // Not signed in
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  // Check roles if specified
  if (allowedRoles.length > 0) {
    const userRole = user.publicMetadata.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
