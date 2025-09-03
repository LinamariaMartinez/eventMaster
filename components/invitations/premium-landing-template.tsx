"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Gift, 
  MessageSquare,
  Music,
  Camera,
  Utensils,
  Star,
  CheckCircle,
  ArrowDown,
  Phone,
  Mail
} from "lucide-react";
import type { Database } from "@/types/database.types";

type Event = Database['public']['Tables']['events']['Row'];

interface PremiumLandingTemplateProps {
  event: Event;
  templateId: string;
}

export function PremiumLandingTemplate({ event, templateId }: PremiumLandingTemplateProps) {
  const [currentSection, setCurrentSection] = useState("hero");

  // Calculate days until event
  const calculateDaysUntilEvent = () => {
    const eventDate = new Date(event.date);
    const today = new Date();
    const timeDifference = eventDate.getTime() - today.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return daysDifference;
  };

  const daysUntilEvent = calculateDaysUntilEvent();

  // Get romantic phrases based on template type
  const getRomanticPhrases = () => {
    const phrases = {
      elegant: [
        "Dos corazones que se unen para siempre",
        "El amor verdadero encuentra su camino",
        "Juntos escribiremos nuestra historia de amor",
        "Tu presencia hará este día perfecto"
      ],
      modern: [
        "Celebremos juntos este momento especial",
        "Un nuevo capítulo comienza",
        "La vida es mejor cuando se comparte",
        "Hagamos de este día algo inolvidable"
      ],
      romantic: [
        "El amor es la única fuerza capaz de transformar a un enemigo en amigo",
        "Donde hay amor, hay vida",
        "El mejor regalo es estar juntos",
        "Nuestro amor será eterno como las estrellas"
      ],
      celebration: [
        "¡La vida merece ser celebrada!",
        "Momentos especiales con personas especiales",
        "Que la alegría llene cada rincón",
        "Celebremos la magia de este momento"
      ]
    };

    if (templateId.includes('elegant')) return phrases.elegant;
    if (templateId.includes('modern')) return phrases.modern;
    if (templateId.includes('romantic')) return phrases.romantic;
    if (templateId.includes('celebration')) return phrases.celebration;
    return phrases.elegant;
  };

  const romanticPhrases = getRomanticPhrases();
  const randomPhrase = romanticPhrases[Math.floor(Math.random() * romanticPhrases.length)];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setCurrentSection(sectionId);
    }
  };

  // Sample event timeline - in a real app this would come from event data
  const timeline = [
    { time: "14:00", title: "Llegada de invitados", description: "Recepción con cóctel de bienvenida", icon: Users },
    { time: "15:00", title: "Ceremonia", description: "Intercambio de votos y anillos", icon: Heart },
    { time: "16:00", title: "Sesión de fotos", description: "Fotos grupales y familiares", icon: Camera },
    { time: "17:30", title: "Cena", description: "Menú de tres tiempos", icon: Utensils },
    { time: "19:00", title: "Fiesta", description: "Música y baile hasta altas horas", icon: Music },
  ];

  // Sample menu - in a real app this would come from event data
  const menu = {
    appetizers: [
      { name: "Bruschettas de tomate y albahaca", description: "Pan artesanal con tomates frescos" },
      { name: "Tartines de salmón ahumado", description: "Con queso crema y eneldo" },
      { name: "Croquetas de jamón ibérico", description: "Preparadas al estilo tradicional" }
    ],
    mains: [
      { name: "Salmón a la parrilla", description: "Con risotto de espárragos y salsa de limón" },
      { name: "Pollo en salsa de champiñones", description: "Acompañado de papas gratinadas" },
      { name: "Lasaña vegetariana", description: "Con vegetales de estación y queso parmesano" }
    ],
    desserts: [
      { name: "Torta de bodas", description: "Tres pisos con frutas frescas" },
      { name: "Tiramisú", description: "Preparado con café colombiano" },
      { name: "Helados artesanales", description: "Variedad de sabores" }
    ]
  };

  const getTemplateStyles = () => {
    switch (templateId) {
      case "premium-elegant-landing":
        return {
          primary: "#8B4B6B",
          secondary: "#F5F1E8",
          accent: "#D4AF37",
          text: "#4A4A4A",
          background: "linear-gradient(135deg, #F5F1E8 0%, #E8DCC6 100%)"
        };
      case "premium-modern-landing":
        return {
          primary: "#1E293B",
          secondary: "#F1F5F9",
          accent: "#3B82F6",
          text: "#334155",
          background: "linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)"
        };
      case "premium-romantic-landing":
        return {
          primary: "#BE185D",
          secondary: "#FDF2F8",
          accent: "#EC4899",
          text: "#831843",
          background: "linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)"
        };
      default:
        return {
          primary: "#8B4B6B",
          secondary: "#F5F1E8",
          accent: "#D4AF37",
          text: "#4A4A4A",
          background: "linear-gradient(135deg, #F5F1E8 0%, #E8DCC6 100%)"
        };
    }
  };

  const styles = getTemplateStyles();

  return (
    <div className="min-h-screen" style={{ background: styles.background }}>
      {/* Floating Navigation */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <nav className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border">
          <div className="flex space-x-6 text-sm">
            <button 
              onClick={() => scrollToSection('hero')}
              className={`transition-colors ${currentSection === 'hero' ? 'text-[var(--primary)]' : 'text-gray-600 hover:text-[var(--primary)]'}`}
              style={{ '--primary': styles.primary } as React.CSSProperties}
            >
              Inicio
            </button>
            <button 
              onClick={() => scrollToSection('timeline')}
              className={`transition-colors ${currentSection === 'timeline' ? 'text-[var(--primary)]' : 'text-gray-600 hover:text-[var(--primary)]'}`}
              style={{ '--primary': styles.primary } as React.CSSProperties}
            >
              Cronograma
            </button>
            <button 
              onClick={() => scrollToSection('menu')}
              className={`transition-colors ${currentSection === 'menu' ? 'text-[var(--primary)]' : 'text-gray-600 hover:text-[var(--primary)]'}`}
              style={{ '--primary': styles.primary } as React.CSSProperties}
            >
              Menú
            </button>
            <button 
              onClick={() => scrollToSection('rsvp')}
              className={`transition-colors ${currentSection === 'rsvp' ? 'text-[var(--primary)]' : 'text-gray-600 hover:text-[var(--primary)]'}`}
              style={{ '--primary': styles.primary } as React.CSSProperties}
            >
              Confirmar
            </button>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: templateId.includes('elegant') 
              ? 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")'
              : templateId.includes('modern')
              ? 'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url("https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")'
              : templateId.includes('romantic')
              ? 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")'
              : 'linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.25)), url("https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")'
          }}
        ></div>
        
        {/* Overlay */}
        <div className="absolute inset-0" style={{ background: styles.background, opacity: 0.85 }}></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Decorative Element */}
            <div className="mb-8">
              <div 
                className="w-20 h-1 mx-auto rounded-full mb-6"
                style={{ backgroundColor: styles.accent }}
              ></div>
              <Heart 
                className="h-16 w-16 mx-auto mb-6"
                style={{ color: styles.primary }}
              />
              <div 
                className="w-20 h-1 mx-auto rounded-full"
                style={{ backgroundColor: styles.accent }}
              ></div>
            </div>

            <h1 
              className="text-6xl md:text-7xl font-serif font-bold mb-6 leading-tight"
              style={{ color: styles.primary }}
            >
              {event.title}
            </h1>
            
            <p 
              className="text-xl md:text-2xl mb-4 font-light leading-relaxed"
              style={{ color: styles.text }}
            >
              {randomPhrase}
            </p>

            {/* Countdown Timer */}
            <div className="mb-8">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg inline-block">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div 
                        className="text-3xl font-bold"
                        style={{ color: styles.primary }}
                      >
                        {Math.max(0, daysUntilEvent)}
                      </div>
                      <p className="text-sm text-gray-600">
                        {daysUntilEvent === 1 ? 'día' : 'días'}
                      </p>
                    </div>
                    <div className="h-8 w-px bg-gray-300"></div>
                    <div className="text-sm text-gray-600">
                      {daysUntilEvent > 0 ? 'para el gran día' : 
                       daysUntilEvent === 0 ? '¡Es hoy!' : 
                       'evento pasado'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Event Details */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-4" style={{ color: styles.primary }} />
                  <h3 className="font-semibold mb-2" style={{ color: styles.text }}>Fecha</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(event.date).toLocaleDateString('es-CO', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-4" style={{ color: styles.primary }} />
                  <h3 className="font-semibold mb-2" style={{ color: styles.text }}>Hora</h3>
                  <p className="text-sm text-gray-600">{event.time}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <MapPin className="h-8 w-8 mx-auto mb-4" style={{ color: styles.primary }} />
                  <h3 className="font-semibold mb-2" style={{ color: styles.text }}>Lugar</h3>
                  <p className="text-sm text-gray-600">{event.location}</p>
                </CardContent>
              </Card>
            </div>

            {/* Call to Action */}
            <div className="space-y-4">
              <Button 
                size="lg"
                onClick={() => scrollToSection('rsvp')}
                className="px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                style={{ 
                  backgroundColor: styles.primary,
                  color: 'white'
                }}
              >
                Confirmar Asistencia
              </Button>
              
              <div className="animate-bounce mt-8">
                <ArrowDown 
                  className="h-6 w-6 mx-auto cursor-pointer"
                  style={{ color: styles.primary }}
                  onClick={() => scrollToSection('timeline')}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="py-24 relative">
        {/* Subtle background pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000" fill-opacity="1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}
        ></div>
        
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <div 
                className="w-16 h-1 rounded-full mx-auto mb-6"
                style={{ backgroundColor: styles.accent }}
              ></div>
            </div>
            <h2 
              className="text-4xl md:text-5xl font-serif font-bold mb-4"
              style={{ color: styles.primary }}
            >
              Cronograma del Día
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Únete a nosotros en cada momento especial de nuestra celebración
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <div key={index} className="flex items-start mb-12 last:mb-0">
                <div className="flex-shrink-0 mr-8">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300 relative"
                    style={{ backgroundColor: styles.primary }}
                  >
                    <item.icon className="h-8 w-8 text-white" />
                    {/* Decorative ring */}
                    <div 
                      className="absolute inset-0 rounded-full border-4 opacity-30"
                      style={{ borderColor: styles.accent }}
                    ></div>
                  </div>
                  
                  {/* Connection line for timeline */}
                  {index !== timeline.length - 1 && (
                    <div className="w-0.5 h-20 ml-8 mt-4 bg-gradient-to-b from-gray-300 to-transparent"></div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="bg-white/80 rounded-lg p-6 shadow-lg backdrop-blur-sm">
                    <div className="flex items-center mb-2">
                      <Badge 
                        className="text-sm font-semibold mr-4"
                        style={{ backgroundColor: styles.accent, color: 'white' }}
                      >
                        {item.time}
                      </Badge>
                      <h3 
                        className="text-xl font-semibold"
                        style={{ color: styles.text }}
                      >
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-24" style={{ background: styles.background }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 
              className="text-4xl md:text-5xl font-serif font-bold mb-4"
              style={{ color: styles.primary }}
            >
              Menú Especial
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Disfruta de una experiencia culinaria única preparada especialmente para ti
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            {/* Appetizers */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: styles.primary }}
                  >
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <h3 
                    className="text-2xl font-serif font-bold"
                    style={{ color: styles.primary }}
                  >
                    Entradas
                  </h3>
                </div>
                <div className="space-y-4">
                  {menu.appetizers.map((item, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <h4 className="font-semibold mb-1" style={{ color: styles.text }}>
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Main Courses */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: styles.primary }}
                  >
                    <Utensils className="h-6 w-6 text-white" />
                  </div>
                  <h3 
                    className="text-2xl font-serif font-bold"
                    style={{ color: styles.primary }}
                  >
                    Platos Principales
                  </h3>
                </div>
                <div className="space-y-4">
                  {menu.mains.map((item, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <h4 className="font-semibold mb-1" style={{ color: styles.text }}>
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Desserts */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: styles.primary }}
                  >
                    <Gift className="h-6 w-6 text-white" />
                  </div>
                  <h3 
                    className="text-2xl font-serif font-bold"
                    style={{ color: styles.primary }}
                  >
                    Postres
                  </h3>
                </div>
                <div className="space-y-4">
                  {menu.desserts.map((item, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <h4 className="font-semibold mb-1" style={{ color: styles.text }}>
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" className="py-24 bg-white/60 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 
                className="text-4xl md:text-5xl font-serif font-bold mb-4"
                style={{ color: styles.primary }}
              >
                Confirma tu Asistencia
              </h2>
              <p className="text-lg text-gray-600">
                Tu presencia hará este día aún más especial
              </p>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ backgroundColor: styles.primary }}
                  >
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 
                    className="text-2xl font-semibold mb-4"
                    style={{ color: styles.text }}
                  >
                    ¿Nos acompañas?
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Por favor confirma tu asistencia antes del {new Date(Date.now() + 7*24*60*60*1000).toLocaleDateString('es-CO')}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Button 
                    size="lg"
                    className="w-full py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    style={{ 
                      backgroundColor: styles.primary,
                      color: 'white'
                    }}
                    onClick={() => window.location.href = `/invite/${event.id}#rsvp`}
                  >
                    ✅ Sí, asistiré
                  </Button>
                  
                  <Button 
                    size="lg"
                    variant="outline"
                    className="w-full py-4 text-lg font-semibold rounded-lg border-2 hover:shadow-lg transition-all duration-300"
                    style={{ 
                      borderColor: styles.primary,
                      color: styles.primary
                    }}
                    onClick={() => window.location.href = `/invite/${event.id}#rsvp`}
                  >
                    ❌ No podré asistir
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Thank You Section */}
      <section className="py-24" style={{ background: styles.background }}>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <Heart 
                className="h-20 w-20 mx-auto mb-6"
                style={{ color: styles.accent }}
              />
              <h2 
                className="text-4xl md:text-5xl font-serif font-bold mb-6"
                style={{ color: styles.primary }}
              >
                Gracias por ser parte de nuestra historia
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Tu amistad y cariño han sido fundamentales en nuestro camino. 
                Esperamos celebrar juntos este nuevo capítulo de nuestras vidas.
              </p>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg max-w-md mx-auto">
              <CardContent className="p-8">
                <h3 
                  className="text-xl font-semibold mb-4"
                  style={{ color: styles.text }}
                >
                  ¿Tienes alguna pregunta?
                </h3>
                <p className="text-gray-600 mb-6">
                  Estamos aquí para ayudarte con cualquier duda
                </p>
                <div className="space-y-3">
                  <Button 
                    className="w-full"
                    style={{ backgroundColor: styles.primary, color: 'white' }}
                    asChild
                  >
                    <a
                      href={`https://wa.me/573001234567?text=Hola, tengo una consulta sobre ${encodeURIComponent(event.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      WhatsApp
                    </a>
                  </Button>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      asChild
                    >
                      <a href="tel:+573001234567">
                        <Phone className="h-4 w-4 mr-2" />
                        Llamar
                      </a>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      asChild
                    >
                      <a href="mailto:contacto@catalinalezama.com">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-600 text-sm">
            Diseñado con ❤️ por Catalina Lezama Eventos Digitales
          </p>
        </div>
      </footer>
    </div>
  );
}