"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  category: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: "/hero/hero-background.jpg",
    title: "BODAS DE",
    subtitle: "ENSUEÑO",
    description:
      "Creamos momentos únicos e inolvidables para el día más importante de tu vida. Cada detalle pensado para hacer realidad tus sueños.",
    cta: "Planea tu Boda",
    category: "Bodas",
  },
  {
    id: 2,
    image: "/hero/hero-background2.jpg",
    title: "EVENTOS",
    subtitle: "CORPORATIVOS",
    description:
      "Profesionalismo y elegancia se combinan para crear experiencias empresariales impactantes que reflejen la excelencia de tu marca.",
    cta: "Organiza tu Evento",
    category: "Corporativo",
  },
  {
    id: 3,
    image: "/hero/hero-background3.jpg",
    title: "CELEBRACIONES",
    subtitle: "FAMILIARES",
    description:
      "Cumpleaños, quinceañeros, baby showers... Celebramos contigo los momentos más especiales de tu familia con alegría y estilo.",
    cta: "Celebra con Nosotros",
    category: "Familiar",
  },
  {
    id: 4,
    image: "/hero/hero-background4.jpg",
    title: "EXPERIENCIAS BRUTALES",
    subtitle: "",
    description:
      "No solo organizamos eventos, diseñamos experiencias que quedan grabadas para siempre en el corazón de tus invitados.",
    cta: "Crea tu Experiencia",
    category: "Premium",
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  // Auto-advance slides every 4 seconds
  useEffect(() => {
    if (!isAutoplay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoplay]);

  // Pause autoplay on hover
  const handleMouseEnter = () => setIsAutoplay(false);
  const handleMouseLeave = () => setIsAutoplay(true);

  // Manual slide navigation
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoplay(false);
    // Resume autoplay after 8 seconds of inactivity
    setTimeout(() => setIsAutoplay(true), 8000);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section
      className="hero-slider"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Images */}
      <div className="hero-slider-backgrounds">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slider-background ${
              index === currentSlide ? "active" : ""
            }`}
          >
            <Image
              src={slide.image}
              alt={`${slide.category} - ${slide.title} ${slide.subtitle}`}
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
        <div className="hero-slider-text">
          {/* Category Badge */}
          <div className="hero-category-badge">{currentSlideData.category}</div>

          {/* Main Title */}
          <h1 className="hero-slider-title">
            {currentSlideData.title}
            <br />
            <span>{currentSlideData.subtitle}</span>
          </h1>

          {/* Description */}
          <p className="hero-slider-description">
            {currentSlideData.description}
          </p>

          {/* CTA Button */}
          <button className="hero-slider-button">{currentSlideData.cta}</button>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="hero-slider-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`hero-slider-indicator ${
              index === currentSlide ? "active" : ""
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir al slide ${index + 1}`}
          >
            <span className="hero-slider-indicator-progress">
              {index === currentSlide && (
                <span
                  className="hero-slider-indicator-fill"
                  style={{
                    animationDuration: isAutoplay ? "4s" : "0s",
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
            goToSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1)
          }
          aria-label="Slide anterior"
        >
          ←
        </button>
        <button
          className="hero-slider-nav-btn hero-slider-nav-next"
          onClick={() =>
            goToSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1)
          }
          aria-label="Siguiente slide"
        >
          →
        </button>
      </div>
    </section>
  );
}
