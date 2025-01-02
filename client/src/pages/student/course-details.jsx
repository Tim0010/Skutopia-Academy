import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function StudentViewCourseDetailsPage() {
  const { id } = useParams();

  // This will be fetched from the backend
  const course = {
    id: 1,
    title: "Introduction to Web Development",
    instructor: "John Doe",
    price: 49.99,
    rating: 4.5,
    students: 1234,
    description: "Learn the basics of web development with HTML, CSS, and JavaScript",
    image: "https://placehold.co/600x400",
    syllabus: [
      {
        title: "Getting Started",
        lessons: [
          "Introduction to Web Development",
          "Setting Up Your Development Environment",
          "Understanding HTML Basics",
        ],
      },
      {
        title: "CSS Fundamentals",
        lessons: [
          "CSS Syntax and Selectors",
          "Box Model and Layout",
          "Flexbox and Grid",
        ],
      },
      {
        title: "JavaScript Basics",
        lessons: [
          "Variables and Data Types",
          "Control Flow",
          "Functions and Objects",
        ],
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Course Header */}
        <div className="mb-8">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-muted-foreground mb-4">{course.description}</p>
              <p className="text-lg font-medium">
                Instructor: <span className="text-primary">{course.instructor}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold mb-2">${course.price}</p>
              <Button size="lg">Enroll Now</Button>
            </div>
          </div>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card p-4 rounded-lg text-center">
            <p className="text-muted-foreground">Rating</p>
            <p className="text-2xl font-bold">{course.rating}/5.0</p>
          </div>
          <div className="bg-card p-4 rounded-lg text-center">
            <p className="text-muted-foreground">Students</p>
            <p className="text-2xl font-bold">{course.students}</p>
          </div>
          <div className="bg-card p-4 rounded-lg text-center">
            <p className="text-muted-foreground">Lessons</p>
            <p className="text-2xl font-bold">
              {course.syllabus.reduce((acc, section) => acc + section.lessons.length, 0)}
            </p>
          </div>
        </div>

        {/* Course Syllabus */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Course Syllabus</h2>
          <div className="space-y-4">
            {course.syllabus.map((section, index) => (
              <div key={index} className="bg-card rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">{section.title}</h3>
                <ul className="space-y-2">
                  {section.lessons.map((lesson, lessonIndex) => (
                    <li
                      key={lessonIndex}
                      className="flex items-center text-muted-foreground"
                    >
                      <span className="w-6 h-6 flex items-center justify-center bg-primary/10 text-primary rounded mr-2">
                        {lessonIndex + 1}
                      </span>
                      {lesson}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
