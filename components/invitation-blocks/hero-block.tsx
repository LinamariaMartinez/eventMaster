"use client";

import { Calendar, Clock, MapPin } from "lucide-react";
import type { HeroBlockData, ColorScheme } from "@/types/invitation-blocks";
import { useEffect, useState } from "react";
import { formatEventDate, formatEventTime } from "@/lib/utils/date";
import Image from "next/image";

interface HeroBlockProps {
  data: HeroBlockData;
  eventDate: string;
  eventTime: string;
  eventLocation?: string;
  colorScheme: ColorScheme;
}

function Countdown({ targetDate, colorScheme }: { targetDate: string; colorScheme: ColorScheme }) {
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
    <div className="flex gap-3 justify-center mt-6 animate-fade-in">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center">
          <div
            className="rounded-lg px-3 py-2 min-w-[60px] md:min-w-[70px]"
            style={{
              backgroundColor: colorScheme.primary,
              opacity: 0.95,
            }}
          >
            <div
              className="text-2xl md:text-3xl font-bold"
              style={{ color: 'white' }}
            >
              {value}
            </div>
            <div
              className="text-xs uppercase mt-1"
              style={{ color: 'rgba(255,255,255,0.9)' }}
            >
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

export function HeroBlock({ data, eventDate, eventTime, eventLocation, colorScheme }: HeroBlockProps) {
  const formattedDate = formatEventDate(eventDate);
  const formattedTime = formatEventTime(eventTime);
  const hasImage = !!data.backgroundImage;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: colorScheme.background }}
    >
      {/* Mobile: Vertical Layout */}
      <div className="lg:hidden">
        {/* Image Section - 60vh on mobile */}
        <div className="relative w-full h-[60vh] rounded-b-3xl overflow-hidden">
          {hasImage ? (
            <div className="relative w-full h-full animate-fade-in">
              <Image
                src={data.backgroundImage!}
                alt={data.title}
                fill
                className="object-cover"
                style={{
                  objectPosition: data.backgroundPosition || 'center',
                }}
                priority
              />
            </div>
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${colorScheme.primary} 0%, ${colorScheme.secondary} 100%)`,
              }}
            >
              <div className="text-center p-8">
                <div
                  className="text-6xl mb-4"
                  style={{ color: 'white' }}
                >
                  🎉
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="px-6 py-10 space-y-6 animate-fade-in">
          {/* Context Text */}
          {data.subtitle && (
            <p
              className="text-center text-sm font-light tracking-wide uppercase"
              style={{ color: colorScheme.textLight }}
            >
              {data.subtitle}
            </p>
          )}

          {/* Title */}
          <h1
            className="text-center font-serif font-bold leading-tight text-4xl"
            style={{ color: colorScheme.primary }}
          >
            {data.title}
          </h1>

          {/* Event Details */}
          <div className="space-y-3 pt-2">
            <div
              className="flex items-center justify-center gap-3 text-base"
              style={{ color: colorScheme.text }}
            >
              <Calendar className="h-5 w-5" style={{ color: colorScheme.primary }} />
              <span>{formattedDate}</span>
            </div>
            <div
              className="flex items-center justify-center gap-3 text-base"
              style={{ color: colorScheme.text }}
            >
              <Clock className="h-5 w-5" style={{ color: colorScheme.primary }} />
              <span>{formattedTime}</span>
            </div>
            {eventLocation && (
              <div
                className="flex items-center justify-center gap-3 text-base"
                style={{ color: colorScheme.text }}
              >
                <MapPin className="h-5 w-5" style={{ color: colorScheme.primary }} />
                <span>{eventLocation}</span>
              </div>
            )}
          </div>

          {/* Countdown */}
          {data.showCountdown && (
            <div className="pt-4">
              <Countdown targetDate={`${eventDate}T${eventTime}`} colorScheme={colorScheme} />
            </div>
          )}

          {/* Decorative divider */}
          <div className="pt-6 flex justify-center">
            <div
              className="w-20 h-1 rounded-full"
              style={{ backgroundColor: colorScheme.accent }}
            />
          </div>
        </div>
      </div>

      {/* Desktop: 50/50 Split Layout */}
      <div className="hidden lg:flex min-h-[80vh]">
        {/* Image Section - 50% */}
        <div className="w-1/2 relative">
          {hasImage ? (
            <div className="relative w-full h-full animate-fade-in">
              <Image
                src={data.backgroundImage!}
                alt={data.title}
                fill
                className="object-cover"
                style={{
                  objectPosition: data.backgroundPosition || 'center',
                }}
                priority
              />
            </div>
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${colorScheme.primary} 0%, ${colorScheme.secondary} 100%)`,
              }}
            >
              <div className="text-center p-12">
                <div
                  className="text-9xl mb-6"
                  style={{ color: 'white' }}
                >
                  🎉
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Section - 50% */}
        <div className="w-1/2 flex items-center justify-center p-12 animate-fade-in">
          <div className="max-w-xl space-y-8">
            {/* Context Text */}
            {data.subtitle && (
              <p
                className="text-center text-sm font-light tracking-wide uppercase"
                style={{ color: colorScheme.textLight }}
              >
                {data.subtitle}
              </p>
            )}

            {/* Title */}
            <h1
              className="text-center font-serif font-bold leading-tight"
              style={{
                color: colorScheme.primary,
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              }}
            >
              {data.title}
            </h1>

            {/* Event Details */}
            <div className="space-y-4 pt-4">
              <div
                className="flex items-center justify-center gap-4 text-lg"
                style={{ color: colorScheme.text }}
              >
                <Calendar className="h-6 w-6" style={{ color: colorScheme.primary }} />
                <span>{formattedDate}</span>
              </div>
              <div
                className="flex items-center justify-center gap-4 text-lg"
                style={{ color: colorScheme.text }}
              >
                <Clock className="h-6 w-6" style={{ color: colorScheme.primary }} />
                <span>{formattedTime}</span>
              </div>
              {eventLocation && (
                <div
                  className="flex items-center justify-center gap-4 text-lg"
                  style={{ color: colorScheme.text }}
                >
                  <MapPin className="h-6 w-6" style={{ color: colorScheme.primary }} />
                  <span className="text-center">{eventLocation}</span>
                </div>
              )}
            </div>

            {/* Countdown */}
            {data.showCountdown && (
              <div className="pt-6">
                <Countdown targetDate={`${eventDate}T${eventTime}`} colorScheme={colorScheme} />
              </div>
            )}

            {/* Decorative divider */}
            <div className="pt-8 flex justify-center">
              <div
                className="w-24 h-1 rounded-full"
                style={{ backgroundColor: colorScheme.accent }}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
