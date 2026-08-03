import React from "react";
import { cn } from "../../utils/cn";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className={cn(
            "min-h-[60vh] flex flex-col items-center justify-center text-center p-6",
          )}
        >
          <div
            className={cn(
              "bg-red-50 p-8 rounded-2xl border border-red-100 max-w-lg w-full",
            )}
          >
            <i
              className={cn(
                "fa-solid fa-triangle-exclamation text-5xl text-red-500 mb-4 block",
              )}
            ></i>
            <h1 className={cn("text-2xl font-bold text-gray-900 mb-2")}>
              Something went wrong.
            </h1>
            <p className={cn("text-gray-500 mb-6")}>
              We encountered an unexpected error while loading this component.
            </p>
            <button
              onClick={() => window.location.reload()}
              className={cn(
                "bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors",
              )}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
