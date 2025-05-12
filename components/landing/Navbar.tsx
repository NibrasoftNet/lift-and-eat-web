import { useState, useEffect } from "react";
import { ModeToggle } from "../ModeToggle";
import { LocaleSwitcher } from '../LocaleSwitcher';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "shadow-md backdrop-blur-md py-2"
          : "py-4"
      }`}
    >
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <span className="font-bold text-lg">L&E</span>
          </div>
          <h1 className="text-xl font-bold">lift & eat</h1>
        </div>
        <div className="hidden md:flex gap-8">
          <a href="#features" className="hover:underline transition-all easy-in-out">
            Features
          </a>
          <a href="#ai" className="hover:underline transition-all easy-in-out">
            AI Planning
          </a>
          <a href="#dashboard" className="hover:underline transition-all easy-in-out">
            Dashboard
          </a>
        </div>
        <div className="flex gap-4">
          <ModeToggle />
          <LocaleSwitcher />
        </div>
      </div>
    </nav>
  );
}