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
          <ul class="navbar-nav me-3">
            
          </ul>
          <a href="/Certificados" class="nav-link me-3">Certificado</a>
          <a href="/Perfil" class="nav-link me-3">Perfil</a>
          <button @click="cerrarSesion" class="btn btn-outline-danger btn-sm">Cerrar sesión</button>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <main>
      <section class="hero">
        <div class="container">
          <h1 class="display-5 fw-bold">Capacítate con los mejores cursos</h1>
          <p class="lead mt-3">
            Ofrecemos cursos y capacitaciones prácticas para impulsar tu desarrollo profesional.<br>
            Aprende a tu ritmo con contenido actualizado y orientado al mercado laboral.
          </p>
        </div>
      </section>

      <!-- Formulario para profesores -->
      <section class="py-3" id="seccionAgregarCurso" v-if="rol === 'profesor'">
        <div class="container">
          <h4 class="mb-3">Agregar nuevo curso</h4>
          <form @submit.prevent="agregarCurso" class="row g-3">
            <div class="col-md-6">
              <input v-model="nuevoCurso.titulo" class="form-control" placeholder="Nombre del curso" required>
            </div>
            <div class="col-md-6">
              <input v-model="nuevoCurso.descripcion" class="form-control" placeholder="Descripción del curso" required>
            </div>
            <div class="col-12">
              <input v-model="nuevoCurso.videoUrl" class="form-control" placeholder="URL del video de YouTube (opcional)">
            </div>
            <div class="col-12">
              <textarea v-model="nuevoCurso.tarea" class="form-control" placeholder=" Categoria (opcional)"></textarea>
            </div>
            <div class="col-12 text-end">
              <button type="submit" class="btn btn-success">Agregar Curso</button>
            </div>
          </form>
        </div>
      </section>

      <!-- Cursos -->
      <section class="py-4">
        <div class="container">
          <div class="row g-4">
            <div v-for="(curso, index) in cursosCompletos" :key="curso.id" class="col-md-4">
              <div class="card h-100 shadow-sm">
                <div class="card-body">
                  <h5 class="card-title">{{ curso.titulo }}</h5>
                  <p class="card-text">{{ curso.descripcion }}</p>
                </div>
                <div class="card-footer">
                  <a href="#" class="btn-started" @click.prevent="irACurso(curso)">Get Started</a><br>
                  <small class="text-muted">
                    {{ curso.autor || 'Profesor agregado' }}<br>
                    {{ curso.especialidad || 'Curso personalizado' }}
                  </small><br>
                  <button
                    v-if="rol === 'profesor' && curso.extra"
                    class="btn btn-sm btn-outline-danger mt-2"
                    @click="eliminarCurso(index - cursosBase.length)"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

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
      rol: localStorage.getItem("rol") || "",
      cursosBase: [
        {
          id: "curso_1",
          titulo: "Fundamentos de Redes de Computadoras",
          descripcion: "Aprende los conceptos esenciales sobre redes, incluyendo topologías, protocolos y configuración básica.",
          autor: "Jenny Wilson",
          especialidad: "Profesora Fundamentos de redes",
          url: "/CursoGenerico",
          videos: [{ titulo: "Clase 1", url: "https://www.youtube.com/embed/GqIFy_0di_Q" }],
          tareas: [{ titulo: "Tarea 1", descripcion: "Informe sobre topologías", enlace: "/archivo", boton: "Subir archivo" }]
        }
      ],
      cursosExtras: JSON.parse(localStorage.getItem("cursosAgregados") || "[]"),
      nuevoCurso: {
        titulo: "",
        descripcion: "",
        videoUrl: "",
        tarea: ""
      }
    };
  },
  computed: {
    cursosCompletos() {
      return [
        ...this.cursosBase,
        ...this.cursosExtras.map(c => ({ ...c, extra: true }))
      ];
    }
  },
  methods: {
    irACurso(curso) {
      localStorage.setItem("cursoSeleccionado", JSON.stringify(curso));
      this.$router.push({ path: curso.url, query: { cursoId: curso.id } });
    },
    eliminarCurso(index) {
      const cursoAEliminar = this.cursosExtras[index];
      if (confirm(`¿Estás seguro de eliminar el curso "${cursoAEliminar.titulo}"?\n\n⚠️ También se eliminará el certificado asociado a este curso.`)) {
        // Eliminar el certificado asociado al curso ANTES de eliminar el curso
        const certificadoEliminado = this.eliminarCertificadoPorCurso(cursoAEliminar.id);
        
        // Eliminar el curso
        this.cursosExtras.splice(index, 1);
        localStorage.setItem("cursosAgregados", JSON.stringify(this.cursosExtras));
        
        // Mostrar mensaje de confirmación
        if (certificadoEliminado) {
          alert(`✅ Curso "${cursoAEliminar.titulo}" eliminado exitosamente.\n🗑️ Certificado asociado también eliminado.`);
        } else {
          alert(`✅ Curso "${cursoAEliminar.titulo}" eliminado exitosamente.\n⚠️ No se encontró certificado asociado.`);
        }
      }
    },
    
    agregarCurso() {
      const nuevo = {
        id: "curso_extra_" + Date.now(),
        titulo: this.nuevoCurso.titulo,
        descripcion: this.nuevoCurso.descripcion,
        autor: "Profesor agregado",
        especialidad: "Curso personalizado",
        url: "/CursoGenerico",
        videos: this.nuevoCurso.videoUrl ? 
          [{ titulo: "Clase 1", url: this.nuevoCurso.videoUrl }] : 
          [{ titulo: "Clase 1", url: "" }],
        tareas: this.nuevoCurso.tarea ? 
          [{ titulo: "Actividad 1", descripcion: this.nuevoCurso.tarea, enlace: "/archivo", boton: "Subir archivo" }] :
          [{ titulo: "Actividad 1", descripcion: "Sin tarea asignada", enlace: "/archivo", boton: "Subir archivo" }]
      };
      
      // Agregar curso a la lista
      this.cursosExtras.push(nuevo);
      localStorage.setItem("cursosAgregados", JSON.stringify(this.cursosExtras));
      
      // GENERAR CERTIFICADO AUTOMÁTICAMENTE
      const certificadoGenerado = this.generarCertificadoParaCurso(nuevo);
      
      // Limpiar formulario
      this.nuevoCurso = { titulo: "", descripcion: "", videoUrl: "", tarea: "" };
      
      if (certificadoGenerado) {
        alert(`✅ Curso "${nuevo.titulo}" creado exitosamente.\n🏆 Certificado generado automáticamente y disponible en la sección Certificados.`);
      } else {
        alert(`✅ Curso "${nuevo.titulo}" creado exitosamente.\n⚠️ No se pudo generar el certificado automáticamente.`);
      }
    },

    // Método para generar certificado automáticamente sin necesidad de sesión
    generarCertificadoParaCurso(curso) {
      try {
        // Crear certificado con datos predeterminados del curso
        const certificado = {
          id: `cert_${curso.id}_${Date.now()}`,
          cursoId: curso.id,
          nombreCurso: curso.titulo,
          nombreEstudiante: "Curso disponible para certificación", // Placeholder
          emailEstudiante: "sistema@educan593.com", // Email del sistema
          fechaCreacion: new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          fechaEmision: new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          tipoCreador: 'profesor',
          descripcionCurso: curso.descripcion,
          estado: 'disponible',
          duracionCurso: '40 horas académicas',
          modalidad: 'Virtual',
          institucion: 'Educan593',
          codigoCertificado: `EDU593-${Date.now().toString().slice(-6)}`,
          autorCurso: curso.autor || 'Profesor agregado',
          // Información adicional para el certificado
          competenciasAdquiridas: [
            'Dominio de conceptos fundamentales del curso',
            'Aplicación práctica de conocimientos adquiridos',
            'Desarrollo de habilidades específicas de la materia'
          ],
          // Marcar como certificado de curso (no de usuario específico)
          tipoCertificado: 'curso_disponible',
          cursoCreador: true
        };
        
        // Guardar certificado en una clave global de certificados disponibles
        let certificadosDisponibles = JSON.parse(localStorage.getItem("certificados_disponibles") || "[]");
        
        // Verificar que no exista ya un certificado para este curso
        const existeCertificado = certificadosDisponibles.some(cert => cert.cursoId === curso.id);
        if (!existeCertificado) {
          certificadosDisponibles.push(certificado);
          localStorage.setItem("certificados_disponibles", JSON.stringify(certificadosDisponibles));
          
          // También guardarlo en la clave global de todos los certificados
          const certificadosGlobales = JSON.parse(localStorage.getItem("todos_certificados") || "[]");
          certificadosGlobales.push(certificado);
          localStorage.setItem("todos_certificados", JSON.stringify(certificadosGlobales));
          
          console.log("Certificado generado exitosamente para el curso:", certificado);
          return true;
        } else {
          console.log("Ya existe un certificado para este curso");
          return false;
        }
        
      } catch (error) {
        console.error("Error al generar certificado:", error);
        return false;
      }
    },

    // Método para eliminar certificado cuando se elimina un curso
    eliminarCertificadoPorCurso(cursoId) {
      try {
        let certificadoEliminado = false;
        
        // Eliminar de certificados disponibles
        let certificadosDisponibles = JSON.parse(localStorage.getItem("certificados_disponibles") || "[]");
        const cantidadAntes = certificadosDisponibles.length;
        certificadosDisponibles = certificadosDisponibles.filter(cert => cert.cursoId !== cursoId);
        
        if (certificadosDisponibles.length < cantidadAntes) {
          certificadoEliminado = true;
          localStorage.setItem("certificados_disponibles", JSON.stringify(certificadosDisponibles));
        }
        
        // Eliminar de certificados globales
        let certificadosGlobales = JSON.parse(localStorage.getItem("todos_certificados") || "[]");
        certificadosGlobales = certificadosGlobales.filter(cert => cert.cursoId !== cursoId);
        localStorage.setItem("todos_certificados", JSON.stringify(certificadosGlobales));
        
        console.log(`Certificado ${certificadoEliminado ? 'eliminado' : 'no encontrado'} para el curso:`, cursoId);
        return certificadoEliminado;
      } catch (error) {
        console.error("Error al eliminar certificado:", error);
        return false;
      }
    },

    // Método para verificar certificados disponibles
    verificarCertificadosDisponibles() {
      return JSON.parse(localStorage.getItem("certificados_disponibles") || "[]");
    },

    // Método para obtener certificado por ID de curso
    obtenerCertificadoPorCurso(cursoId) {
      const certificados = this.verificarCertificadosDisponibles();
      return certificados.find(cert => cert.cursoId === cursoId);
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
html, body {
  height: 100%;
  margin: 0;
  background-color: #f8f9fa;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}

/* Navbar */
.navbar-expand-lg {
  background-color: #ffffff;
  border-bottom: 1px solid #e5e5e5;
}

.navbar .nav-link {
  color: #fffefe;
  font-weight: 500;
}
.navbar .nav-link:hover {
  color: #7e22ce;
}

/* Hero Section */
.hero {
  text-align: center;
  padding: 4rem 2rem;
  background-image: url('https://www.transparenttextures.com/patterns/cubes.png');
  background-color: #ede9f5;
  color: #4b0082;
}

.hero h1 {
  font-weight: 700;
}

.hero p {
  font-size: 1.1rem;
}

/* Card de curso */
.bg-purple {
  background-color: #7c3aed !important;
}

.card {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 1rem;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card h5 {
  font-weight: 600;
  color: #4b0082;
}

.card-footer {
  background-color: transparent;
  border-top: none;
}

.btn-started {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 5px;
  background-color: transparent;
  color: #7e22ce;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid #7e22ce;
  transition: all 0.3s ease;
}

.btn-started:hover {
  background-color: #7e22ce;
  color: white;
}

/* Botón de agregar curso */
.btn-success {
  color: #fff;
  background-color: #7e22ce;
  border: none;
}

.btn-success:hover {
  background-color: #5a189a;
}

/* Formulario */
form input,
form textarea {
  border-radius: 0.5rem;
}

/* Footer */
footer {
  background-color: #4c4f4f;
  color: white;
  padding: 0.7rem 0.2rem;
  text-align: center;
  font-size: 0.9rem;
}

footer p {
  margin: 0;
}
</style>