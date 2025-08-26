export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Luxury burgundy-cream gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-burgundy via-burgundy-light to-cream bg-[length:100%_100%]" />
      
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-burgundy-dark/20 via-transparent to-transparent" />
      
      {/* Content container */}
      <div className="relative min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          {/* Logo section with luxury styling */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-playfair font-semibold text-cream-light mb-3 tracking-wide">
              Catalina Lezama
            </h1>
            <p className="text-xl font-playfair font-light text-cream-light/90 mb-1">
              ED
            </p>
            <p className="text-cream-light/70 text-sm font-inter tracking-wide">
              Eventos que Nadie Olvida
            </p>
          </div>
          
          {/* Elegant auth card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl luxury-shadow-lg p-10 border border-white/20">
            {children}
          </div>
        </div>
      </div>
      
      {/* Subtle decorative elements */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-cream-light/10 rounded-full blur-xl" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-burgundy-light/10 rounded-full blur-2xl" />
    </div>
  );
}