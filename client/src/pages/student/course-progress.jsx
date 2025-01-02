import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, PlayCircle } from "lucide-react";
import { studentService } from "@/services/student-service";
import { LoadingPage } from "@/components/ui/loading";
import { ErrorPage } from "@/components/ui/error";
import { useToast } from "@/components/ui/use-toast";

export default function StudentViewCourseProgressPage() {
  const { courseId } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch course progress
  const {
    data: course,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['course-progress', courseId],
    queryFn: () => studentService.getCourseProgress(courseId),
  });

  // Lesson completion mutation
  const completeLessonMutation = useMutation({
    mutationFn: ({ courseId, moduleId, lessonId }) => 
      studentService.completeLesson(courseId, moduleId, lessonId),
    onSuccess: (data, variables) => {
      // Optimistically update the UI
      queryClient.setQueryData(['course-progress', courseId], (oldData) => {
        const updatedModules = oldData.modules.map(module => {
          if (module.id === variables.moduleId) {
            const updatedLessons = module.lessons.map(lesson => 
              lesson.id === variables.lessonId 
                ? { ...lesson, completed: true } 
                : lesson
            );
            return {
              ...module,
              lessons: updatedLessons,
              completed: updatedLessons.every(lesson => lesson.completed)
            };
          }
          return module;
        });

        return {
          ...oldData,
          modules: updatedModules,
          progress: calculateOverallProgress(updatedModules)
        };
      });

      toast({
        title: "Lesson Completed",
        description: "Great job! You've completed a lesson.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to complete lesson. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Calculate overall progress
  const calculateOverallProgress = (modules) => {
    const totalLessons = modules.reduce(
      (acc, module) => acc + module.lessons.length, 
      0
    );
    const completedLessons = modules.reduce(
      (acc, module) => acc + module.lessons.filter(lesson => lesson.completed).length, 
      0
    );
    return Math.round((completedLessons / totalLessons) * 100);
  };

  // Handle lesson start/complete
  const handleLessonAction = (moduleId, lessonId) => {
    if (!course) return;

    const lesson = course.modules
      .find(m => m.id === moduleId)
      ?.lessons.find(l => l.id === lessonId);

    if (!lesson) return;

    if (!lesson.completed) {
      completeLessonMutation.mutate({ 
        courseId: course.id, 
        moduleId, 
        lessonId 
      });
    }
    // TODO: Implement lesson viewing/playing logic
  };

  // Handle loading and error states
  if (isLoading) return <LoadingPage message="Loading course progress..." />;
  if (isError) return (
    <ErrorPage
      title="Course Progress Error"
      message={error?.message || "Failed to load course progress"}
      onRetry={refetch}
    />
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Course Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted-foreground">
                Instructor: <span className="text-foreground">{course.instructor}</span>
              </p>
              <div className="flex items-center gap-2">
                <div className="w-full bg-muted rounded-full h-2 w-32">
                  <div
                    className="bg-primary rounded-full h-2"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{course.progress}%</span>
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div className="space-y-6">
            {course.modules.map((module) => (
              <div key={module.id} className="bg-card rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">{module.title}</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {module.lessons.filter((l) => l.completed).length} /{" "}
                      {module.lessons.length} completed
                    </span>
                    {module.completed ? (
                      <CheckCircle className="text-primary h-5 w-5" />
                    ) : (
                      <Circle className="text-muted-foreground h-5 w-5" />
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        {lesson.completed ? (
                          <CheckCircle className="text-primary h-5 w-5" />
                        ) : (
                          <Circle className="text-muted-foreground h-5 w-5" />
                        )}
                        <span>{lesson.title}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {lesson.duration}
                        </span>
                        <Button 
                          size="sm" 
                          onClick={() => handleLessonAction(module.id, lesson.id)}
                          disabled={completeLessonMutation.isLoading}
                        >
                          {lesson.completed ? (
                            "Review"
                          ) : (
                            <>
                              <PlayCircle className="mr-2 h-4 w-4" />
                              Start
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
