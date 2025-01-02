import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const benefits = [
  {
    title: "Expert Instructors",
    description:
      "Learn from experienced Zambian teachers who understand the local curriculum and examination requirements.",
    icon: "👨‍🏫",
  },
  {
    title: "Interactive Learning",
    description:
      "Engage with our platform through quizzes, practice tests, and interactive exercises designed to enhance understanding.",
    icon: "🎯",
  },
  {
    title: "Flexible Schedule",
    description:
      "Study at your own pace with 24/7 access to course materials and recorded lessons.",
    icon: "⏰",
  },
  {
    title: "Progress Tracking",
    description:
      "Monitor your improvement with detailed analytics and performance insights.",
    icon: "📊",
  },
  {
    title: "Community Support",
    description:
      "Connect with fellow students and instructors through our active learning community.",
    icon: "👥",
  },
  {
    title: "Exam Preparation",
    description:
      "Access comprehensive study materials and practice papers aligned with the Zambian curriculum.",
    icon: "📚",
  },
];

export function PlatformBenefits() {
  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Why Choose Skutopia Academy?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the advantages that make our platform the perfect choice for
              your educational journey.
            </p>
          </motion.div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{benefit.icon}</div>
                    <div>
                      <CardTitle className="text-xl">{benefit.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-16"
        >
          <Badge variant="secondary" className="text-lg px-6 py-2">
            Join 1000+ students already learning with us
          </Badge>
        </motion.div>
      </div>
    </section>
  );
}
