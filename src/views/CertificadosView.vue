<template>
  <div id="app">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-purple">
      <div class="container-fluid">
        <a class="navbar-brand fw-bold" href="/Cursos">Educan593</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul class="navbar-nav me-3"></ul>
          <a href="/Cursos" class="nav-link me-3">Cursos</a>
          <a href="/Perfil" class="nav-link me-3">Perfil</a>
          <button @click="cerrarSesion" class="btn btn-outline-danger btn-sm">Cerrar sesión</button>
        </div>
      </div>
    </nav>

    <!-- Contenido principal -->
    <main>
      <!-- Hero Section -->
      <section class="hero">
        <div class="container">
          <h1 class="display-5 fw-bold">Certificados Disponibles</h1>
          <p class="lead mt-3">
            Certificados generados automáticamente para los cursos creados en la plataforma.
          </p>
        </div>
      </section>

      <!-- Certificados -->
      <section class="py-4">
        <div class="container">
          <!-- Mensaje si no hay certificados -->
          <div v-if="certificados.length === 0" class="text-center py-5">
            <div class="alert alert-info">
              <h4>No hay certificados disponibles</h4>
              <p>Los certificados se generan automáticamente cuando se crean cursos.</p>
              <a href="/Cursos" class="btn btn-primary">Ir a Cursos</a>
            </div>
          </div>

          <!-- Lista de certificados -->
          <div v-else class="row g-4">
            <div v-for="certificado in certificados" :key="certificado.id" class="col-md-6 col-lg-4">
              <div class="card h-100 shadow-sm certificado-card">
                <div class="card-header bg-gradient-purple text-white text-center">
                  <h5 class="mb-0">🏆 Certificado Disponible</h5>
                  <small>{{ certificado.codigoCertificado }}</small>
                </div>
                <div class="card-body">
                  <h6 class="card-title text-primary">{{ certificado.nombreCurso }}</h6>
                  <p class="card-text small">{{ certificado.descripcionCurso }}</p>
                  
                  <div class="detalles-certificado">
                    <p class="mb-1"><strong>Autor del curso:</strong> {{ certificado.autorCurso }}</p>
                    <p class="mb-1"><strong>Fecha de creación:</strong> {{ certificado.fechaEmision }}</p>
                    <p class="mb-1"><strong>Estado:</strong> 
                      <span class="badge bg-success">{{ certificado.estado || 'Disponible' }}</span>
                    </p>
                    <p class="mb-1"><strong>Duración:</strong> {{ certificado.duracionCurso }}</p>
                    <p class="mb-1"><strong>Modalidad:</strong> {{ certificado.modalidad }}</p>
                    <p class="mb-0"><strong>Institución:</strong> {{ certificado.institucion }}</p>
                  </div>

                  <!-- Competencias adquiridas -->
                  <div class="mt-3">
                    <h6 class="text-secondary">Competencias que desarrolla:</h6>
                    <ul class="list-unstyled small">
                      <li v-for="competencia in certificado.competenciasAdquiridas" :key="competencia" class="mb-1">
                        • {{ competencia }}
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="card-footer text-center">
                  <button 
                    @click="descargarCertificado(certificado)" 
                    class="btn btn-primary btn-sm me-2"
                  >
                    📄 Descargar Plantilla
                  </button>
                  <button 
                    @click="verCertificado(certificado)" 
                    class="btn btn-outline-secondary btn-sm"
                  >
                    👁️ Vista previa
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Estadísticas -->
          <div v-if="certificados.length > 0" class="mt-5">
            <div class="row text-center">
              <div class="col-md-4">
                <div class="stat-card p-4 bg-light rounded">
                  <h3 class="text-primary">{{ certificados.length }}</h3>
                  <p class="mb-0">Certificados Disponibles</p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="stat-card p-4 bg-light rounded">
                  <h3 class="text-success">{{ cursosConCertificado }}</h3>
                  <p class="mb-0">Cursos con Certificación</p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="stat-card p-4 bg-light rounded">
                  <h3 class="text-info">{{ horasTotales }}h</h3>
                  <p class="mb-0">Horas Académicas Total</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Modal para vista previa -->
    <div v-if="certificadoSeleccionado" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Vista previa del certificado</h5>
            <button @click="cerrarModal" type="button" class="btn-close"></button>
          </div>
          <div class="modal-body text-center">
            <div class="certificado-preview p-4 border">
              <div class="certificate-header mb-4">
                <h2 class="text-primary mb-3">🏆 CERTIFICADO DE CURSO</h2>
                <h4 class="text-secondary">{{ certificadoSeleccionado.institucion }}</h4>
              </div>
              
              <div class="certificate-body">
                <p class="lead">Certifica que el presente curso:</p>
                <h3 class="text-success mb-3">"{{ certificadoSeleccionado.nombreCurso }}"</h3>
                <p class="mb-4">{{ certificadoSeleccionado.descripcionCurso }}</p>
                
                <div class="course-details mb-4">
                  <div class="row text-center">
                    <div class="col-md-6">
                      <p><strong>Duración:</strong><br>{{ certificadoSeleccionado.duracionCurso }}</p>
                    </div>
                    <div class="col-md-6">
                      <p><strong>Modalidad:</strong><br>{{ certificadoSeleccionado.modalidad }}</p>
                    </div>
                  </div>
                </div>

                <div class="competencias mb-4">
                  <h5 class="text-primary">Competencias que desarrolla este curso:</h5>
                  <ul class="list-unstyled">
                    <li v-for="competencia in certificadoSeleccionado.competenciasAdquiridas" :key="competencia" class="mb-2">
                      ✓ {{ competencia }}
                    </li>
                  </ul>
                </div>
                
                <div class="certificate-footer">
                  <div class="row">
                    <div class="col-6">
                      <p><strong>Fecha de creación:</strong><br>{{ certificadoSeleccionado.fechaEmision }}</p>
                    </div>
                    <div class="col-6">
                      <p><strong>Código:</strong><br>{{ certificadoSeleccionado.codigoCertificado }}</p>
                    </div>
                  </div>
                  <p class="mt-3"><strong>Creado por:</strong> {{ certificadoSeleccionado.autorCurso }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="descargarCertificado(certificadoSeleccionado)" class="btn btn-primary">Descargar Plantilla</button>
            <button @click="cerrarModal" class="btn btn-secondary">Cerrar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer mt-auto py-3">
      <div class="container text-center text-white">
        <p class="mb-1 fw-bold fs-10">Educan593</p>
        <p class="mb-0">© 2025 Todos los derechos reservados</p>
      </div>
    </footer>
  </div>
  
</template>

<script>
export default {
  data() {
    return {
      certificados: [],
      certificadoSeleccionado: null
    };
  },
  computed: {
    cursosConCertificado() {
      return this.certificados.length;
    },
    horasTotales() {
      // Calcular horas totales basadas en la duración de cada curso
      return this.certificados.length * 40; // 40 horas por defecto por curso
    }
  },
  mounted() {
    this.cargarCertificados();
  },
  methods: {
    cargarCertificados() {
      // Cargar certificados disponibles (generados automáticamente)
      this.certificados = JSON.parse(localStorage.getItem("certificados_disponibles") || "[]");
      
      // También cargar desde certificados globales si no hay en disponibles
      if (this.certificados.length === 0) {
        const certificadosGlobales = JSON.parse(localStorage.getItem("todos_certificados") || "[]");
        this.certificados = certificadosGlobales.filter(cert => cert.tipoCertificado === 'curso_disponible');
      }
      
      // Ordenar por fecha más reciente
      this.certificados.sort((a, b) => {
        return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
      });
    },

    verCertificado(certificado) {
      this.certificadoSeleccionado = certificado;
    },

    cerrarModal() {
      this.certificadoSeleccionado = null;
    },

    descargarCertificado(certificado) {
      const contenidoPDF = this.generarContenidoPDF(certificado);
      
      // Crear elemento temporal para descarga
      const elemento = document.createElement('a');
      const archivo = new Blob([contenidoPDF], { type: 'text/plain' });
      elemento.href = URL.createObjectURL(archivo);
      elemento.download = `Plantilla_Certificado_${certificado.nombreCurso.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(elemento);
      elemento.click();
      document.body.removeChild(elemento);
      
      alert('📄 Plantilla de certificado descargada exitosamente');
    },

    generarContenidoPDF(certificado) {
      return `
========================================
        CERTIFICADO DE CURSO
        ${certificado.institucion}
========================================

CURSO: "${certificado.nombreCurso}"

DESCRIPCIÓN:
${certificado.descripcionCurso}

DETALLES DEL CURSO:
• Duración: ${certificado.duracionCurso}
• Modalidad: ${certificado.modalidad}
• Creado por: ${certificado.autorCurso}
• Fecha de creación: ${certificado.fechaEmision}

COMPETENCIAS QUE DESARROLLA ESTE CURSO:
${certificado.competenciasAdquiridas.map(comp => `• ${comp}`).join('\n')}

INFORMACIÓN DEL CERTIFICADO:
• Código: ${certificado.codigoCertificado}
• Estado: ${certificado.estado}
• Institución: ${certificado.institucion}

========================================

Este documento certifica que el curso mencionado
está disponible en la plataforma Educan593 y que
al completarlo satisfactoriamente, el estudiante
habrá adquirido las competencias especificadas.

Para obtener el certificado personalizado, el
estudiante debe completar todas las actividades
y evaluaciones del curso.

© 2025 Educan593 - Todos los derechos reservados
========================================
      `;
    },

    cerrarSesion() {
      localStorage.removeItem("usuario");
      localStorage.removeItem("rol");
      this.$router.push("/Sesion");
    }
  }
};
</script>

<style scoped>
/* Estilos base */
body {
  background-color: #f9f9f9;
  font-family: 'Arial', sans-serif;
}

/* Navbar styles */
.navbar {
  padding: 1rem 0;
}

.navbar-dark {
  background-color: #7c3aed !important;
}

.bg-purple {
  background-color: #7c3aed;
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: white !important;
}

.nav-link {
  color: white !important;
  text-decoration: none;
  margin: 0 0.5rem;
}

.nav-link:hover {
  color: #e9d5ff !important;
}

/* Hero section */
.hero {
  background: linear-gradient(135deg, #7c3aed 0%, #6b21a8 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
}

.hero h1 {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.hero .lead {
  font-size: 1.2rem;
  opacity: 0.9;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Cards */
.card {
  border: none;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 1.5rem 1rem;
  border-bottom: none;
}

.bg-gradient-purple {
  background: linear-gradient(135deg, #7c3aed 0%, #6b21a8 100%);
}

.card-body {
  padding: 1.5rem;
}

.card-title {
  color: #7c3aed;
  font-weight: bold;
  margin-bottom: 1rem;
}

.card-text {
  color: #6b7280;
  line-height: 1.5;
}

.detalles-certificado p {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.card-footer {
  background-color: #f8fafc;
  border-top: 1px solid #e5e7eb;
  padding: 1rem;
}

/* Buttons */
.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #7c3aed;
  color: white;
}

.btn-primary:hover {
  background-color: #6b21a8;
  transform: translateY(-1px);
}

.btn-outline-secondary {
  background-color: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.btn-outline-secondary:hover {
  background-color: #6b7280;
  color: white;
}

.btn-outline-danger {
  background-color: transparent;
  color: #dc2626;
  border: 1px solid #dc2626;
}

.btn-outline-danger:hover {
  background-color: #dc2626;
  color: white;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

/* Badge */
.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.bg-success {
  background-color: #10b981;
  color: white;
}

/* Alert */
.alert {
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.alert-info {
  background-color: #dbeafe;
  border: 1px solid #93c5fd;
  color: #1e40af;
}

/* Stats */
.stat-card {
  text-align: center;
  border-radius: 8px;
}

.stat-card h3 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.text-primary { color: #7c3aed !important; }
.text-success { color: #10b981 !important; }
.text-info { color: #06b6d4 !important; }
.text-secondary { color: #6b7280 !important; }
.text-white { color: white !important; }

.bg-light {
  background-color: #f8fafc;
}

/* Grid system */
.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -0.75rem;
}

.col-md-4, .col-md-6, .col-lg-4 {
  padding: 0 0.75rem;
  margin-bottom: 1.5rem;
}

.col-md-4 { flex: 0 0 33.333333%; }
.col-md-6 { flex: 0 0 50%; }
.col-lg-4 { flex: 0 0 33.333333%; }

@media (max-width: 768px) {
  .col-md-4, .col-md-6, .col-lg-4 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}

/* Utility classes */
.py-4 { padding: 2rem 0; }
.py-5 { padding: 3rem 0; }
.mt-3 { margin-top: 1rem; }
.mt-5 { margin-top: 3rem; }
.mb-0 { margin-bottom: 0; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-3 { margin-bottom: 1rem; }
.mb-4 { margin-bottom: 1.5rem; }
.me-2 { margin-right: 0.5rem; }
.me-3 { margin-right: 1rem; }

.text-center { text-align: center; }
.fw-bold { font-weight: bold; }
.small { font-size: 0.875rem; }
.lead { font-size: 1.125rem; font-weight: 300; }
.display-5 { font-size: 3rem; font-weight: 300; }

.h-100 { height: 100%; }
.shadow-sm { box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }

.list-unstyled {
  list-style: none;
  padding-left: 0;
}

/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
  overflow-x: hidden;
  overflow-y: auto;
}

.modal.show {
  display: block;
}

.modal-dialog {
  position: relative;
  width: auto;
  margin: 1.75rem auto;
  max-width: 800px;
}

.modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.7;
}

.btn-close:hover {
  opacity: 1;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

/* Certificate preview styles */
.certificado-preview {
  border: 3px solid #7c3aed;
  border-radius: 12px;
  padding: 2rem;
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
}

.certificate-header h2 {
  color: #6b21a8;
  margin-bottom: 1rem;
}

.certificate-body h3 {
  color: #059669;
  margin: 1rem 0;
}

.course-details .row {
  margin: 1rem 0;
}

.competencias ul li {
  padding: 0.25rem 0;
}

.certificate-footer .row {
  margin-top: 1rem;
}

/* Footer */
.footer {
  background-color: #7c3aed;
  color: white;
  margin-top: auto;
}

.footer p {
  margin: 0;
}

.fs-10 {
  font-size: 0.875rem;
}
</style>