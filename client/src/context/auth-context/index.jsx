import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService } from "@/services";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const navigate = useNavigate(); // Declare useNavigate here
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  async function apiHandler(apiCall, onSuccess, onError) {
    try {
      const data = await apiCall();
      if (data?.success) {
        onSuccess(data);
      } else {
        onError(data?.error || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("API Error:", error);
      onError(error?.message || "Unexpected error occurred.");
    }
  }

  function handleRegisterUser(event) {
    event.preventDefault();

    apiHandler(
      () => registerService(signUpFormData),
      (data) => {
        alert("Registration successful!");

        // Redirect the user to the sign-in page
        navigate("/sign-in");
      },
      (error) => {
        console.error("Registration failed:", error);
        alert(`Registration failed: ${error}`);
      }
    );
  }

  function handleLoginUser(event) {
    event.preventDefault();
  
    apiHandler(
      () => loginService(signInFormData),
      (data) => {
        sessionStorage.setItem(
          "accessToken",
          JSON.stringify(data.data?.accessToken)
        );
        setAuth({
          authenticate: true,
          user: data.data?.user,
        });
        alert("Login successful!");
  
        // Redirect based on user role
        const redirectPath = data.data?.user?.role === "instructor" ? "/instructor" : "/";
        navigate(redirectPath);
      },
      (error) => {
        console.error("Login failed:", error);
        alert(`Login failed: ${error}`);
        setAuth({
          authenticate: false,
          user: null,
        });
      }
    );
  }
  
  async function checkAuthUser() {
    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        setAuth({ authenticate: false, user: null });
        setLoading(false);
        return;
      }

      const data = await checkAuthService();
      if (data.success) {
        setAuth({ authenticate: true, user: data.data?.user });
      } else {
        setAuth({ authenticate: false, user: null });
        sessionStorage.removeItem("accessToken");
      }
    } catch (error) {
      console.error("Error during auth check:", error);
      setAuth({ authenticate: false, user: null });
      sessionStorage.removeItem("accessToken");
    } finally {
      setLoading(false);
    }
  }

  function resetCredentials() {
    sessionStorage.removeItem("accessToken");
    setAuth({
      authenticate: false,
      user: null,
    });
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        auth,
        resetCredentials,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}
