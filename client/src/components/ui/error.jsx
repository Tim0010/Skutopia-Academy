import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "./button";
import { Alert, AlertDescription, AlertTitle } from "./alert";

export function ErrorAlert({ 
  title = "Error",
  message = "Something went wrong. Please try again.",
  onRetry,
  className = "" 
}) {
  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{message}</span>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="ml-4"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

export function ErrorPage({
  title = "Error",
  message = "Something went wrong. Please try again.",
  onRetry,
  onBack
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        {message}
      </p>
      <div className="flex gap-4">
        {onRetry && (
          <Button onClick={onRetry} variant="default">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
        {onBack && (
          <Button onClick={onBack} variant="outline">
            Go Back
          </Button>
        )}
      </div>
    </div>
  );
}
