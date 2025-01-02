import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const successStories = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Frontend Developer at Google",
    story: "Skutopia's web development course helped me transition from a non-tech background to landing my dream job at Google.",
    image: "/testimonials/sarah.jpg",
    course: "Web Development Bootcamp",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Data Scientist at Amazon",
    story: "The data science program provided me with practical skills that I use daily in my role at Amazon. Highly recommended!",
    image: "/testimonials/michael.jpg",
    course: "Data Science Fundamentals",
  },
  {
    id: 3,
    name: "Emma Davis",
    role: "Digital Marketing Manager",
    story: "Thanks to Skutopia's marketing course, I was able to grow my company's online presence by 300% in just 6 months.",
    image: "/testimonials/emma.jpg",
    course: "Digital Marketing Mastery",
  },
];

export function SuccessStories() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Success Stories
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            From Learning to Earning
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how our students transformed their careers and achieved their dreams
            through our comprehensive learning programs.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {successStories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{story.name}</h3>
                      <p className="text-sm text-muted-foreground">{story.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">"{story.story}"</p>
                  <Badge variant="outline">{story.course}</Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center rounded-full border px-6 py-3 text-sm font-medium">
            Join 1M+ successful students worldwide 🎓
          </div>
        </div>
      </div>
    </section>
  );
}
