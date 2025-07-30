<template>
  <div class="layout">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-purple">
      <div class="container-fluid">
        <a class="navbar-brand fw-bold" href="/Cursos">Educan593</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul class="navbar-nav me-3">
            <li class="nav-item"><a class="nav-link" href="/Cursos">Cursos</a></li>
          </ul>
          <a href="/Certificados" class="nav-link me-3">Certificado</a>
          <a href="/Perfil" class="nav-link me-3">Perfil</a>
          <button @click="cerrarSesion" class="btn btn-outline-danger btn-sm">Cerrar sesión</button>
        </div>
      </div>
    </nav>

    <!-- Contenido principal -->
    <main class="container py-4 flex-grow-1 text-dark">
      <h1 id="tituloCurso" class="mb-4 text-center text-purple">{{ curso?.titulo || "Curso no encontrado" }}</h1>

      <div id="descripcionCurso">{{ descripcionFormateada }}</div>

      <!-- Botones Crear Evaluación / Crear Tarea -->
      <div class="mb-4 text-center" v-if="rol === 'profesor'">
        <button class="btn btn-purple me-2 shadow-sm" @click="irCrearEvaluacion">Crear Evaluación</button>
        <button class="btn btn-purple shadow-sm" @click="irCrearTarea">Crear Tarea</button>
      </div>

      <h2 class="section-title">Recursos Audiovisuales</h2>
      <div>
        <div
          v-for="(video, i) in curso?.videos || []"
          :key="i"
          class="mb-4 mx-auto"
          style="max-width: 600px;"
        >
          <div class="ratio ratio-16x9 rounded overflow-hidden shadow-sm">
            <iframe :src="video.url" :title="video.titulo" allowfullscreen></iframe>
          </div>
          <p class="text-center mt-2 fw-medium text-dark">{{ video.titulo }}</p>
        </div>
      </div>

      <h2 class="section-title">Tareas y Evaluaciones</h2>
      <div>
        <!-- Tareas -->
        <div
          v-for="(tarea, idx) in tareasCurso"
          :key="'tarea-'+idx"
          class="task-card"
        >
          <h5 class="fw-bold text-purple">📝 {{ tarea.titulo }}</h5>
          <p class="text-secondary">{{ tarea.descripcion }}</p>

          <template v-if="rol === 'estudiante'">
            <button
              v-if="!archivoSubido(idx)"
              class="btn btn-purple mt-2 shadow-sm"
              @click="irSubirArchivo(idx)"
            >
              {{ tarea.boton || "Enviar tarea" }}
            </button>

            <div v-else class="mt-2">
              <span class="me-3">📄 {{ obtenerNombreArchivo(idx) }}</span>
              <button class="btn btn-outline-danger btn-sm" @click="eliminarArchivo(idx)">Eliminar archivo</button>
            </div>
          </template>

          <button
            v-if="rol === 'profesor'"
            class="btn btn-danger mt-2 ms-2 btn-sm"
            @click="eliminarTarea(idx)"
          >
            Eliminar
          </button>
        </div>

        <!-- Evaluaciones -->
        <div
          v-for="(evaluacion, idx) in evaluacionesCurso"
          :key="'eval-'+idx"
          class="task-card d-flex justify-content-between align-items-center"
        >
          <div>
            <h5 class="fw-bold text-purple mb-1">🎯 {{ evaluacion.titulo }}</h5>
            <p class="text-secondary mb-0 small">{{ evaluacion.descripcion || 'Evaluación del curso' }}</p>
          </div>
          <div>
            <template v-if="rol === 'estudiante'">
              <button
                v-if="!yaRealizoEvaluacion(idx)"
                class="btn btn-purple shadow-sm"
                @click="realizarEvaluacion(idx)"
              >
                Realizar Evaluación
              </button>
              <span v-else class="text-success fw-bold">
                ✅ Calificación: {{ obtenerCalificacionEvaluacion(idx) }}
              </span>
            </template>

            <button
              v-if="rol === 'profesor'"
              class="btn btn-danger ms-2 btn-sm"
              @click="eliminarEvaluacion(idx)"
            >
              Eliminar
            </button>
          </div>
        </div>

        <!-- Mensaje cuando no hay evaluaciones -->
        <div v-if="evaluacionesCurso.length === 0" class="task-card text-center text-muted">
          <p>📋 No hay evaluaciones disponibles para este curso</p>
          <p v-if="rol === 'profesor'" class="small">Haz clic en "Crear Evaluación" para agregar una nueva evaluación</p>
        </div>
      </div>

      <!-- Debug info (solo para desarrollo) -->
      <div v-if="showDebug" class="mt-4 p-3 bg-light rounded">
        <h6>Debug Info:</h6>
        <p><strong>Curso ID:</strong> {{ curso?.id }}</p>
        <p><strong>Evaluaciones cargadas:</strong> {{ evaluacionesCurso.length }}</p>
        <p><strong>Storage Key:</strong> evaluaciones_curso_{{ curso?.id }}</p>
        <pre>{{ JSON.stringify(evaluacionesCurso, null, 2) }}</pre>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer mt-auto text-white text-center">
      <div class="card-footer text-white py-3">
        <p class="mb-1 fw-bold">Educan593</p>
        <p class="mb-0">© 2025 Todos los derechos reservados</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "CursoGenerico",
  data() {
    return {
      rol: localStorage.getItem("rol"),
      usuario: JSON.parse(localStorage.getItem("usuarioActual")),
      curso: null,
      tareasGuardadas: [],
      evaluacionesGuardadas: [],
      archivosSubidos: {},
      evaluacionesRealizadas: {},
      showDebug: false, // Cambia a true para ver info de debug
    };
  },
  computed: {
    descripcionFormateada() {
      if (!this.curso?.descripcion) return "Sin descripción disponible.";
      const charsPorLinea = 60;
      let texto = this.curso.descripcion;
      let resultado = "";
      for (let i = 0; i < texto.length; i += charsPorLinea) {
        resultado += texto.substr(i, charsPorLinea) + "\n";
      }
      return resultado.trim();
    },
    tareasCurso() {
      return this.tareasGuardadas || [];
    },
    evaluacionesCurso() {
      return this.evaluacionesGuardadas || [];
    },
  },


  mounted() {
    console.log("🚀 Componente montado");
    this.cargarDatos();
  },

  // Escuchar cambios en la ruta
  watch: {
    $route() {
      console.log("🔄 Ruta cambió, recargando datos...");
      this.cargarDatos();
    },
  },

  // Método para escuchar cuando se regresa a esta vista
  activated() {
    console.log("✅ Vista activada, recargando datos...");
    this.recargarEvaluaciones();
  },

  // Escuchar eventos de localStorage (cuando se crean evaluaciones en otra pestaña)
  created() {
    window.addEventListener('storage', this.handleStorageChange);
    
    // También escuchar cambios de focus en la ventana
    window.addEventListener('focus', this.handleWindowFocus);
  },

  beforeUnmount() {
    window.removeEventListener('storage', this.handleStorageChange);
    window.removeEventListener('focus', this.handleWindowFocus);
  },

  methods: {
    // Todos los métodos combinados aquí
    claveUsuario(key) {
      return `${key}_${this.usuario?.email}`;
    },

    cargarDatos() {
      console.log("🔄 Cargando datos del curso...");
      
      // Cargar curso seleccionado
      this.curso = JSON.parse(localStorage.getItem("cursoSeleccionado"));
      
      if (!this.curso) {
        console.error("❌ No se encontró curso seleccionado");
        return;
      }

      console.log("📚 Curso cargado:", this.curso.titulo, "ID:", this.curso.id);

      // Definir claves de localStorage
      const tareasKey = `tareas_curso_${this.curso.id}`;
      const evalKey = `evaluaciones_curso_${this.curso.id}`;
      const archivosKey = this.claveUsuario("archivosSubidos");
      const evalRealizadasKey = this.claveUsuario("evaluacionesRealizadas");

      console.log("🔑 Clave de evaluaciones:", evalKey);

      // Cargar datos del localStorage
      this.tareasGuardadas = JSON.parse(localStorage.getItem(tareasKey) || "[]");
      this.evaluacionesGuardadas = JSON.parse(localStorage.getItem(evalKey) || "[]");
      this.archivosSubidos = JSON.parse(localStorage.getItem(archivosKey) || "{}");
      this.evaluacionesRealizadas = JSON.parse(localStorage.getItem(evalRealizadasKey) || "{}");

      console.log("📝 Tareas cargadas:", this.tareasGuardadas.length);
      console.log("🎯 Evaluaciones cargadas:", this.evaluacionesGuardadas.length);
      console.log("📄 Evaluaciones desde storage:", localStorage.getItem(evalKey));

      // Inicializar datos si no existen
      if (!this.archivosSubidos[this.curso.id]) {
        this.archivosSubidos[this.curso.id] = {};
        localStorage.setItem(archivosKey, JSON.stringify(this.archivosSubidos));
      }

      if (!this.evaluacionesRealizadas[this.curso.id]) {
        this.evaluacionesRealizadas[this.curso.id] = {};
        localStorage.setItem(evalRealizadasKey, JSON.stringify(this.evaluacionesRealizadas));
      }

      // Forzar reactividad
      this.$forceUpdate();
    },

    // Método para recargar específicamente las evaluaciones
    recargarEvaluaciones() {
      if (!this.curso) return;
      
      const evalKey = `evaluaciones_curso_${this.curso.id}`;
      const evaluacionesFromStorage = localStorage.getItem(evalKey);
      
      console.log("🔄 Recargando evaluaciones...");
      console.log("📄 Datos en storage:", evaluacionesFromStorage);
      
      this.evaluacionesGuardadas = JSON.parse(evaluacionesFromStorage || "[]");
      
      console.log("🎯 Evaluaciones después de recargar:", this.evaluacionesGuardadas.length);
      
      this.$forceUpdate();
    },

    yaRealizoEvaluacion(idx) {
      return (
        this.evaluacionesRealizadas[this.curso?.id] &&
        this.evaluacionesRealizadas[this.curso.id][idx] !== undefined
      );
    },

    obtenerCalificacionEvaluacion(idx) {
      return this.evaluacionesRealizadas[this.curso?.id]?.[idx]?.calificacion ?? null;
    },

    realizarEvaluacion(idx) {
      if (this.yaRealizoEvaluacion(idx)) {
        alert("Ya has realizado esta evaluación.");
        return;
      }
      this.$router.push({
        path: "/RealizarEvaluacion",
        query: { cursoId: this.curso.id, evaluacionIndex: idx },
      });
    },

    irCrearEvaluacion() {
      this.$router.push({ path: "/CrearEvaluacion", query: { cursoId: this.curso.id } });
    },

    irCrearTarea() {
      this.$router.push({ path: "/CrearTarea", query: { cursoId: this.curso.id } });
    },

    irSubirArchivo(idx) {
      this.$router.push({
        path: '/SubirArchivo',
        query: {
          cursoId: this.curso.id,
          tareaIndex: idx
        }
      });
    },

    archivoSubido(tareaIdx) {
      return this.archivosSubidos[this.curso?.id]?.[tareaIdx] !== undefined;
    },

    obtenerNombreArchivo(tareaIdx) {
      return this.archivosSubidos[this.curso?.id]?.[tareaIdx]?.nombreArchivo || "";
    },

    eliminarArchivo(tareaIdx) {
      if (!confirm("¿Eliminar el archivo subido para esta tarea?")) return;
      const archivosKey = this.claveUsuario("archivosSubidos");

      if (this.archivosSubidos[this.curso.id]) {
        delete this.archivosSubidos[this.curso.id][tareaIdx];
        if (Object.keys(this.archivosSubidos[this.curso.id]).length === 0) {
          delete this.archivosSubidos[this.curso.id];
        }
        localStorage.setItem(archivosKey, JSON.stringify(this.archivosSubidos));
        alert("Archivo eliminado correctamente.");
        this.cargarDatos();
      }
    },

    eliminarTarea(idx) {
      if (confirm(`¿Eliminar la tarea "${this.tareasCurso[idx].titulo}"?`)) {
        this.tareasCurso.splice(idx, 1);
        const tareasKey = `tareas_curso_${this.curso.id}`;
        localStorage.setItem(tareasKey, JSON.stringify(this.tareasCurso));
      }
    },

    eliminarEvaluacion(idx) {
      if (confirm(`¿Eliminar la evaluación "${this.evaluacionesCurso[idx].titulo}"?`)) {
        this.evaluacionesCurso.splice(idx, 1);
        const evalKey = `evaluaciones_curso_${this.curso.id}`;
        localStorage.setItem(evalKey, JSON.stringify(this.evaluacionesCurso));
        console.log("🗑️ Evaluación eliminada, recargando...");
        this.recargarEvaluaciones();
      }
    },

    cerrarSesion() {
      localStorage.removeItem("rol");
      localStorage.removeItem("usuario");
      this.$router.push("/Inicio");
    },

    handleStorageChange(e) {
      if (e.key && e.key.includes('evaluaciones_curso_')) {
        console.log("📡 Cambio detectado en localStorage para evaluaciones");
        this.recargarEvaluaciones();
      }
    },

    handleWindowFocus() {
      console.log("👁️ Ventana enfocada, recargando evaluaciones...");
      this.recargarEvaluaciones();
    },
  }
};
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f9fafb;
  font-family: 'Segoe UI', sans-serif;
  color: #1f2937;
}

main {
  flex-grow: 1;
}

.bg-purple {
  background-color: #7c3aed !important;
}

.navbar .nav-link {
  color: #fffefe;
  font-weight: 500;
}

.text-purple {
  color: #6b21a8;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 2rem 0 1rem;
  color: #4b5563;
}

.task-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  margin-bottom: 1.5rem;
  transition: box-shadow 0.2s;
}

.task-card:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}

.btn-purple {
  background-color: #7c3aed;
  color: #fff;
  border: none;
  padding: 0.5rem 1.2rem;
  font-weight: 600;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.btn-purple:hover {
  background-color: #5b21b6;
}

#descripcionCurso {
  white-space: pre-line;
  background-color: #fff;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  margin: 1.5rem auto;
  max-width: 800px;
  font-size: 1.05rem;
  line-height: 1.6;
  color: #374151;
}

footer {
  background-color: #4c4f4f;
  padding: 0.6rem 0.2rem;
  text-align: center;
  color: white;
}

.text-success {
  color: #22c55e;
}

/* Estilos para debug */
.bg-light {
  background-color: #f8f9fa !important;
}

pre {
  font-size: 0.8rem;
  max-height: 200px;
  overflow-y: auto;
}
</style>