import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import IntroAnimation from "./IntroAnimation";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [showIntro, setShowIntro] = useState(true);
  const [introComplete, setIntroComplete] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Only show intro on initial home page load
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");
    if (hasSeenIntro || location.pathname !== "/") {
      setShowIntro(false);
      setIntroComplete(true);
    }
  }, [location.pathname]);

  const handleIntroComplete = () => {
    sessionStorage.setItem("hasSeenIntro", "true");
    setIntroComplete(true);
  };

  return (
    <>
      {showIntro && !introComplete && (
        <IntroAnimation onComplete={handleIntroComplete} />
      )}
      
      <div
        className={`min-h-screen transition-opacity duration-500 ${
          introComplete ? "opacity-100" : "opacity-0"
        }`}
      >
        <Navigation />
        <main>{children}</main>
      </div>
    </>
  );
};

export default Layout;
