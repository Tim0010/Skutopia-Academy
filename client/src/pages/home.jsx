import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PlatformBenefits } from "@/features/landing/sections/platform-benefits";
import { FeaturedCourses } from "@/features/landing/sections/featured-courses";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero Section */}
      <section className="relative flex-grow flex items-center justify-center bg-gradient-to-b from-primary/10 to-background overflow-hidden">
        <div className="container px-4 py-24 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Empowering Zambian Students
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of students learning from Zambia's best teachers. Get access to quality education and personalized learning experiences.
            </p>
            {isSignedIn ? (
              <Button
                size="lg"
                onClick={() =>
                  navigate(
                    user.publicMetadata.role === "instructor"
                      ? "/instructor"
                      : "/home"
                  )
                }
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <div className="space-x-4">
                <Button size="lg" variant="default" onClick={() => navigate("/auth")}>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    const benefitsSection = document.getElementById("benefits");
                    benefitsSection?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Learn More
                </Button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="text-3xl font-bold">1000+</p>
              <p className="text-muted-foreground">Active Students</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <p className="text-3xl font-bold">50+</p>
              <p className="text-muted-foreground">Expert Teachers</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <p className="text-3xl font-bold">100+</p>
              <p className="text-muted-foreground">Courses</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <p className="text-3xl font-bold">95%</p>
              <p className="text-muted-foreground">Success Rate</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <FeaturedCourses />

      {/* Platform Benefits */}
      <section id="benefits">
        <PlatformBenefits />
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-primary">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">
                Ready to Start Your Learning Journey?
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Join thousands of students already learning on Skutopia Academy. Start your journey to academic excellence today!
              </p>
              {!isSignedIn && (
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate("/auth")}
                >
                  Start Learning Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
