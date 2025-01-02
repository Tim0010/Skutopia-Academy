import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Users, BookOpen, TrendingUp, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchInstructorCourseListService } from "@/services";

function InstructorDashboard({ listOfCourses }) {
  const [courses, setCourses] = useState(listOfCourses);

  // Fetch fresh data every 30 seconds
  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        const response = await fetchInstructorCourseListService();
        if (response?.success) {
          console.log('Latest course data:', response.data);
          setCourses(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch latest course data:", error);
      }
    };

    // Initial set
    console.log('Initial courses:', listOfCourses);
    setCourses(listOfCourses);

    // Set up periodic refresh
    const intervalId = setInterval(fetchLatestData, 30000);

    // Cleanup
    return () => clearInterval(intervalId);
  }, [listOfCourses]);

  function calculateStats() {
    console.log('Calculating stats for courses:', courses);
    const stats = courses.reduce(
      (acc, course) => {
        const studentCount = course.students.length;
        acc.totalStudents += studentCount;
        acc.totalProfit += course.pricing * studentCount;
        acc.totalCourses += 1;

        // Calculate average rating
        const ratings = course.students
          .map(student => student.rating)
          .filter(rating => rating !== undefined);
        if (ratings.length > 0) {
          acc.totalRatings += ratings.length;
          acc.ratingSum += ratings.reduce((sum, rating) => sum + rating, 0);
        }

        course.students.forEach((student) => {
          acc.studentList.push({
            courseTitle: course.title,
            studentName: student.studentName,
            studentEmail: student.studentEmail,
            enrolledDate: new Date(student.enrolledAt).toLocaleDateString(),
          });
        });

        return acc;
      },
      {
        totalStudents: 0,
        totalProfit: 0,
        totalCourses: 0,
        totalRatings: 0,
        ratingSum: 0,
        studentList: [],
      }
    );

    return {
      ...stats,
      averageRating: stats.totalRatings > 0 
        ? (stats.ratingSum / stats.totalRatings).toFixed(1) 
        : "N/A",
    };
  }

  const stats = calculateStats();

  // Sort students by enrollment date (most recent first)
  const recentStudents = [...stats.studentList]
    .sort((a, b) => new Date(b.enrolledDate) - new Date(a.enrolledDate))
    .slice(0, 5);

  const dashboardCards = [
    {
      icon: Users,
      label: "Total Students",
      value: stats.totalStudents,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: `ZMK${stats.totalProfit.toLocaleString()}`,
      color: "text-green-500",
      bgColor: "bg-green-100",
    },
    {
      icon: BookOpen,
      label: "Total Courses",
      value: stats.totalCourses,
      color: "text-purple-500",
      bgColor: "bg-purple-100",
    },
    {
      icon: TrendingUp,
      label: "Average Rating",
      value: stats.averageRating,
      color: "text-yellow-500",
      bgColor: "bg-yellow-100",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card, index) => (
          <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="flex items-center p-6">
              <div className={`${card.bgColor} p-4 rounded-full mr-4`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{card.label}</p>
                <h3 className="text-2xl font-bold">{card.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Students Table */}
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Recent Students</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Enrolled Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentStudents.map((student, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{student.studentName}</TableCell>
                  <TableCell>{student.courseTitle}</TableCell>
                  <TableCell>{student.studentEmail}</TableCell>
                  <TableCell>{student.enrolledDate}</TableCell>
                </TableRow>
              ))}
              {recentStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    No students enrolled yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Course Performance */}
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Course Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Name</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>{course.students.length}</TableCell>
                  <TableCell>K{(course.pricing * course.students.length).toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      course.students.length > 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {course.students.length > 0 ? 'Active' : 'No Students'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {courses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    No courses created yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default InstructorDashboard;
