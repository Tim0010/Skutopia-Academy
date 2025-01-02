import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

export default function PaypalPaymentReturnPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    // Here you would verify the payment with your backend
    const paymentId = searchParams.get("paymentId");
    const PayerID = searchParams.get("PayerID");

    if (paymentId && PayerID) {
      // Simulate API call
      setTimeout(() => {
        setStatus("success");
      }, 2000);
    } else {
      setStatus("error");
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        {status === "processing" && (
          <>
            <h1 className="text-2xl font-bold mb-4">Processing Payment</h1>
            <p className="text-muted-foreground mb-8">
              Please wait while we verify your payment...
            </p>
            <div className="animate-pulse bg-primary/10 rounded-full w-16 h-16 mx-auto" />
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
            <p className="text-muted-foreground mb-8">
              Thank you for your purchase. You can now access your course.
            </p>
            <div className="space-y-4">
              <Button
                className="w-full"
                onClick={() => navigate("/student-courses")}
              >
                Go to My Courses
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/courses")}
              >
                Browse More Courses
              </Button>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-16 h-16 text-destructive mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-4">Payment Failed</h1>
            <p className="text-muted-foreground mb-8">
              We couldn't process your payment. Please try again or contact support.
            </p>
            <div className="space-y-4">
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => window.history.back()}
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/courses")}
              >
                Return to Courses
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
