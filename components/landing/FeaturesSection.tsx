import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const FeaturesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="section bg-gray-50 py-20"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 gsap-image">
            <img
              src="https://images.unsplash.com/photo-1543362906-acfc16c67564?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Nutrition Plans"
              className="w-full h-auto rounded-lg shadow-xl"
            />
          </div>
          <div className="space-y-8 order-1 md:order-2 gsap-text">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Tailored Nutrition Plans for Every Goal
              </h2>
              <p className="text-gray-700 mb-6">
                Personalized meal plans and nutrition tracking that adapts to your unique lifestyle, preferences, and fitness objectives.
              </p>
            </div>

            <div className="space-y-4">
              <Card className="border-l-4 border-nutrition-green gsap-feature">
                <CardContent className="p-4 flex items-start gap-4">
                  <CheckCircle className="text-nutrition-green mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg">Multiple Nutrition Plans</h3>
                    <p className="text-gray-600">Keto, Vegan, Paleo, and more - all customized to your macronutrient needs and preferences.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-nutrition-blue gsap-feature">
                <CardContent className="p-4 flex items-start gap-4">
                  <CheckCircle className="text-nutrition-blue mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg">Goal Creation System</h3>
                    <p className="text-gray-600">Set and track specific targets for weight loss, muscle gain, athletic performance, or overall wellness.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-nutrition-light-green gsap-feature">
                <CardContent className="p-4 flex items-start gap-4">
                  <CheckCircle className="text-nutrition-light-green mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg">Share Your Progress</h3>
                    <p className="text-gray-600">Connect with friends or coaches to share your goals, progress, and get motivation when you need it most.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;