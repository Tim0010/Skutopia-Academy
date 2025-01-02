import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Grade 7 Mathematics",
    subject: "Mathematics",
    grade: "Grade 7",
    instructor: "Mr. Banda",
    rating: 4.8,
    students: 1200,
    price: 29.99,
    image: "/src/assets/img/math-7.jpg",
  },
  {
    id: 2,
    title: "Grade 9 Science",
    subject: "Science",
    grade: "Grade 9",
    instructor: "Mrs. Zulu",
    rating: 4.9,
    students: 800,
    price: 34.99,
    image: "/src/assets/img/science-9.jpg",
  },
  // Add more courses here
];

const subjects = ["All Subjects", "Mathematics", "Science", "English", "Social Studies"];
const grades = ["All Grades", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];

export default function CourseCatalogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedGrade, setSelectedGrade] = useState("All Grades");

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSubject =
      selectedSubject === "All Subjects" || course.subject === selectedSubject;
    const matchesGrade =
      selectedGrade === "All Grades" || course.grade === selectedGrade;
    return matchesSearch && matchesSubject && matchesGrade;
  });

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Course Catalog</h1>
          <p className="text-lg text-muted-foreground">
            Browse our comprehensive collection of courses
          </p>
        </div>

        {/* Filters */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger>
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedGrade} onValueChange={setSelectedGrade}>
            <SelectTrigger>
              <SelectValue placeholder="Select Grade" />
            </SelectTrigger>
            <SelectContent>
              {grades.map((grade) => (
                <SelectItem key={grade} value={grade}>
                  {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Course Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex gap-2 mb-3">
                    <Badge>{course.subject}</Badge>
                    <Badge variant="outline">{course.grade}</Badge>
                  </div>
                  <CardTitle className="mb-2">{course.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-4">
                    by {course.instructor}
                  </p>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span>{course.rating}</span>
                      <span className="text-muted-foreground">
                        ({course.students} students)
                      </span>
                    </div>
                    <div className="font-semibold">K{course.price}</div>
                  </div>
                  <Button className="w-full">View Course</Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No courses found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
