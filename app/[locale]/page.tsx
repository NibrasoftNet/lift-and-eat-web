"use client";

import { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import AISection from "@/components/landing/AISection";
import AnalysisSection from "@/components/landing/AnalysisSection";
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
    createParallaxEffect("hero", ".gsap-image", ".gsap-text", "up");
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
        <HeroSection />
        <FeaturesSection />
        <AISection />
        <AnalysisSection />
      </main>
      <Footer />
    </div>
  );
};

export default AnimatedLanding;