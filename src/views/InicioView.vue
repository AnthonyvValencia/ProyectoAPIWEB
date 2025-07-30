<template>
  <div class="page-wrapper">
    <main>
      <header class="hero">
        <div class="hero-content">
          <h1>Bienvenido a <span class="brand">Educan593</span></h1>
          <p>Aprende, crece y transforma tu futuro con cursos en <span class="highlight">tecnología</span> y <span class="highlight">software</span></p>
          
          <div class="hero-actions">
            <router-link to="/Sesion" class="btn-primary">
              Iniciar Sesión
              <span class="arrow">→</span>
            </router-link>
            
          </div>
          
          <div class="stats">
            <div class="stat">
              <strong>100+</strong>
              <span>Estudiantes</span>
            </div>
            <div class="stat">
              <strong>Variedad</strong>
              <span>Cursos</span>
            </div>
            <div class="stat">
              <strong>95%</strong>
              <span>Satisfacción</span>
            </div>
          </div>
        </div>
      </header>

      <section class="features">
        <h2>¿Por qué elegirnos?</h2>
        <p class="subtitle">Descubre las ventajas que nos hacen únicos</p>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="icon">⭐</div>
            <h5>Contenido Actualizado</h5>
            <p>Los cursos están diseñados por expertos del área y se actualizan constantemente para el mercado laboral.</p>
          </div>
          
          <div class="feature-card featured">
            <div class="popular">Más Popular</div>
            <div class="icon">🎯</div>
            <h5>Modalidad Flexible</h5>
            <p>Aprende a tu ritmo desde cualquier lugar, con recursos accesibles 24/7.</p>
          </div>
          
          <div class="feature-card">
            <div class="icon">🏆</div>
            <h5>Certificación</h5>
            <p>Al finalizar cada curso, obtendrás un certificado de participación o aprobación.</p>
          </div>
        </div>
      </section>

      <section class="cta">
        <h3>¿Listo para comenzar tu transformación digital?</h3>
        <router-link to="/Sesion" class="btn-cta">Comenzar Ahora</router-link>
      </section>
    </main>

    <footer>
      <div class="footer-content">
        <div class="footer-brand">
          <h4>Educan593</h4>
          <p>Transformando el futuro a través de la educación tecnológica</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2025 Educan593. Todos los derechos reservados</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "InicioView",
  computed: {
    usuarioLogueado() {
      return !!localStorage.getItem("usuarioActual");
    }
  }
}
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main { flex: 1; }

/* Hero Section */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 5rem 2rem;
  text-align: center;
}

.hero-badge {
  background: rgba(255,255,255,0.2);
  padding: 0.5rem 1rem;
  border-radius: 25px;
  display: inline-block;
  margin-bottom: 1rem;
  backdrop-filter: blur(10px);
}

.hero h1 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
}
.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.highlight {
  color: #4facfe;
  font-weight: 600;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary, .btn-cta {
  padding: 0.8rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: white;
  color: #667eea;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}

.btn-secondary {
  background: rgba(255,255,255,0.1);
  color: white;
  border: 2px solid rgba(255,255,255,0.3);
}

.btn-secondary:hover {
  background: rgba(255,255,255,0.2);
}

.arrow {
  transition: transform 0.3s ease;
}

.btn-primary:hover .arrow {
  transform: translateX(3px);
}

.stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat {
  text-align: center;
}

.stat strong {
  display: block;
  font-size: 1.8rem;
  color: #ffd700;
}

.stat span {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Features Section */
.features {
  padding: 5rem 2rem;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
}

.features h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
}

.subtitle {
  color: #718096;
  font-size: 1.1rem;
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  position: relative;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card.featured {
  border: 2px solid #667eea;
  position: relative;
}

.popular {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(45deg, #f093fb, #f5576c);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
}

.icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-card h5 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
}

.feature-card p {
  color: #718096;
  line-height: 1.6;
}

/* CTA Section */
.cta {
  background: linear-gradient(135deg, #2c3e50, #3498db);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
}

.cta h3 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.cta p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.btn-cta {
  background: linear-gradient(45deg, #f093fb, #f5576c);
  color: white;
  font-size: 1.1rem;
}

.btn-cta:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.2);
}

/* Footer */
footer {
  background: #1a202c;
  color: white;
  padding: 2rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 1rem;
}

.footer-brand h4 {
  color: #4facfe;
  margin-bottom: 0.5rem;
}

.footer-brand p {
  color: #a0aec0;
  line-height: 1.6;
}

.footer-links {
  display: flex;
  gap: 2rem;
}

.footer-links h5 {
  margin-bottom: 0.5rem;
}

.footer-links a {
  display: block;
  color: #a0aec0;
  text-decoration: none;
  margin-bottom: 0.25rem;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: white;
}

.footer-bottom {
  border-top: 1px solid #2d3748;
  padding-top: 1rem;
  text-align: center;
  color: #a0aec0;
}

/* Responsive */
@media (max-width: 768px) {
  .hero h1 { font-size: 2.5rem; }
  .hero-actions { flex-direction: column; align-items: center; }
  .stats { flex-direction: column; gap: 1rem; }
  .features-grid { grid-template-columns: 1fr; }
  .footer-content { grid-template-columns: 1fr; text-align: center; }
  .footer-links { justify-content: center; }
}
</style>