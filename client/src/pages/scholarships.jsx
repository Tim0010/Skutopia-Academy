import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

export default function ScholarshipsPage() {
  const { isSignedIn } = useUser();

  const scholarships = [
    {
      title: "Merit Scholarship",
      amount: "$5,000",
      deadline: "March 31, 2024",
      description: "For students with outstanding academic achievements",
      eligibility: "GPA 3.5 or higher",
    },
    {
      title: "Need-Based Grant",
      amount: "$3,000",
      deadline: "April 15, 2024",
      description: "Supporting students with financial needs",
      eligibility: "Demonstrated financial need",
    },
    {
      title: "STEM Excellence Award",
      amount: "$4,000",
      deadline: "May 1, 2024",
      description: "For students pursuing STEM courses",
      eligibility: "Enrolled in STEM program",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Available Scholarships</h1>
        
        <div className="space-y-6">
          {scholarships.map((scholarship, index) => (
            <div
              key={index}
              className="bg-card rounded-lg shadow-sm p-6 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{scholarship.title}</h2>
                  <p className="text-muted-foreground">Amount: {scholarship.amount}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    Deadline: {scholarship.deadline}
                  </p>
                </div>
              </div>
              
              <p>{scholarship.description}</p>
              
              <div className="flex justify-between items-center">
                <p className="text-sm">
                  <span className="font-medium">Eligibility:</span>{" "}
                  {scholarship.eligibility}
                </p>
                <Button disabled={!isSignedIn}>
                  {isSignedIn ? "Apply Now" : "Sign in to Apply"}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {!isSignedIn && (
          <div className="mt-8 p-4 bg-muted rounded-lg text-center">
            <p className="text-muted-foreground mb-4">
              Sign in to apply for scholarships and track your applications
            </p>
            <Button variant="outline">Sign In</Button>
          </div>
        )}
      </div>
    </div>
  );
}
