import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  TrendingUp,
  Calendar,
  Bell,
  BookOpen,
  Clock,
} from "lucide-react";
import { parentService } from "@/services/parent-service";
import { useRealTimeUpdates } from "@/hooks/useRealTimeUpdates";
import { useAsync } from "@/hooks/useAsync";
import { LoadingPage } from "@/components/ui/loading";
import { ErrorAlert, ErrorPage } from "@/components/ui/error";
import { useToast } from "@/components/ui/use-toast";

export default function ParentDashboard() {
  const { user } = useUser();
  const firstName = user?.firstName || "Parent";
  const { toast } = useToast();

  // Fetch dashboard data
  const {
    execute: fetchDashboardData,
    data: dashboardData,
    error: dashboardError,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
  } = useAsync(parentService.getDashboardData, true);

  // Setup real-time updates
  useRealTimeUpdates([
    {
      event: 'child.progress.update',
      callback: (data) => {
        if (dashboardData) {
          const updatedChildren = dashboardData.children.map(child => 
            child.id === data.childId 
              ? { ...child, ...data.updates }
              : child
          );
          dashboardData.children = updatedChildren;
        }
      },
    },
    {
      event: 'notification.new',
      callback: (notification) => {
        if (dashboardData) {
          dashboardData.notifications = [
            notification,
            ...dashboardData.notifications.slice(0, -1),
          ];
          toast({
            title: notification.title,
            description: notification.message,
          });
        }
      },
    },
  ]);

  // Handle errors
  if (isDashboardError) {
    return (
      <ErrorPage
        title="Dashboard Error"
        message="Failed to load dashboard data. Please try again."
        onRetry={fetchDashboardData}
      />
    );
  }

  // Handle loading
  if (isDashboardLoading || !dashboardData) {
    return <LoadingPage message="Loading dashboard..." />;
  }

  const { children, notifications } = dashboardData;

  return (
    <div className="p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {firstName}! 👋
          </h1>
          <p className="text-muted-foreground">
            Monitor your children's academic progress
          </p>
        </motion.div>
      </div>

      {/* Children Overview */}
      <div className="grid gap-6 mb-8">
        {children.map((child, index) => (
          <motion.div
            key={child.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{child.name}</h2>
                    <p className="text-muted-foreground">{child.grade}</p>
                  </div>
                  <div className="flex items-center mt-4 md:mt-0">
                    <Badge variant="secondary" className="mr-2">
                      Last Active: {child.lastActive}
                    </Badge>
                    <Button>View Details</Button>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-4 mb-6">
                  {[
                    {
                      title: "Overall Progress",
                      value: `${child.overallProgress}%`,
                      icon: TrendingUp,
                      color: "text-green-500",
                    },
                    {
                      title: "Active Courses",
                      value: child.activeCourses,
                      icon: BookOpen,
                      color: "text-blue-500",
                    },
                    {
                      title: "Study Hours",
                      value: child.studyHours,
                      icon: Clock,
                      color: "text-purple-500",
                    },
                    {
                      title: "Upcoming Events",
                      value: child.upcomingEvents.length,
                      icon: Calendar,
                      color: "text-orange-500",
                    },
                  ].map((stat) => (
                    <Card key={stat.title}>
                      <CardContent className="flex items-center p-4">
                        <stat.icon className={`w-8 h-8 ${stat.color} mr-4`} />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {stat.title}
                          </p>
                          <h3 className="text-2xl font-bold">{stat.value}</h3>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Upcoming Events */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        Upcoming Events
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {child.upcomingEvents.map((event, i) => (
                          <div
                            key={i}
                            className="flex items-center p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                          >
                            <Bell className="w-5 h-5 mr-3 text-primary" />
                            <div>
                              <h4 className="font-semibold">{event.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {event.date}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Progress Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2" />
                        Progress Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {child.subjects.map((subject) => (
                          <div key={subject.name}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">
                                {subject.name}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {subject.progress}%
                              </span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                              <div
                                className="bg-primary rounded-full h-2"
                                style={{
                                  width: `${subject.progress}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Recent Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <h4 className="font-semibold mb-1">{notification.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {notification.message}
                </p>
                <p className="text-sm text-muted-foreground">
                  {notification.time}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
