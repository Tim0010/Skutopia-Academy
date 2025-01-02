import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import heroImage from "@/assets/img/hero-image.png";

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]" />
      
      <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Transform Your Future with
              <span className="text-primary"> Skutopia Academy</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Unlock your potential with our cutting-edge online learning platform.
              Join thousands of Zambian students in their journey to success.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Button size="lg" className="px-8">
                Get Started
              </Button>
              <Button variant="outline" size="lg">
                Browse Courses
              </Button>
            </div>
            
            <div className="mt-12 flex items-center gap-8">
              <div>
                <h4 className="text-3xl font-bold">1K+</h4>
                <p className="text-muted-foreground">Active Students</p>
              </div>
              <div>
                <h4 className="text-3xl font-bold">10+</h4>
                <p className="text-muted-foreground">Expert Instructors</p>
              </div>
              <div>
                <h4 className="text-3xl font-bold">500+</h4>
                <p className="text-muted-foreground">Success Stories</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative lg:col-span-1"
          >
            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute -top-4 -right-4 h-72 w-72 rounded-full bg-purple-200 blur-3xl" />
              <div className="absolute -bottom-4 -left-4 h-72 w-72 rounded-full bg-blue-200 blur-3xl" />
              <div className="relative">
                <img
                  src={heroImage}
                  alt="Students learning"
                  className="relative rounded-2xl shadow-2xl"
                />
                
                {/* Floating Elements */}
                <div className="absolute -left-8 top-8 animate-float">
                  <div className="rounded-lg bg-white p-4 shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary" />
                      <div>
                        <p className="font-semibold">Online Courses</p>
                        <p className="text-sm text-muted-foreground">Interactive Learning</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -right-8 bottom-8 animate-float-delayed">
                  <div className="rounded-lg bg-white p-4 shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-green-500" />
                      <div>
                        <p className="font-semibold">Certified Courses</p>
                        <p className="text-sm text-muted-foreground">Industry Recognition</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
