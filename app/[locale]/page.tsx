"use client";

import { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import AISection from "@/components/landing/AISection";
import AnalysisSection from "@/components/landing/AnalysisSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FAQSection from "@/components/landing/FAQSection";
import ReassuranceSection from "@/components/landing/ReassuranceSection";
import Footer from "@/components/landing/Footer";
import {
  initGSAP,
  createParallaxEffect,
  createFadeInAnimation,
  createSlideInAnimation,
} from '@/utlis/animations';

const AnimatedLanding = () => {
  useEffect(() => {
    // Initialize GSAP
    initGSAP();

    // Create parallax effects for each section
    // Avoid animating the hero on small screens to prevent overlap with the fixed navbar
    if (typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches) {
      createParallaxEffect("hero", ".gsap-image", ".gsap-text", "up");
    }
    createParallaxEffect("features", ".gsap-image", ".gsap-text", "up");
    createParallaxEffect("ai", ".gsap-image", ".gsap-text", "up");
    createParallaxEffect("dashboard", ".gsap-image", ".gsap-text", "up");

    // Create fade-in animations
    createFadeInAnimation(".gsap-title");
    createFadeInAnimation(".gsap-feature");

    // Create slide-in animations
    createSlideInAnimation(".gsap-text", "left");
    createSlideInAnimation(".gsap-image", "right");

  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Spacer under the fixed navbar */}
        <div className="h-10 md:h-16 lg:h-20" aria-hidden="true" />
        <HeroSection />
        <FeaturesSection />
        <AISection />
        <AnalysisSection />
        <HowItWorksSection />
        <ReassuranceSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default AnimatedLanding;