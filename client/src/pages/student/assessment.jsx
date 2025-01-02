import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ClipboardList, 
  CheckCircle2, 
  XCircle, 
  Clock 
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { studentService } from "@/services/student-service";
import { LoadingPage } from "@/components/ui/loading";
import { ErrorPage } from "@/components/ui/error";

export default function StudentAssessmentPage() {
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // Fetch assessments
  const {
    data: assessments,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['student-assessments'],
    queryFn: studentService.getAssessments
  });

  // Submit assessment mutation
  const submitAssessmentMutation = useMutation({
    mutationFn: (data) => studentService.submitAssessment(
      selectedAssessment.id, 
      data
    ),
    onSuccess: (result) => {
      // Handle assessment result
      console.log('Assessment Result:', result);
    }
  });

  // Handle loading and error states
  if (isLoading) return <LoadingPage message="Loading assessments..." />;
  if (isError) return (
    <ErrorPage
      title="Assessment Error"
      message={error?.message || "Failed to load assessments"}
      onRetry={refetch}
    />
  );

  // Start assessment
  const startAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setCurrentQuestion(0);
    setSelectedAnswers({});
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId, answerId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  // Submit assessment
  const submitAssessment = () => {
    submitAssessmentMutation.mutate(selectedAnswers);
  };

  // Render assessment list or active assessment
  if (!selectedAssessment) {
    return (
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">Assessments</h1>
          <p className="text-muted-foreground mb-8">
            Take assessments to test your knowledge and track your progress
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {assessments.map((assessment) => (
              <AssessmentCard 
                key={assessment.id} 
                assessment={assessment} 
                onStart={() => startAssessment(assessment)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // Render active assessment
  const currentQuestionData = selectedAssessment.questions[currentQuestion];

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>{selectedAssessment.title}</CardTitle>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
              <span>Time Remaining: 30:00</span>
            </div>
            <Progress 
              value={(currentQuestion / selectedAssessment.questions.length) * 100} 
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {currentQuestionData.text}
            </h2>
            <div className="space-y-4">
              {currentQuestionData.options.map((option) => (
                <Button
                  key={option.id}
                  variant={
                    selectedAnswers[currentQuestionData.id] === option.id 
                      ? "default" 
                      : "outline"
                  }
                  className="w-full justify-start"
                  onClick={() => handleAnswerSelect(
                    currentQuestionData.id, 
                    option.id
                  )}
                >
                  {option.text}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            {currentQuestion > 0 && (
              <Button 
                variant="outline"
                onClick={() => setCurrentQuestion(prev => prev - 1)}
              >
                Previous
              </Button>
            )}
            {currentQuestion < selectedAssessment.questions.length - 1 ? (
              <Button 
                onClick={() => setCurrentQuestion(prev => prev + 1)}
                disabled={!selectedAnswers[currentQuestionData.id]}
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={submitAssessment}
                disabled={
                  Object.keys(selectedAnswers).length !== 
                  selectedAssessment.questions.length
                }
              >
                Submit Assessment
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AssessmentCard({ assessment, onStart }) {
  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="bg-primary/10 p-3 rounded-lg mr-4">
            <ClipboardList className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold">{assessment.title}</h3>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
            <span className="text-sm">Passing Score: {assessment.passingScore}%</span>
          </div>
          <div className="flex items-center">
            <XCircle className="mr-2 h-4 w-4 text-red-500" />
            <span className="text-sm">{assessment.questions.length} Questions</span>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onStart}
        >
          Start Assessment
        </Button>
      </CardContent>
    </Card>
  );
}
