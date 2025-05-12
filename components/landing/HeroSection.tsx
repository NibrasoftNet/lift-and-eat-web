import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Apple, Play } from "lucide-react";
import { heroImage } from '@/utlis/constant';

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="section min-h-screen flex items-center"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 gsap-text">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Track Your Nutrition.{" "}
              <span className="text-nutrition-green">Smarter.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-lg">
              The all-in-one app that helps you track your meals, plan your nutrition, and achieve your fitness goals with AI-powered insights.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button className="bg-black hover:bg-gray-800 text-white flex items-center gap-2 px-6 py-6">
                <Apple className="h-6 w-6" />
                <div className="flex flex-col items-start">
                  <span className="text-xs">Download on the</span>
                  <span className="text-lg font-semibold">App Store</span>
                </div>
              </Button>
              <Button className="bg-black hover:bg-gray-800 text-white flex items-center gap-2 px-6 py-6">
                <Play className="h-6 w-6" />
                <div className="flex flex-col items-start">
                  <span className="text-xs">GET IT ON</span>
                  <span className="text-lg font-semibold">Google Play</span>
                </div>
              </Button>
            </div>
          </div>
          <div className="flex justify-center gsap-image">
            <div className="mockup-phone">
              <div className="mockup-screen">
                <img
                  src={heroImage}
                  alt="Lift & Eat App"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;