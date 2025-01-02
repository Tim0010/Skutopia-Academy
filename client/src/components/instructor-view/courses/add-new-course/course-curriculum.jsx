import { useContext, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InstructorContext } from "@/context/instructor-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Video, File, Link as LinkIcon } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function SortableSection({ section, index, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="border rounded-lg">
        <AccordionItem value={section.id} className="border-0">
          <div className="flex items-center px-4">
            <div {...listeners} className="mr-2 cursor-grab">
              <GripVertical className="w-4 h-4 text-gray-400" />
            </div>
            {children}
          </div>
        </AccordionItem>
      </div>
    </div>
  );
}

function CourseCurriculum() {
  const { courseCurriculumFormData, setCourseCurriculumFormData } = useContext(InstructorContext);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [errors, setErrors] = useState({});
  const [currentSection, setCurrentSection] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [isAddingLesson, setIsAddingLesson] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addSection = () => {
    if (!newSectionTitle.trim()) {
      setErrors(prev => ({ ...prev, newSection: "Section title is required" }));
      return;
    }

    const newSection = {
      id: Date.now().toString(),
      title: newSectionTitle,
      lessons: []
    };

    setCourseCurriculumFormData(prev => ({
      ...prev,
      sections: [...(prev.sections || []), newSection]
    }));

    setNewSectionTitle("");
    setErrors(prev => ({ ...prev, newSection: undefined }));
  };

  const addLesson = (sectionId) => {
    setCurrentSection(sectionId);
    setCurrentLesson(null);
    setIsAddingLesson(true);
  };

  const handleLessonSubmit = (lessonData) => {
    setCourseCurriculumFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.id === currentSection) {
          return {
            ...section,
            lessons: [...section.lessons, {
              id: Date.now().toString(),
              ...lessonData
            }]
          };
        }
        return section;
      })
    }));
    setIsAddingLesson(false);
  };

  const deleteSection = (sectionId) => {
    setCourseCurriculumFormData(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
  };

  const deleteLesson = (sectionId, lessonId) => {
    setCourseCurriculumFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            lessons: section.lessons.filter(lesson => lesson.id !== lessonId)
          };
        }
        return section;
      })
    }));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setCourseCurriculumFormData((prev) => {
        const oldIndex = prev.sections.findIndex((section) => section.id === active.id);
        const newIndex = prev.sections.findIndex((section) => section.id === over.id);

        return {
          ...prev,
          sections: arrayMove(prev.sections, oldIndex, newIndex),
        };
      });
    }
  };

  const LessonForm = ({ onSubmit, onCancel, initialData }) => {
    const [lessonData, setLessonData] = useState(initialData || {
      title: "",
      description: "",
      type: "video",
      content: "",
      duration: ""
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(lessonData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="lessonTitle">Lesson Title *</Label>
          <Input
            id="lessonTitle"
            value={lessonData.title}
            onChange={(e) => setLessonData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter lesson title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lessonType">Content Type *</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={lessonData.type === 'video' ? 'default' : 'outline'}
              onClick={() => setLessonData(prev => ({ ...prev, type: 'video' }))}
            >
              <Video className="w-4 h-4 mr-2" />
              Video
            </Button>
            <Button
              type="button"
              variant={lessonData.type === 'document' ? 'default' : 'outline'}
              onClick={() => setLessonData(prev => ({ ...prev, type: 'document' }))}
            >
              <File className="w-4 h-4 mr-2" />
              Document
            </Button>
            <Button
              type="button"
              variant={lessonData.type === 'link' ? 'default' : 'outline'}
              onClick={() => setLessonData(prev => ({ ...prev, type: 'link' }))}
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              Link
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lessonContent">Content URL/Link *</Label>
          <Input
            id="lessonContent"
            value={lessonData.content}
            onChange={(e) => setLessonData(prev => ({ ...prev, content: e.target.value }))}
            placeholder={`Enter ${lessonData.type} URL`}
            required
          />
        </div>

        {lessonData.type === 'video' && (
          <div className="space-y-2">
            <Label htmlFor="lessonDuration">Duration (minutes)</Label>
            <Input
              id="lessonDuration"
              type="number"
              min="1"
              value={lessonData.duration}
              onChange={(e) => setLessonData(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="Enter video duration"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="lessonDescription">Description</Label>
          <Textarea
            id="lessonDescription"
            value={lessonData.description}
            onChange={(e) => setLessonData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter lesson description"
            className="min-h-[100px]"
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Lesson</Button>
        </DialogFooter>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Course Curriculum</CardTitle>
          <CardDescription>
            Organize your course content into sections and lessons
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Add New Section */}
          <div className="flex gap-2 mb-6">
            <div className="flex-1">
              <Input
                value={newSectionTitle}
                onChange={(e) => {
                  setNewSectionTitle(e.target.value);
                  if (errors.newSection) {
                    setErrors(prev => ({ ...prev, newSection: undefined }));
                  }
                }}
                placeholder="Enter new section title"
                className={errors.newSection ? "border-red-500" : ""}
              />
              {errors.newSection && (
                <span className="text-sm text-red-500">{errors.newSection}</span>
              )}
            </div>
            <Button onClick={addSection}>
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </div>

          {/* Sections List */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={courseCurriculumFormData.sections?.map(s => s.id) || []}
              strategy={verticalListSortingStrategy}
            >
              <Accordion type="single" collapsible className="space-y-4">
                {courseCurriculumFormData.sections?.map((section, index) => (
                  <SortableSection key={section.id} section={section} index={index}>
                    <AccordionTrigger className="flex-1 hover:no-underline">
                      <div className="flex items-center justify-between w-full">
                        <span>Section {index + 1}: {section.title}</span>
                        <span className="text-sm text-gray-500">
                          {section.lessons.length} lessons
                        </span>
                      </div>
                    </AccordionTrigger>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => deleteSection(section.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <AccordionContent className="px-4 pb-4">
                      {/* Lessons List */}
                      <div className="space-y-2 mt-2">
                        {section.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lesson.id}
                            className="flex items-center gap-2 p-2 rounded-md bg-gray-50"
                          >
                            <div className="w-6 text-center text-sm text-gray-500">
                              {lessonIndex + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{lesson.title}</div>
                              <div className="text-sm text-gray-500">
                                {lesson.type === 'video' && `${lesson.duration} minutes`}
                                {lesson.type === 'document' && 'Document'}
                                {lesson.type === 'link' && 'External Link'}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => deleteLesson(section.id, lesson.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      {/* Add Lesson Button */}
                      <Dialog open={isAddingLesson && currentSection === section.id} onOpenChange={setIsAddingLesson}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full mt-4"
                            onClick={() => addLesson(section.id)}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Lesson
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Lesson</DialogTitle>
                            <DialogDescription>
                              Create a new lesson for section "{section.title}"
                            </DialogDescription>
                          </DialogHeader>
                          <LessonForm
                            onSubmit={handleLessonSubmit}
                            onCancel={() => setIsAddingLesson(false)}
                          />
                        </DialogContent>
                      </Dialog>
                    </AccordionContent>
                  </SortableSection>
                ))}
              </Accordion>
            </SortableContext>
          </DndContext>

          {courseCurriculumFormData.sections?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No sections added yet. Start by adding a section above.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CourseCurriculum;
