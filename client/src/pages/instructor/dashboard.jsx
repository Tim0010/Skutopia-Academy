import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  BookOpen,
  Star,
  TrendingUp,
  Calendar,
  Bell,
  PlusCircle,
  BarChart,
} from "lucide-react";
import { instructorService } from "@/services/instructor-service";
import { useRealTimeUpdates } from "@/hooks/useRealTimeUpdates";
import { useToast } from "@/components/ui/use-toast";

export default function InstructorDashboardPage() {
  const { user } = useUser();
  const firstName = user?.firstName || "Instructor";
  const { toast } = useToast();

  // State
  const [dashboardData, setDashboardData] = useState({
    courses: [],
    stats: {
      totalStudents: 0,
      activeCourses: 0,
      averageRating: 0,
      completionRate: 0,
    },
    recentActivities: [],
    upcomingTasks: [],
  });
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await instructorService.getDashboardData();
        setDashboardData(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  // Setup real-time updates
  useRealTimeUpdates([
    {
      event: 'course.update',
      callback: (course) => {
        setDashboardData(prev => ({
          ...prev,
          courses: prev.courses.map(c => 
            c.id === course.id ? { ...c, ...course } : c
          ),
        }));
      },
    },
    {
      event: 'student.enroll',
      callback: (data) => {
        setDashboardData(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            totalStudents: prev.stats.totalStudents + 1,
          },
          recentActivities: [
            {
              type: 'enrollment',
              message: `${data.courseName} has a new student enrolled`,
              time: 'Just now',
            },
            ...prev.recentActivities.slice(0, -1),
          ],
        }));
      },
    },
    {
      event: 'assignment.submit',
      callback: (data) => {
        setDashboardData(prev => ({
          ...prev,
          recentActivities: [
            {
              type: 'submission',
              message: `New assignment submission in ${data.courseName}`,
              time: 'Just now',
            },
            ...prev.recentActivities.slice(0, -1),
          ],
        }));
      },
    },
  ]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

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
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your teaching activities
          </p>
        </motion.div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        {[
          {
            title: "Total Students",
            value: dashboardData.stats.totalStudents,
            icon: Users,
            color: "text-blue-500",
          },
          {
            title: "Active Courses",
            value: dashboardData.stats.activeCourses,
            icon: BookOpen,
            color: "text-green-500",
          },
          {
            title: "Average Rating",
            value: dashboardData.stats.averageRating,
            icon: Star,
            color: "text-yellow-500",
          },
          {
            title: "Completion Rate",
            value: `${dashboardData.stats.completionRate}%`,
            icon: TrendingUp,
            color: "text-purple-500",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="flex items-center p-6">
                <stat.icon className={`w-8 h-8 ${stat.color} mr-4`} />
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Your Courses */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Your Courses
            </CardTitle>
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              New Course
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.courses.map((course) => (
                <div
                  key={course.id}
                  className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{course.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {course.students} students enrolled
                      </p>
                    </div>
                    <Badge>
                      ★ {course.rating}
                    </Badge>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 mt-2">
                    <div
                      className="bg-primary rounded-full h-2"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start">
              <PlusCircle className="w-4 h-4 mr-2" />
              Create New Course
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Class
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{activity.message}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.upcomingTasks.map((task, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div>
                    <h4 className="font-semibold">{task.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      Due: {task.dueDate}
                    </p>
                  </div>
                  <Badge variant={task.priority === "High" ? "destructive" : "secondary"}>
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
