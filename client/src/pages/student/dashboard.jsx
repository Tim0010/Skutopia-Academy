import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Calendar,
  Bell,
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";

const courses = [
  {
    id: 1,
    title: "Mathematics Grade 8",
    progress: 75,
    nextLesson: "Algebraic Expressions",
    dueDate: "2025-01-05",
  },
  {
    id: 2,
    title: "Science Grade 8",
    progress: 60,
    nextLesson: "Forces and Motion",
    dueDate: "2025-01-04",
  },
  // Add more courses as needed
];

const achievements = [
  {
    title: "Quick Learner",
    description: "Completed 5 lessons in one day",
    icon: Clock,
  },
  {
    title: "Perfect Score",
    description: "Scored 100% in Mathematics Quiz",
    icon: Award,
  },
  // Add more achievements as needed
];

const upcomingEvents = [
  {
    title: "Mathematics Test",
    date: "2025-01-05",
    type: "Test",
  },
  {
    title: "Science Project Due",
    date: "2025-01-10",
    type: "Assignment",
  },
  // Add more events as needed
];

export default function StudentDashboard() {
  const { user } = useUser();
  const firstName = user?.firstName || "Student";

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
            Here's an overview of your learning progress
          </p>
        </motion.div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        {[
          {
            title: "Courses Enrolled",
            value: "4",
            icon: BookOpen,
            color: "text-blue-500",
          },
          {
            title: "Hours Studied",
            value: "28",
            icon: Clock,
            color: "text-green-500",
          },
          {
            title: "Achievements",
            value: "12",
            icon: Award,
            color: "text-purple-500",
          },
          {
            title: "Overall Progress",
            value: "68%",
            icon: TrendingUp,
            color: "text-orange-500",
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
        {/* Current Courses */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Current Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{course.title}</h4>
                    <Badge>{course.progress}%</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Next: {course.nextLesson}
                  </p>
                  <div className="w-full bg-secondary rounded-full h-2">
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
              {upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <Bell className="w-5 h-5 mr-3 text-primary" />
                  <div>
                    <h4 className="font-semibold">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {event.date} - {event.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <achievement.icon className="w-8 h-8 text-primary mb-2" />
                  <h4 className="font-semibold mb-1">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
