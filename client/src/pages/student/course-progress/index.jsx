import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Confetti from "react-confetti";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  getCurrentCourseProgressService,
  markLectureAsViewedService,
  resetCourseProgressService,
} from "@/services";
import { Check, ChevronLeft, ChevronRight, Play } from "lucide-react";

function StudentViewCourseProgressPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
    useContext(StudentContext);

  // State Variables
  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  // Fetch current course progress
  const fetchCurrentCourseProgress = async () => {
    const response = await getCurrentCourseProgressService(auth?.user?._id, id);
    if (response?.success) {
      const courseData = response?.data;
      if (!courseData?.isPurchased) {
        setLockCourse(true);
        return;
      }

      setStudentCurrentCourseProgress({
        courseDetails: courseData?.courseDetails,
        progress: courseData?.progress,
      });

      if (courseData?.completed) {
        setCurrentLecture(courseData?.courseDetails?.curriculum[0]);
        setShowCourseCompleteDialog(true);
        setShowConfetti(true);
      } else {
        const nextLectureIndex = findNextLectureIndex(
          courseData?.progress,
          courseData?.courseDetails?.curriculum
        );
        setCurrentLecture(courseData?.courseDetails?.curriculum[nextLectureIndex]);
      }
    }
  };

  // Find the next lecture index
  const findNextLectureIndex = (progress, curriculum) => {
    const lastViewedIndex = progress.reduceRight(
      (acc, obj, index) => (acc === -1 && obj.viewed ? index : acc),
      -1
    );
    return lastViewedIndex + 1 < curriculum.length
      ? lastViewedIndex + 1
      : 0; // Defaults to the first lecture if all are completed
  };

  // Mark the current lecture as viewed
  const updateCourseProgress = async () => {
    if (currentLecture) {
      const response = await markLectureAsViewedService(
        auth?.user?._id,
        studentCurrentCourseProgress?.courseDetails?._id,
        currentLecture._id
      );
      if (response?.success) fetchCurrentCourseProgress();
    }
  };

  // Reset course progress
  const handleRewatchCourse = async () => {
    const response = await resetCourseProgressService(
      auth?.user?._id,
      studentCurrentCourseProgress?.courseDetails?._id
    );
    if (response?.success) {
      setShowConfetti(false);
      setShowCourseCompleteDialog(false);
      fetchCurrentCourseProgress();
    }
  };

  // Side effects
  useEffect(() => {
    fetchCurrentCourseProgress();
  }, [id]);

  useEffect(() => {
    if (currentLecture?.progressValue === 1) updateCourseProgress();
  }, [currentLecture]);

  useEffect(() => {
    if (showConfetti) setTimeout(() => setShowConfetti(false), 15000);
  }, [showConfetti]);

  return (
    <div className="flex flex-col h-screen bg-[#1c1d1f] text-white">
      {showConfetti && <Confetti />}
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#1c1d1f] border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate("/student-courses")}
            className="text-black"
            variant="ghost"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to My Courses Page
          </Button>
          <h1 className="text-lg font-bold hidden md:block">
            {studentCurrentCourseProgress?.courseDetails?.title}
          </h1>
        </div>
        <Button onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
          {isSideBarOpen ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video Player */}
        <div className={`flex-1 ${isSideBarOpen ? "mr-[400px]" : ""}`}>
          <VideoPlayer
            width="100%"
            height="500px"
            url={currentLecture?.videoUrl}
            progressData={currentLecture}
            onProgressUpdate={updateCourseProgress}
          />
          <div className="p-6 bg-[#1c1d1f]">
            <h2 className="text-2xl font-bold">{currentLecture?.title}</h2>
          </div>
        </div>

        {/* Sidebar */}
        <div
          className={`fixed top-[64px] right-0 bottom-0 w-[400px] bg-[#1c1d1f] border-l border-gray-700 ${
            isSideBarOpen ? "translate-x-0" : "translate-x-full"
          } transition-all duration-300`}
        >
          <Tabs defaultValue="content">
            <TabsList className="grid w-full grid-cols-2 bg-[#1c1d1f] h-14">
              <TabsTrigger value="content">Course Content</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </TabsList>
            <TabsContent value="content">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {studentCurrentCourseProgress?.courseDetails?.curriculum.map(
                    (lecture) => (
                      <div
                        key={lecture._id}
                        className="flex items-center space-x-2 text-sm cursor-pointer"
                        onClick={() => setCurrentLecture(lecture)}
                      >
                        {studentCurrentCourseProgress?.progress?.find(
                          (item) => item.lectureId === lecture._id
                        )?.viewed ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                        <span>{lecture.title}</span>
                      </div>
                    )
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="overview">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <h2 className="text-xl font-bold">About this course</h2>
                  <p className="text-gray-400">
                    {studentCurrentCourseProgress?.courseDetails?.description}
                  </p>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={lockCourse}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Access Denied</DialogTitle>
            <DialogDescription>
              Please purchase this course to gain access.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showCourseCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Congratulations!</DialogTitle>
            <DialogDescription>
              <Label>You’ve completed the course!</Label>
              <div className="flex gap-3 mt-4">
                <Button onClick={() => navigate("/student-courses")}>
                  Back to Courses
                </Button>
                <Button onClick={handleRewatchCourse}>Rewatch Course</Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseProgressPage;
