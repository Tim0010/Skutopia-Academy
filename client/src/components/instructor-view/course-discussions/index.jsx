import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DiscussionStats from "./discussion-stats";
import DiscussionManagement from "./discussion-management";

export default function CourseDiscussions({ courseId }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Course Discussions</h2>
        <p className="text-muted-foreground">
          Manage and monitor discussions for your course
        </p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <DiscussionStats courseId={courseId} />
        </TabsContent>
        <TabsContent value="management">
          <DiscussionManagement courseId={courseId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
