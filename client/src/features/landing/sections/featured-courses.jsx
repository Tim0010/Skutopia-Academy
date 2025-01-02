import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";

const featuredCourses = [
  {
    id: 1,
    title: "Grade 7 Mathematics",
    description: "Learn grade 7 Mathematics concepts from scratch",
    instructor: "Kelvin Chibinda",
    rating: 4.9,
    students: 1500,
    price: 29.99,
    image: "/src/assets/img/math-7.jpg",
    category: "Grade 7",
  },
  {
    id: 2,
    title: "Grade 9 Mathematics",
    description: "Master the basics of grade 9 mathematics",
    instructor: "Mr. Banda",
    rating: 4.8,
    students: 1200,
    price: 30.99,
    image: "/src/assets/img/math-9.jpg",
    category: "Grade 9",
  },
  {
    id: 3,
    title: "Grade 12 Mathematics",
    description: "Complete guide to passing your grade 12 Mathematics",
    instructor: "Mrs. Zulu",
    rating: 4.7,
    students: 800,
    price: 55.99,
    image: "/src/assets/img/math-12.jpg",
    category: "Grade 12",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function FeaturedCourses() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">
            Featured Courses
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Learn from Our Best Courses
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Discover our most popular courses designed to help you achieve your Primary and Secondary School goals.
            Learn from expert tutors and join our community of learners.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {featuredCourses.map((course) => (
            <motion.div key={course.id} variants={item}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="p-6">
                  <Badge className="mb-2">{course.category}</Badge>
                  <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                  <p className="text-muted-foreground mb-4">{course.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="font-medium">{course.rating}</span>
                    </div>
                    <div>{course.students.toLocaleString()} students</div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0 flex items-center justify-between">
                  <div className="font-bold text-lg">
                    ${course.price}
                  </div>
                  <Button>Enroll Now</Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Courses
          </Button>
        </div>
      </div>
    </section>
  );
}
