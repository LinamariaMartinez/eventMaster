"use client";

import { Heart, Calendar, Clock } from "lucide-react";
import type { HeroBlockData, ColorScheme } from "@/types/invitation-blocks";
import { useEffect, useState } from "react";
import { formatEventDate, formatEventTime } from "@/lib/utils/date";

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
        backgroundSize: data.backgroundSize || 'cover',
        backgroundPosition: data.backgroundPosition || 'center',
        backgroundRepeat: 'no-repeat',
      }
    : {
        background: `linear-gradient(135deg, ${colorScheme.primary} 0%, ${colorScheme.secondary} 100%)`,
      };

  const formattedDate = formatEventDate(eventDate);
  const formattedTime = formatEventTime(eventTime);

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
        <h1
          className="font-serif font-bold leading-tight"
          style={{
            color: data.textColor ?? 'white',
            textShadow: data.textShadow ?? '2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)',
            fontSize: 'clamp(2rem, 8vw, 4.5rem)',
          }}
        >
          {data.title}
        </h1>

        {/* Subtitle */}
        {data.subtitle && (
          <p
            className="font-light italic"
            style={{
              color: data.textColor ?? 'white',
              opacity: 0.9,
              textShadow: data.textShadow ?? '1px 1px 4px rgba(0,0,0,0.8)',
              fontSize: 'clamp(1rem, 4vw, 1.5rem)',
            }}
          >
            {data.subtitle}
          </p>
        )}

        {/* Date and Time */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mt-8">
          <div className="flex items-center gap-2">
            <Calendar
              className="h-4 w-4 md:h-5 md:w-5"
              style={{
                color: data.dateColor ?? data.textColor ?? 'white',
                filter: `drop-shadow(${data.dateShadow ?? data.textShadow ?? '1px 1px 4px rgba(0,0,0,0.8)'})`,
              }}
            />
            <span
              style={{
                color: data.dateColor ?? data.textColor ?? 'white',
                textShadow: data.dateShadow ?? data.textShadow ?? '1px 1px 4px rgba(0,0,0,0.8)',
                fontSize: data.dateSize === 'small' ? 'clamp(0.875rem, 3vw, 1rem)' : data.dateSize === 'large' ? 'clamp(1.125rem, 4vw, 1.5rem)' : 'clamp(1rem, 3.5vw, 1.25rem)',
                fontWeight: data.dateSize === 'large' ? 'bold' : 'normal',
              }}
            >
              {formattedDate}
            </span>
          </div>
          <div
            className="hidden md:block opacity-50"
            style={{
              color: data.dateColor ?? data.textColor ?? 'white',
            }}
          >
            |
          </div>
          <div className="flex items-center gap-2">
            <Clock
              className="h-4 w-4 md:h-5 md:w-5"
              style={{
                color: data.dateColor ?? data.textColor ?? 'white',
                filter: `drop-shadow(${data.dateShadow ?? data.textShadow ?? '1px 1px 4px rgba(0,0,0,0.8)'})`,
              }}
            />
            <span
              style={{
                color: data.dateColor ?? data.textColor ?? 'white',
                textShadow: data.dateShadow ?? data.textShadow ?? '1px 1px 4px rgba(0,0,0,0.8)',
                fontSize: data.dateSize === 'small' ? 'clamp(0.875rem, 3vw, 1rem)' : data.dateSize === 'large' ? 'clamp(1.125rem, 4vw, 1.5rem)' : 'clamp(1rem, 3.5vw, 1.25rem)',
                fontWeight: data.dateSize === 'large' ? 'bold' : 'normal',
              }}
            >
              {formattedTime}
            </span>
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
