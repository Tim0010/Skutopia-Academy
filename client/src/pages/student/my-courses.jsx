import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function StudentCoursesPage() {
  const navigate = useNavigate();

  // This will be fetched from the backend
  const enrolledCourses = [
    {
      id: 1,
      title: "Introduction to Web Development",
      instructor: "John Doe",
      progress: 45,
      lastAccessed: "2024-01-01",
      image: "https://placehold.co/600x400",
    },
    {
      id: 2,
      title: "Advanced React Development",
      instructor: "Jane Smith",
      progress: 20,
      lastAccessed: "2024-01-02",
      image: "https://placehold.co/600x400",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <Button onClick={() => navigate("/courses")}>Browse More Courses</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {enrolledCourses.map((course) => (
          <div key={course.id} className="bg-card rounded-lg shadow-sm overflow-hidden">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-muted-foreground mb-4">
                Instructor: {course.instructor}
              </p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              <div className="text-sm text-muted-foreground mb-4">
                Last accessed: {new Date(course.lastAccessed).toLocaleDateString()}
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={() => navigate(`/course-progress/${course.id}`)}
                >
                  Continue Learning
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate(`/course/details/${course.id}`)}
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {enrolledCourses.length === 0 && (
        <div className="text-center py-12 bg-card rounded-lg">
          <p className="text-muted-foreground mb-4">
            You haven't enrolled in any courses yet
          </p>
          <Button onClick={() => navigate("/courses")}>Browse Courses</Button>
        </div>
      )}
    </div>
  );
}
