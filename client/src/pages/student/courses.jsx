import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function StudentViewCoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // This will be fetched from the backend
  const courses = [
    {
      id: 1,
      title: "Introduction to Web Development",
      instructor: "John Doe",
      price: 49.99,
      rating: 4.5,
      students: 1234,
      description: "Learn the basics of web development with HTML, CSS, and JavaScript",
      image: "https://placehold.co/600x400",
    },
    {
      id: 2,
      title: "Advanced React Development",
      instructor: "Jane Smith",
      price: 79.99,
      rating: 4.8,
      students: 987,
      description: "Master React.js and build modern web applications",
      image: "https://placehold.co/600x400",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">Filters</Button>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div key={course.id} className="bg-card rounded-lg shadow-sm overflow-hidden">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-muted-foreground mb-4">{course.description}</p>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Instructor</p>
                  <p className="font-medium">{course.instructor}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium">${course.price}</p>
                </div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="font-medium">{course.rating}/5.0</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Students</p>
                  <p className="font-medium">{course.students}</p>
                </div>
              </div>
              <Button className="w-full">View Course</Button>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No courses found</p>
          <Button variant="outline" onClick={() => setSearchQuery("")}>
            Clear Search
          </Button>
        </div>
      )}
    </div>
  );
}
