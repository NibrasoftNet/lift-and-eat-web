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
    // Set initial state immediately to avoid layout shift
    gsap.set(el, { opacity: 0, y: 50 });
    
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
          start: "top 90%",
          end: "bottom 50%",
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
    const isImage = (el as Element).classList?.contains("gsap-image");

    // Set initial state immediately to avoid layout shift
    gsap.set(el, { opacity: 0, x, ...(isImage ? { zIndex: 1 } : {}) });

    gsap.fromTo(
      el,
      { opacity: 0, x, ...(isImage ? { zIndex: 1 } : {}) },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power2.out",
        // keep images behind navbar during the whole animation
        ...(isImage ? { zIndex: 1 } : {}),
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          end: "bottom 50%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });
};