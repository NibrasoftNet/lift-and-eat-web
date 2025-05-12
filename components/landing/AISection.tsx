import { useRef } from "react";

const AISection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="ai"
      ref={sectionRef}
      className="section py-20"
    >
      <div className="container mx-auto">
        <div className="text-center mb-12 gsap-title">
          <h2 className="text-3xl md:text-4xl font-bold">
            Smarter Meal Plans with{" "}
            <span className="text-nutrition-blue">AI</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 gsap-text">
            <p className="text-lg text-gray-700">
              Our advanced AI technology analyzes your preferences, dietary restrictions, and goals to create perfectly balanced meal plans tailored just for you.
            </p>

            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md gsap-feature">
                <h3 className="font-semibold text-xl mb-2">Personalized Recommendations</h3>
                <p className="text-gray-600">
                  The more you use the app, the more our AI learns about your preferences and adjusts recommendations accordingly.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md gsap-feature">
                <h3 className="font-semibold text-xl mb-2">Adaptive Meal Plans</h3>
                <p className="text-gray-600">
                  As your goals or preferences change, our AI automatically adapts your meal plans to keep you on track.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md gsap-feature">
                <h3 className="font-semibold text-xl mb-2">Smart Grocery Lists</h3>
                <p className="text-gray-600">
                  Get automatically generated shopping lists based on your meal plans to streamline your grocery shopping.
                </p>
              </div>
            </div>
          </div>

          <div className="gsap-image">
            <img
              src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="AI Meal Planning"
              className="w-full h-auto rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AISection;