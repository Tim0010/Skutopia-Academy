import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, Video, FileText, Bookmark } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { studentService } from "@/services/student-service";
import { LoadingPage } from "@/components/ui/loading";
import { ErrorPage } from "@/components/ui/error";

export default function StudentLearningHubPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const {
    data: resources,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["learning-resources", activeTab, searchQuery],
    queryFn: () => studentService.getLearningResources({ type: activeTab, query: searchQuery }),
  });

  if (isLoading) {
    return <LoadingPage message="Loading learning resources..." />;
  }

  if (isError) {
    return (
      <ErrorPage
        title="Failed to Load Resources"
        message={error?.message || "Could not load learning resources"}
        onRetry={refetch}
      />
    );
  }

  const filteredResources = resources?.filter((resource) =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">Learning Hub</h1>
        <p className="text-muted-foreground mb-8">
          Access study materials, videos, and resources to enhance your learning
        </p>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Resource Types Tabs */}
        <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Resources</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="practice">Practice</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredResources?.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </TabsContent>

          {/* Add similar content for other tabs */}
        </Tabs>

        {/* Bookmarked Resources */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bookmark className="w-5 h-5 mr-2" />
              Bookmarked Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {resources
                ?.filter((resource) => resource.bookmarked)
                .map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function ResourceCard({ resource }) {
  const icons = {
    video: Video,
    document: FileText,
    practice: BookOpen,
  };

  const Icon = icons[resource.type] || BookOpen;

  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start">
          <div className="bg-primary/10 p-3 rounded-lg mr-4">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">{resource.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {resource.description}
            </p>
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm">
                View Resource
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/80"
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
