import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  GraduationCap,
  Users,
  BookOpen,
  Award,
  TrendingUp,
} from "lucide-react";

const careerPaths = [
  {
    title: "Science & Technology",
    description: "Explore careers in engineering, IT, and healthcare",
    icon: GraduationCap,
    opportunities: ["Software Developer", "Doctor", "Engineer"],
  },
  {
    title: "Business & Finance",
    description: "Discover opportunities in business and financial sectors",
    icon: Briefcase,
    opportunities: ["Accountant", "Entrepreneur", "Financial Analyst"],
  },
  {
    title: "Arts & Humanities",
    description: "Pursue creative and cultural career paths",
    icon: Users,
    opportunities: ["Teacher", "Writer", "Designer"],
  },
];

const resources = [
  {
    title: "Career Assessment",
    description: "Take our career assessment test to discover your strengths",
    icon: BookOpen,
  },
  {
    title: "Industry Insights",
    description: "Learn about different industries and job markets",
    icon: TrendingUp,
  },
  {
    title: "Certifications",
    description: "Explore professional certifications and qualifications",
    icon: Award,
  },
];

export default function CareerGuidancePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4">Career Guidance</Badge>
              <h1 className="text-4xl font-bold mb-6">
                Shape Your Future Career
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Get expert guidance and resources to help you make informed
                decisions about your future career path.
              </p>
              <Button size="lg">Take Career Assessment</Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Career Paths */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Explore Career Paths</h2>
            <p className="text-lg text-muted-foreground">
              Discover various career opportunities aligned with your interests
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {careerPaths.map((path, index) => (
              <motion.div
                key={path.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <path.icon className="w-12 h-12 text-primary mb-4" />
                    <CardTitle>{path.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {path.description}
                    </p>
                    <ul className="space-y-2">
                      {path.opportunities.map((opportunity) => (
                        <li
                          key={opportunity}
                          className="flex items-center text-sm"
                        >
                          <span className="w-2 h-2 bg-primary rounded-full mr-2" />
                          {opportunity}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Career Resources</h2>
            <p className="text-lg text-muted-foreground">
              Tools and resources to help you succeed
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <resource.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      {resource.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {resource.description}
                    </p>
                    <Button variant="outline">Learn More</Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentorship */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Get Professional Guidance</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Connect with industry professionals and career counselors who can
              guide you on your career journey
            </p>
            <Button size="lg">Schedule Consultation</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
