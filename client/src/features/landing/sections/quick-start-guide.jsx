import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search, BookOpen, Award, Rocket } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Find Your Course",
    description: "Browse through our extensive catalog of courses and choose the one that matches your goals.",
    color: "from-blue-600 to-cyan-500",
  },
  {
    icon: BookOpen,
    title: "Start Learning",
    description: "Access high-quality content, video lectures, and practical assignments at your own pace.",
    color: "from-purple-600 to-pink-500",
  },
  {
    icon: Award,
    title: "Get Certified",
    description: "Complete your course and earn a verified certificate to showcase your achievement.",
    color: "from-orange-600 to-yellow-500",
  },
  {
    icon: Rocket,
    title: "Advance Career",
    description: "Use your new skills to advance in your career or start a new professional journey.",
    color: "from-green-600 to-emerald-500",
  },
];

export function QuickStartGuide() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Getting Started
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Your Learning Journey Starts Here
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow these simple steps to begin your learning journey with Skutopia
            and transform your career.
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gray-200 -translate-y-1/2 hidden lg:block" />

          <div className="grid gap-8 lg:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-full blur-lg opacity-50`} />
                    <div className="relative w-16 h-16 mx-auto bg-white rounded-full border-2 border-gray-200 flex items-center justify-center mb-4">
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Button size="lg" className="px-8">
            Start Learning Now
          </Button>
        </div>
      </div>
    </section>
  );
}
