"use client";

import { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import AISection from "@/components/landing/AISection";
import DashboardSection from "@/components/landing/DashboardSection";
import Footer from "@/components/landing/Footer";
import {
  initGSAP,
  createParallaxEffect,
  createFadeInAnimation,
  createSlideInAnimation,
  createHeroParallaxEffect,
} from '@/utlis/animations';

const AnimatedLanding = () => {
  useEffect(() => {
    initGSAP();

    // Hero-specific parallax
    createHeroParallaxEffect();

    // General parallax effects for other sections
    createParallaxEffect("features", ".gsap-image", ".gsap-text", "up");
    createParallaxEffect("ai", ".gsap-image", ".gsap-text", "up");
    createParallaxEffect("dashboard", ".gsap-image", ".gsap-text", "down");

    createFadeInAnimation(".gsap-title");
    createFadeInAnimation(".gsap-feature");

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
        <DashboardSection />
      </main>
      <Footer />
    </div>
  );
};

export default AnimatedLanding;