<template>
  <div id="app">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light shadow-sm">
      <div class="container">
        <a class="navbar-brand fw-bold" href="/Inicio">Educan593</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul class="navbar-nav me-3">
            <li class="nav-item"><a class="nav-link" href="/Inicio">Home</a></li>
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
              <textarea v-model="nuevoCurso.tarea" class="form-control" placeholder="Descripción de tarea o evaluación (opcional)"></textarea>
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
      if (confirm("¿Estás seguro de eliminar este curso?")) {
        this.cursosExtras.splice(index, 1);
        localStorage.setItem("cursosAgregados", JSON.stringify(this.cursosExtras));
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
        videos: [{ titulo: "Clase 1", url: this.nuevoCurso.videoUrl }],
        tareas: [{ titulo: "Actividad 1", descripcion: this.nuevoCurso.tarea, enlace: "/archivo", boton: "Subir archivo" }]
      };
      this.cursosExtras.push(nuevo);
      localStorage.setItem("cursosAgregados", JSON.stringify(this.cursosExtras));
      this.nuevoCurso = { titulo: "", descripcion: "", videoUrl: "", tarea: "" };
    },
    cerrarSesion() {
      localStorage.removeItem("rol");
      localStorage.removeItem("usuario");
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
}
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
main {
  flex: 1;
}
.hero {
  text-align: center;
  padding: 4rem 2rem;
  background-image: url('https://www.transparenttextures.com/patterns/cubes.png');
}
.card h5 {
  font-weight: bold;
}
.card {
  background-color: white;
}
.card-footer {
  background-color: transparent;
  border-top: none;
}
.btn-started {
  color: #7e22ce;
  font-weight: bold;
  text-decoration: none;
}
.btn-started:hover {
  text-decoration: underline;
}
.btn-success {
  color: #c8c3cb;
  background-color: #7e22ce;
}
.navbar-expand-lg {
  background-color: rgb(255, 255, 255);
}
footer {
  background-color: #703ca0;
  color: white;
  padding: 0.1rem 0.2rem;
  text-align: center;
}
</style>
