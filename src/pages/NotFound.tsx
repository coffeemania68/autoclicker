
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-md text-center space-y-6 px-4">
        <div className="relative w-24 h-24 mx-auto mb-2">
          <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
          <div className="absolute inset-2 bg-primary/20 rounded-full animate-pulse [animation-delay:150ms]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-5xl font-bold">404</h1>
          </div>
        </div>
        
        <h2 className="text-xl font-medium text-foreground">Page not found</h2>
        <p className="text-muted-foreground">
          The page you were looking for doesn't exist or has been moved.
        </p>
        
        <a 
          href="/" 
          className="inline-flex items-center gap-2 mt-6 text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to home</span>
        </a>
      </div>
    </div>
  );
};

export default NotFound;
