import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourseByIdService } from "@/services";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseContent from "@/components/instructor-view/course-content";
import CourseSettings from "@/components/instructor-view/course-settings";
import CourseDiscussions from "@/components/instructor-view/course-discussions";
import CourseStudents from "@/components/instructor-view/course-students";

export default function InstructorCoursePage() {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  async function fetchCourse() {
    try {
      const response = await getCourseByIdService(courseId);
      if (response?.success) {
        setCourse(response.data);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  }

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{course.title}</h2>
        <p className="text-muted-foreground">
          Manage your course content, settings, and student interactions
        </p>
      </div>

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <CourseContent course={course} onUpdate={fetchCourse} />
        </TabsContent>

        <TabsContent value="discussions">
          <CourseDiscussions courseId={courseId} />
        </TabsContent>

        <TabsContent value="students">
          <CourseStudents courseId={courseId} />
        </TabsContent>

        <TabsContent value="settings">
          <CourseSettings course={course} onUpdate={fetchCourse} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
