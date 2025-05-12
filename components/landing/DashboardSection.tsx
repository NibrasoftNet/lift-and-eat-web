import { useRef } from "react";
import { Button } from "@/components/ui/button";

const DashboardSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="dashboard"
      ref={sectionRef}
      className="section py-20"
    >
      <div className="container mx-auto">
        <div className="text-center mb-12 gsap-title">
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Monitor Your Progress Like a Pro
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 gsap-text">
            <p className="text-xl text-gray-300">
              Visualize your nutrition journey with our intuitive dashboard. Track calories, macros, weight trends, and more in one easy-to-use interface.
            </p>

            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg gsap-feature">
                <h3 className="font-semibold text-xl mb-2 text-nutrition-light-green">Comprehensive Analytics</h3>
                <p className="text-gray-300">
                  Get detailed insights on your macros, calories, hydration, weight, and more through interactive charts.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg gsap-feature">
                <h3 className="font-semibold text-xl mb-2 text-nutrition-light-green">Progress Trends</h3>
                <p className="text-gray-300">
                  View your progress over time with daily, weekly, and monthly reports to keep you motivated.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg gsap-feature">
                <h3 className="font-semibold text-xl mb-2 text-nutrition-light-green">Smart Alerts</h3>
                <p className="text-gray-300">
                  Receive notifications when you&#39;re falling behind on your goals or when you&#39;re making excellent progress.
                </p>
              </div>
            </div>

            <Button size="lg" className="mt-6 bg-nutrition-green hover:bg-nutrition-light-green text-white px-8 py-6 text-lg">
              Start Tracking Now
            </Button>
          </div>

          <div className="gsap-image">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Dashboard Analytics"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;