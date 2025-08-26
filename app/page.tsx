export default function Home() {
  return (
    <main className="landing-page">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <div className="nav-left">
            <a href="#servicios">Servicios</a>
            <a href="#eventos">Eventos</a>
          </div>
          <div className="nav-logo">
            <img
              src="/logo-catalina.png"
              alt="Catalina Lezama ED"
              className="nav-logo-img"
            />
            <h1>Catalina Lezama ED</h1>
          </div>
          <div className="nav-right">
            <a href="#contacto">Contacto</a>
            <a href="/login" className="nav-cta">Acceso Equipo</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            EVENTOS QUE
            <br />
            <span>NADIE OLVIDA</span>
          </h1>
          <p className="hero-subtitle">
            NO solo organizamos eventos, diseñamos experiencias{" "}
            <strong>BRUTALES </strong> que quedan grabadas para siempre en el
            corazón de tus invitados.
          </p>
          <button className="hero-button">Planea tu Evento</button>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="about-container">
          <p className="about-lead">
            Soy apasionada por crear experiencias inolvidables. Solo los mejores
            eventos, con 10+ años de experiencia y atención obsesiva a cada
            detalle.
          </p>
          <div className="about-content">
            <div className="about-text">
              <p>
                Cada evento que organizamos está diseñado desde el corazón,
                pensando en crear momentos que marquen la vida de nuestros
                clientes. Desde bodas íntimas hasta grandes celebraciones, nos
                especializamos en hacer realidad sueños.
              </p>
            </div>
            <div className="about-text">
              <p>
                Nuestro equipo combina creatividad, experiencia y tecnología
                para ofrecer un servicio completo que abarca desde la
                conceptualización hasta la ejecución perfecta de cada detalle.
              </p>
            </div>
          </div>
          <div className="about-signature">— Catalina Lezama</div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="services">
        <div className="services-container">
          <h2 className="services-title">NUESTROS SERVICIOS</h2>

          <div className="services-grid">
            <div className="service-item service-1">
              <div className="service-image">
                <div className="service-placeholder">Imagen Boda</div>
                <div className="service-overlay">
                  <h3>BODAS</h3>
                </div>
              </div>
            </div>

            <div className="service-item service-2">
              <div className="service-image">
                <div className="service-placeholder">Imagen Catering</div>
                <div className="service-overlay">
                  <h3>CATERING</h3>
                </div>
              </div>
            </div>

            <div className="service-item service-3">
              <div className="service-image">
                <div className="service-placeholder">Imagen Decoración</div>
                <div className="service-overlay">
                  <h3>DECORACIÓN</h3>
                </div>
              </div>
            </div>

            <div className="service-item service-4">
              <div className="service-image">
                <div className="service-placeholder">Imagen Quinceañeras</div>
                <div className="service-overlay">
                  <h3>QUINCEAÑERAS</h3>
                </div>
              </div>
            </div>

            <div className="service-item service-5">
              <div className="service-circle">
                <div className="service-logo">CL</div>
                <h4>CONSULTA</h4>
                <p>Asesoría personalizada para tu evento especial</p>
                <button className="service-cta">RESERVAR CITA</button>
              </div>
            </div>

            <div className="service-item service-6">
              <div className="service-image">
                <div className="service-placeholder">
                  Imagen Entretenimiento
                </div>
                <div className="service-overlay">
                  <h3>ENTRETENIMIENTO</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="eventos" className="gallery">
        <div className="gallery-container">
          <h2 className="gallery-title">EVENTOS RECIENTES</h2>

          <div className="gallery-grid">
            <div className="gallery-item gallery-item-1">
              <div className="gallery-placeholder">
                <span>Boda María & Carlos</span>
              </div>
            </div>

            <div className="gallery-item gallery-item-2">
              <div className="gallery-placeholder">
                <span>XV Años Sofía</span>
              </div>
            </div>

            <div className="gallery-item gallery-item-3">
              <div className="gallery-placeholder">
                <span>Aniversario 25 años</span>
              </div>
            </div>

            <div className="gallery-item gallery-item-4">
              <div className="gallery-placeholder">
                <span>Evento Corporativo</span>
              </div>
            </div>

            <div className="gallery-item gallery-item-5">
              <div className="gallery-placeholder">
                <span>Baby Shower</span>
              </div>
            </div>

            <div className="gallery-item gallery-item-6">
              <div className="gallery-placeholder">
                <span>Graduación</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="instagram">
        <div className="instagram-container">
          <h2 className="instagram-title">SÍGUENOS EN INSTAGRAM</h2>

          <div className="instagram-embed">
            <script src="https://elfsightcdn.com/platform.js" async></script>
            <div
              className="elfsight-app-564675a3-efff-45c1-b568-5dfdfac10011"
              data-elfsight-app-lazy
            ></div>
          </div>

          <a
            href="https://www.instagram.com/catalinalezama.ed/"
            target="_blank"
            className="instagram-cta"
          >
            Ver más en Instagram
          </a>
        </div>
      </section>

      {/* Final CTA */}
      <section className="contacto">
        <div className="cta-container">
          <h2>¿LISTA PARA CREAR TU EVENTO BRUTAL?</h2>
          <p>Conversemos sobre tu visión y hagámosla realidad</p>
          <button className="cta-button">Empezar Ahora</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <h3>Catalina Lezama</h3>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Agencia</h4>
              <a href="#about">Sobre Catalina</a>
              <a href="#team">Equipo</a>
              <a href="#process">Proceso</a>
            </div>
            <div className="footer-column">
              <h4>Servicios</h4>
              <a href="#bodas">Bodas</a>
              <a href="#cumpleanos">Cumpleaños</a>
              <a href="#eventos">Eventos</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
