"use client";

import { Heart, Calendar, Clock } from "lucide-react";
import type { HeroBlockData, ColorScheme } from "@/types/invitation-blocks";
import { useEffect, useState } from "react";

interface HeroBlockProps {
  data: HeroBlockData;
  eventDate: string;
  eventTime: string;
  colorScheme: ColorScheme;
}

function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-4 justify-center mt-8">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center">
          <div
            className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 min-w-[70px]"
            style={{ borderColor: 'rgba(255,255,255,0.2)', borderWidth: '1px' }}
          >
            <div className="text-3xl font-bold text-white">{value}</div>
            <div className="text-xs text-white/80 uppercase mt-1">
              {unit === 'days' && 'Días'}
              {unit === 'hours' && 'Horas'}
              {unit === 'minutes' && 'Min'}
              {unit === 'seconds' && 'Seg'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function HeroBlock({ data, eventDate, eventTime, colorScheme }: HeroBlockProps) {
  const backgroundStyle = data.backgroundImage
    ? {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${data.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {
        background: `linear-gradient(135deg, ${colorScheme.primary} 0%, ${colorScheme.secondary} 100%)`,
      };

  const formattedDate = new Date(eventDate).toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      className="relative min-h-[60vh] flex items-center justify-center text-white py-16 px-4"
      style={backgroundStyle}
    >
      <div className="max-w-3xl mx-auto text-center space-y-6">
        {/* Icon/Heart */}
        <div className="mb-6">
          <Heart
            className="h-16 w-16 mx-auto animate-pulse"
            fill="white"
            stroke="white"
          />
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight">
          {data.title}
        </h1>

        {/* Subtitle */}
        {data.subtitle && (
          <p className="text-xl md:text-2xl text-white/90 font-light italic">
            {data.subtitle}
          </p>
        )}

        {/* Date and Time */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-8 text-lg">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>{formattedDate}</span>
          </div>
          <div className="hidden md:block text-white/50">|</div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>{eventTime}</span>
          </div>
        </div>

        {/* Countdown */}
        {data.showCountdown && (
          <Countdown targetDate={`${eventDate}T${eventTime}`} />
        )}

        {/* Decorative divider */}
        <div className="pt-8">
          <div className="w-24 h-[2px] mx-auto bg-white/30"></div>
        </div>
      </div>
    </div>
  );
}
