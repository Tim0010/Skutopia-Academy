import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScholarshipCard } from "@/features/scholarships/components/scholarship-card";
import { ResourceSection } from "@/features/scholarships/components/resource-section";
import { scholarships, resources } from "@/features/scholarships/data/scholarships";

export default function ScholarshipsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          International Scholarships
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover fully-funded scholarship opportunities for African students to study abroad.
        </p>
      </motion.div>

      <Tabs defaultValue="scholarships" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] mx-auto">
          <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="scholarships" className="space-y-8">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Partner Universities", value: "100+" },
              { label: "Total Funding", value: "$50M+" },
              { label: "Success Stories", value: "1000+" },
              { label: "Countries", value: "50+" },
            ].map((stat, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardDescription>{stat.label}</CardDescription>
                  <CardTitle>{stat.value}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Scholarships Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {scholarships.map((scholarship, index) => (
              <motion.div
                key={scholarship.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ScholarshipCard scholarship={scholarship} />
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-8">
          {/* Resources Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ResourceSection resource={resource} />
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <Card className="mt-8">
            <CardHeader className="text-center">
              <CardTitle>Need Help with Your Application?</CardTitle>
              <CardDescription>
                Book a consultation with our scholarship experts or download our comprehensive application guide.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center gap-4">
              <Button>Book Consultation</Button>
              <Button variant="outline">Download Guide</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
