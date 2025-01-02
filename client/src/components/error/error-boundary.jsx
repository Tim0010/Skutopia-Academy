import React from 'react';
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to your error tracking service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md w-full p-8 bg-card rounded-lg shadow-lg">
            <div className="flex flex-col items-center text-center">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
              <p className="text-muted-foreground mb-6">
                We're sorry, but something went wrong. Please try refreshing the page
                or contact support if the problem persists.
              </p>
              <div className="space-x-4">
                <Button
                  onClick={() => window.location.reload()}
                  variant="default"
                >
                  Refresh Page
                </Button>
                <Button
                  onClick={() => window.history.back()}
                  variant="outline"
                >
                  Go Back
                </Button>
              </div>
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-8 text-left w-full">
                  <details className="text-sm text-muted-foreground">
                    <summary className="cursor-pointer mb-2">Error Details</summary>
                    <pre className="bg-muted p-4 rounded overflow-auto">
                      {this.state.error && this.state.error.toString()}
                      <br />
                      {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
