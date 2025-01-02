import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const news = [
  {
    id: 1,
    title: "New AI & Machine Learning Track Launch",
    description: "Introducing our comprehensive AI and Machine Learning curriculum designed for the future.",
    date: "Dec 31, 2023",
    category: "New Course",
    image: "/news/ai-course.jpg",
  },
  {
    id: 2,
    title: "Partnership with Tech Giants",
    description: "Exciting partnerships with leading tech companies to provide better job opportunities.",
    date: "Dec 28, 2023",
    category: "Partnership",
    image: "/news/partnership.jpg",
  },
  {
    id: 3,
    title: "Student Success Milestone",
    description: "Celebrating over 1 million student enrollments and successful career transitions.",
    date: "Dec 25, 2023",
    category: "Milestone",
    image: "/news/success.jpg",
  },
];

export function NewsUpdates() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Latest Updates
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            News & Announcements
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest news, course launches, and success stories
            from our growing community.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge>{item.category}</Badge>
                    <span className="text-sm text-muted-foreground">{item.date}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground mb-4">{item.description}</p>
                  <Button variant="link" className="p-0">
                    Read More →
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button variant="outline" size="lg">
            View All Updates
          </Button>
        </div>
      </div>
    </section>
  );
}
