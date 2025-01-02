import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import VideoPlayer from "./video-player";
import DiscussionList from "./discussions/discussion-list";

export default function CourseProgress({
  course,
  currentSection,
  currentLesson,
  onNavigate,
}) {
  const [activeTab, setActiveTab] = useState("content");

  function handleNext() {
    const currentSectionIndex = course.sections.findIndex(
      (section) => section._id === currentSection._id
    );
    const currentLessonIndex = currentSection.lessons.findIndex(
      (lesson) => lesson._id === currentLesson._id
    );

    if (currentLessonIndex < currentSection.lessons.length - 1) {
      // Next lesson in current section
      onNavigate(
        currentSection,
        currentSection.lessons[currentLessonIndex + 1]
      );
    } else if (currentSectionIndex < course.sections.length - 1) {
      // First lesson of next section
      const nextSection = course.sections[currentSectionIndex + 1];
      onNavigate(nextSection, nextSection.lessons[0]);
    }
  }

  function handlePrevious() {
    const currentSectionIndex = course.sections.findIndex(
      (section) => section._id === currentSection._id
    );
    const currentLessonIndex = currentSection.lessons.findIndex(
      (lesson) => lesson._id === currentLesson._id
    );

    if (currentLessonIndex > 0) {
      // Previous lesson in current section
      onNavigate(
        currentSection,
        currentSection.lessons[currentLessonIndex - 1]
      );
    } else if (currentSectionIndex > 0) {
      // Last lesson of previous section
      const prevSection = course.sections[currentSectionIndex - 1];
      onNavigate(
        prevSection,
        prevSection.lessons[prevSection.lessons.length - 1]
      );
    }
  }

  const isFirstLesson =
    currentSection._id === course.sections[0]._id &&
    currentLesson._id === currentSection.lessons[0]._id;

  const isLastLesson =
    currentSection._id === course.sections[course.sections.length - 1]._id &&
    currentLesson._id ===
      currentSection.lessons[currentSection.lessons.length - 1]._id;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <VideoPlayer videoUrl={currentLesson.videoUrl} />
      </div>

      <div className="p-4 border-t">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={isFirstLesson}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={isLastLesson}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-4">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: currentLesson.content }}
            />
          </TabsContent>

          <TabsContent value="discussions" className="mt-4">
            <DiscussionList
              courseId={course._id}
              lectureId={currentLesson._id}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
