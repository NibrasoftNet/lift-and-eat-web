import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Initialize GSAP plugins
export const initGSAP = () => {
  if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }
};

// Parallax effect for general sections
export const createParallaxEffect = (
  sectionId: string,
  imageElement: string,
  textElement: string,
  direction: "up" | "down" = "up"
) => {
  if (typeof window === "undefined") return;

  const section = document.querySelector(`#${sectionId}`);
  if (!section) return;

  const image = section.querySelector(imageElement);
  const text = section.querySelector(textElement);

  if (!image || !text) return;

  const speed = direction === "up" ? -1 : 1;

  ScrollTrigger.create({
    trigger: section,
    start: "top bottom",
    end: "bottom top",
    onUpdate: (self) => {
      gsap.to(image, {
        y: self.progress * 100 * speed,
        ease: "none",
        overwrite: "auto",
      });
      gsap.to(text, {
        y: self.progress * 50 * speed * -1, // text moves in opposite direction
        ease: "none",
        overwrite: "auto",
      });
    },
  });
};

// Fade in animation when element enters viewport
export const createFadeInAnimation = (element: string) => {
  if (typeof window === "undefined") return;

  const elements = document.querySelectorAll(element);
  if (elements.length === 0) return;

  elements.forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });
};

// Slide in animation from left or right
export const createSlideInAnimation = (
  element: string,
  direction: "left" | "right" = "left"
) => {
  if (typeof window === "undefined") return;

  const elements = document.querySelectorAll(element);
  if (elements.length === 0) return;

  const x = direction === "left" ? -100 : 100;

  elements.forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, x },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });
};

// Hero-specific parallax: text slides behind image
export const createHeroParallaxEffect = () => {
  if (typeof window === "undefined") return;

  const hero = document.querySelector("#hero");
  const text = hero?.querySelector(".gsap-text");
  const image = hero?.querySelector(".gsap-image");

  console.log("Hero Parallax:", { hero, text, image });

  if (!hero || !text || !image) return;

  // Ensure stacking context
  gsap.set(hero, { position: "relative" });
  gsap.set(text, { zIndex: 10, position: "relative" });
  gsap.set(image, { zIndex: 20, position: "relative" });

  // Animate TEXT (behind)
  gsap.to(text, {
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
    y: -100,
    opacity: 0.3,
    ease: "none",
  });

  // Animate IMAGE (above)
  gsap.to(image, {
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
    y: -30,
    scale: 1.05,
    ease: "none",
  });
};