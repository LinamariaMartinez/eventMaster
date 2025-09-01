"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Background images for carousel
const backgroundImages = [
  "/hero/hero-background3.jpg",
  "/hero/hero-background2.jpg",
  "/hero/hero-background.jpg",
  "/hero/hero-background4.jpg",
];

// Rotating text phrases
const rotatingTexts = [
  "Nadie Olvida",
  "Marcan Historia",
  "Son BRUTALES",
  "Quedan en el Corazón",
];

export function HeroSlider() {
  const [currentBg, setCurrentBg] = useState(0);
  const [currentText, setCurrentText] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  // Auto-advance background images every 5 seconds
  useEffect(() => {
    if (!isAutoplay) return;

    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoplay]);

  // Auto-rotate text every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % rotatingTexts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Pause autoplay on hover
  const handleMouseEnter = () => setIsAutoplay(false);
  const handleMouseLeave = () => setIsAutoplay(true);

  // Manual background navigation
  const goToBg = (index: number) => {
    setCurrentBg(index);
    setIsAutoplay(false);
    // Resume autoplay after 8 seconds of inactivity
    setTimeout(() => setIsAutoplay(true), 8000);
  };

  return (
    <section
      className="hero-slider"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Images */}
      <div className="hero-slider-backgrounds">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`hero-slider-background ${
              index === currentBg ? "active" : ""
            }`}
          >
            <Image
              src={image}
              alt={`Eventos que ${rotatingTexts[currentText]}`}
              fill
              style={{ objectFit: "cover" }}
              priority={index === 0}
              quality={90}
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      {/* Overlay */}
      <div className="hero-slider-overlay"></div>

      {/* Content */}
      <div className="hero-slider-content">
        {/* Top Section - Title and Description */}
        <div className="hero-slider-top">
          <div className="hero-slider-text-overlay">
            <h1 className="hero-slider-title">
              EVENTOS QUE
              <br />
              <span key={currentText}>{rotatingTexts[currentText]}</span>
            </h1>

            <p className="hero-slider-description">
              NO solo organizamos eventos, diseñamos experiencias
            </p>
          </div>
        </div>

        {/* Center Section - Protagonizes the image */}
        <div className="hero-slider-center"></div>

        {/* Bottom Section - CTA */}
        <div className="hero-slider-bottom">
          <button className="hero-slider-button">Crea tu Experiencia</button>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="hero-slider-indicators">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            className={`hero-slider-indicator ${
              index === currentBg ? "active" : ""
            }`}
            onClick={() => goToBg(index)}
            aria-label={`Ir al fondo ${index + 1}`}
          >
            <span className="hero-slider-indicator-progress">
              {index === currentBg && (
                <span
                  className="hero-slider-indicator-fill"
                  style={{
                    animationDuration: isAutoplay ? "5s" : "0s",
                    animationPlayState: isAutoplay ? "running" : "paused",
                  }}
                />
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Navigation Arrows (Optional - Hidden on mobile) */}
      <div className="hero-slider-nav">
        <button
          className="hero-slider-nav-btn hero-slider-nav-prev"
          onClick={() =>
            goToBg(
              currentBg === 0 ? backgroundImages.length - 1 : currentBg - 1,
            )
          }
          aria-label="Fondo anterior"
        >
          ←
        </button>
        <button
          className="hero-slider-nav-btn hero-slider-nav-next"
          onClick={() =>
            goToBg(
              currentBg === backgroundImages.length - 1 ? 0 : currentBg + 1,
            )
          }
          aria-label="Siguiente fondo"
        >
          →
        </button>
      </div>
    </section>
  );
}
