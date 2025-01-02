import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Users, Award, School } from "lucide-react";

const features = [
  {
    icon: GraduationCap,
    title: "Expert Teachers",
    description: "Learn from experienced Zambian teachers who understand the local curriculum.",
  },
  {
    icon: Users,
    title: "Community Learning",
    description: "Join a vibrant community of learners and educators.",
  },
  {
    icon: Award,
    title: "Recognized Certificates",
    description: "Earn certificates that are recognized by institutions.",
  },
  {
    icon: School,
    title: "Quality Content",
    description: "Access high-quality, curriculum-aligned educational content.",
  },
];

const partners = [
  {
    name: "Ministry of Education",
    logo: "/logos/moe.png",
    description: "Official recognition and curriculum alignment",
  },
  {
    name: "Local Schools",
    logo: "/logos/schools.png",
    description: "Partnerships with leading Zambian schools",
  },
  {
    name: "Tech Companies",
    logo: "/logos/tech.png",
    description: "Support from technology industry leaders",
  },
];

export default function AboutPage() {
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
              <Badge className="mb-4">About Us</Badge>
              <h1 className="text-4xl font-bold mb-6">
                Transforming Education in Zambia
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Skutopia Academy is dedicated to making quality education accessible
                to every Zambian student through innovative online learning.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-background p-8 rounded-lg"
            >
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground">
                To provide accessible, high-quality education to every Zambian
                student, empowering them to achieve their academic goals and build
                a better future.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-background p-8 rounded-lg"
            >
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-muted-foreground">
                To be the leading online education platform in Zambia, recognized
                for excellence in teaching and learning outcomes.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Skutopia</h2>
            <p className="text-lg text-muted-foreground">
              Our platform offers unique advantages for Zambian students
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <feature.icon className="w-12 h-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Partners</h2>
            <p className="text-lg text-muted-foreground">
              Working together to improve education in Zambia
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="w-24 h-24 mx-auto mb-4"
                    />
                    <h3 className="text-xl font-semibold mb-2">{partner.name}</h3>
                    <p className="text-muted-foreground">{partner.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Learning Community</h2>
          <p className="text-lg mb-8 opacity-90">
            Start your learning journey with Skutopia Academy today
          </p>
          <Button size="lg" variant="secondary">
            Get Started
          </Button>
        </div>
      </section>
    </div>
  );
}
