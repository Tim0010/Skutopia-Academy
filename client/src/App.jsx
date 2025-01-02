import { ClerkProvider } from "@clerk/clerk-react";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/error-boundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";

// Public Pages
import HomePage from "@/pages/home";
import AboutPage from "@/pages/about";
import CourseCatalogPage from "@/pages/courses-catalog";
import ScholarshipsPage from "@/pages/scholarships";
import ContactPage from "@/pages/contact";
import CareerGuidancePage from "@/pages/career-guidance";

// Student Pages
import StudentHomePage from "@/pages/student/home";
import StudentViewCoursesPage from "@/pages/student/courses";
import StudentViewCourseDetailsPage from "@/pages/student/course-details";
import StudentCoursesPage from "@/pages/student/my-courses";
import StudentViewCourseProgressPage from "@/pages/student/course-progress";
import StudentLearningHubPage from "@/pages/student/learning-hub";
import StudentToolsPage from "@/pages/student/tools";
import StudentAssessmentPage from "@/pages/student/assessment";
import StudentCommunityPage from "@/pages/student/community";

// Parent Pages
import ParentDashboardPage from "@/pages/parent/dashboard";
import ParentChildProgressPage from "@/pages/parent/child-progress";
import ParentResourcesPage from "@/pages/parent/resources";
import ParentCommunicationPage from "@/pages/parent/communication";

// Instructor Pages
import InstructorDashboardPage from "@/pages/instructor/dashboard";
import InstructorClassManagementPage from "@/pages/instructor/class-management";
import InstructorContentCreationPage from "@/pages/instructor/content-creation";
import InstructorAnalyticsPage from "@/pages/instructor/analytics";
import AddNewCoursePage from "@/pages/instructor/add-new-course";

// Support Pages
import HelpCenterPage from "@/pages/support/help-center";
import ResourceCenterPage from "@/pages/support/resource-center";
import FAQPage from "@/pages/support/faq";
import TutorialsPage from "@/pages/support/tutorials";

// Auth & Other Pages
import PaypalPaymentReturnPage from "@/pages/payment/return";
import NotFoundPage from "@/pages/404";

// Components
import { ProtectedRoute } from "@/components/auth/protected-route";
import StudentViewCommonLayout from "@/components/layouts/student-view-common-layout";
import ParentViewCommonLayout from "@/components/layouts/parent-view-common-layout";
import InstructorViewCommonLayout from "@/components/layouts/instructor-view-common-layout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider publishableKey={clerkPubKey}>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/courses-catalog" element={<CourseCatalogPage />} />
                  <Route path="/scholarships" element={<ScholarshipsPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/career-guidance" element={<CareerGuidancePage />} />

                  {/* Student Routes */}
                  <Route element={<StudentViewCommonLayout />}>
                    <Route
                      path="/home"
                      element={
                        <ProtectedRoute allowedRoles={["student"]}>
                          <StudentHomePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/learning-hub"
                      element={
                        <ProtectedRoute allowedRoles={["student"]}>
                          <StudentLearningHubPage />
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
                      path="/my-courses"
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
                    <Route
                      path="/tools"
                      element={
                        <ProtectedRoute allowedRoles={["student"]}>
                          <StudentToolsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/assessment"
                      element={
                        <ProtectedRoute allowedRoles={["student"]}>
                          <StudentAssessmentPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/community"
                      element={
                        <ProtectedRoute allowedRoles={["student"]}>
                          <StudentCommunityPage />
                        </ProtectedRoute>
                      }
                    />
                  </Route>

                  {/* Parent Routes */}
                  <Route element={<ParentViewCommonLayout />}>
                    <Route
                      path="/parent"
                      element={
                        <ProtectedRoute allowedRoles={["parent"]}>
                          <ParentDashboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/parent/child-progress"
                      element={
                        <ProtectedRoute allowedRoles={["parent"]}>
                          <ParentChildProgressPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/parent/resources"
                      element={
                        <ProtectedRoute allowedRoles={["parent"]}>
                          <ParentResourcesPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/parent/communication"
                      element={
                        <ProtectedRoute allowedRoles={["parent"]}>
                          <ParentCommunicationPage />
                        </ProtectedRoute>
                      }
                    />
                  </Route>

                  {/* Instructor Routes */}
                  <Route element={<InstructorViewCommonLayout />}>
                    <Route
                      path="/instructor"
                      element={
                        <ProtectedRoute allowedRoles={["instructor"]}>
                          <InstructorDashboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/instructor/class-management"
                      element={
                        <ProtectedRoute allowedRoles={["instructor"]}>
                          <InstructorClassManagementPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/instructor/content-creation"
                      element={
                        <ProtectedRoute allowedRoles={["instructor"]}>
                          <InstructorContentCreationPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/instructor/analytics"
                      element={
                        <ProtectedRoute allowedRoles={["instructor"]}>
                          <InstructorAnalyticsPage />
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
                  </Route>

                  {/* Support Routes */}
                  <Route path="/help" element={<HelpCenterPage />} />
                  <Route path="/resources" element={<ResourceCenterPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/tutorials" element={<TutorialsPage />} />

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
              </main>
              <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
        </ClerkProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;