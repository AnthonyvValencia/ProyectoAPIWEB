<template>
  <div class="layout">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div class="container">
        <a class="navbar-brand fw-bold" href="/Inicio">Educan593</a>
        <div class="collapse navbar-collapse justify-content-end">
          <ul class="navbar-nav">
            <li class="nav-item"><router-link class="nav-link" to="/Cursos">Mis Cursos</router-link></li>
            <li><router-link class="nav-link me-3" to="/Certificados">Certificado</router-link></li>
            <li><router-link class="nav-link" to="/Perfil">Perfil</router-link></li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Contenido principal -->
    <main class="container py-4 flex-grow-1">
      <h1 id="tituloCurso" class="mb-4">{{ curso?.titulo || "Curso no encontrado" }}</h1>
      <div id="descripcionCurso">{{ descripcionFormateada }}</div>

      <!-- Botones Crear Evaluación / Crear Tarea para profesores -->
      <div class="mb-4 text-center" v-if="rol === 'profesor'">
        <button class="btn btn-purple me-2" @click="irCrearEvaluacion">Crear Evaluación</button>
        <button class="btn btn-purple" @click="irCrearTarea">Crear Tarea</button>
      </div>

      <h2 class="section-title">Recursos Audiovisuales</h2>
      <div>
        <div
          v-for="(video, i) in curso?.videos || []"
          :key="i"
          class="mb-4 mx-auto"
          style="max-width: 600px;"
        >
          <div class="ratio ratio-16x9">
            <iframe
              :src="video.url"
              :title="video.titulo"
              allowfullscreen
            ></iframe>
          </div>
          <p class="text-center mt-2">{{ video.titulo }}</p>
        </div>
      </div>

      <h2 class="section-title">Tareas y Evaluaciones</h2>
      <div>
        <div
          v-for="(tarea, idx) in tareasCurso"
          :key="'tarea-'+idx"
          class="task-card"
        >
          <h5>{{ tarea.titulo }}</h5>
          <p>{{ tarea.descripcion }}</p>

          <template v-if="rol === 'estudiante'">
            <!-- Mostrar botón Enviar solo si no hay archivo subido -->
            <button
              v-if="!archivoSubido(idx)"
              class="btn btn-purple mt-2"
              @click="irSubirArchivo(idx)"
            >
              {{ tarea.boton || "Enviar tarea" }}
            </button>

            <!-- Mostrar botón Eliminar si hay archivo subido -->
            <div v-else class="mt-2">
              <span class="me-3">Archivo subido: {{ obtenerNombreArchivo(idx) }}</span>
              <button
                class="btn btn-danger"
                @click="eliminarArchivo(idx)"
              >
                Eliminar archivo
              </button>
            </div>
          </template>

          <button
            v-if="rol === 'profesor'"
            class="btn btn-danger mt-2 ms-2"
            @click="eliminarTarea(idx)"
          >
            Eliminar
          </button>
        </div>

        <div
          v-for="(evaluacion, idx) in evaluacionesCurso"
          :key="'eval-'+idx"
          class="task-card d-flex justify-content-between align-items-center"
        >
          <span>{{ evaluacion.titulo }}</span>

          <div>
            <template v-if="rol === 'estudiante'">
              <button
                v-if="!yaRealizoEvaluacion(idx)"
                class="btn btn-purple"
                @click="realizarEvaluacion(idx)"
              >
                Realizar Evaluación
              </button>

              <span v-else class="text-success fw-bold">
                Calificación: {{ obtenerCalificacionEvaluacion(idx) }}
              </span>
            </template>

            <button
              v-if="rol === 'profesor'"
              class="btn btn-danger ms-2"
              @click="eliminarEvaluacion(idx)"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </main>

    <footer>
      <div class="card-footer text-center">
        <p class="mb-1 fw-bold fs-10">Educan593</p>
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
      curso: null,
      tareasGuardadas: {},
      evaluacionesGuardadas: {},
      archivosSubidos: {},
      evaluacionesRealizadas: {},
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
      if (!this.curso) return [];
      return this.tareasGuardadas[this.curso.id] || [];
    },
    evaluacionesCurso() {
      if (!this.curso) return [];
      return this.evaluacionesGuardadas[this.curso.id] || [];
    },
  },
  methods: {
    cargarDatos() {
      this.curso = JSON.parse(localStorage.getItem("cursoSeleccionado"));
      this.tareasGuardadas = JSON.parse(localStorage.getItem("tareas") || "{}");
      this.evaluacionesGuardadas = JSON.parse(localStorage.getItem("evaluaciones") || "{}");
      this.archivosSubidos = JSON.parse(localStorage.getItem("archivosSubidos") || "{}");
      this.evaluacionesRealizadas = JSON.parse(localStorage.getItem("evaluacionesRealizadas") || "{}");

      if (this.curso) {
        if (!this.tareasGuardadas[this.curso.id]) {
          this.tareasGuardadas = {
            ...this.tareasGuardadas,
            [this.curso.id]: Array.isArray(this.curso.tareas) ? [...this.curso.tareas] : []
          };
          localStorage.setItem("tareas", JSON.stringify(this.tareasGuardadas));
        }
        if (!this.evaluacionesGuardadas[this.curso.id]) {
          this.evaluacionesGuardadas = {
            ...this.evaluacionesGuardadas,
            [this.curso.id]: []
          };
          localStorage.setItem("evaluaciones", JSON.stringify(this.evaluacionesGuardadas));
        }
        if (!this.archivosSubidos[this.curso.id]) {
          this.archivosSubidos[this.curso.id] = {};
          localStorage.setItem("archivosSubidos", JSON.stringify(this.archivosSubidos));
        }
        if (!this.evaluacionesRealizadas[this.curso.id]) {
          this.evaluacionesRealizadas[this.curso.id] = {};
          localStorage.setItem("evaluacionesRealizadas", JSON.stringify(this.evaluacionesRealizadas));
        }
      }
    },
    yaRealizoEvaluacion(idx) {
      return (
        this.evaluacionesRealizadas[this.curso?.id] &&
        this.evaluacionesRealizadas[this.curso.id][idx] !== undefined
      );
    },
    obtenerCalificacionEvaluacion(idx) {
      if (!this.evaluacionesRealizadas[this.curso?.id]) return null;
      return this.evaluacionesRealizadas[this.curso.id][idx]?.calificacion ?? null;
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
      return (
        this.archivosSubidos[this.curso?.id] &&
        this.archivosSubidos[this.curso.id][tareaIdx] !== undefined
      );
    },
    obtenerNombreArchivo(tareaIdx) {
      if (!this.archivosSubidos[this.curso?.id]) return "";
      return this.archivosSubidos[this.curso.id][tareaIdx]?.nombreArchivo || "";
    },
    eliminarArchivo(tareaIdx) {
      if (!confirm("¿Eliminar el archivo subido para esta tarea?")) return;

      if (this.archivosSubidos[this.curso.id]) {
        delete this.archivosSubidos[this.curso.id][tareaIdx];
        if (Object.keys(this.archivosSubidos[this.curso.id]).length === 0) {
          delete this.archivosSubidos[this.curso.id];
        }
        localStorage.setItem("archivosSubidos", JSON.stringify(this.archivosSubidos));
        alert("Archivo eliminado correctamente.");
        this.cargarDatos();
      }
    },
    eliminarTarea(idx) {
      if (confirm(`¿Eliminar la tarea "${this.tareasCurso[idx].titulo}"?`)) {
        this.tareasCurso.splice(idx, 1);
        this.tareasGuardadas = {
          ...this.tareasGuardadas,
          [this.curso.id]: this.tareasCurso
        };
        localStorage.setItem("tareas", JSON.stringify(this.tareasGuardadas));
      }
    },
    eliminarEvaluacion(idx) {
      if (confirm(`¿Eliminar la evaluación "${this.evaluacionesCurso[idx].titulo}"?`)) {
        this.evaluacionesCurso.splice(idx, 1);
        this.evaluacionesGuardadas = {
          ...this.evaluacionesGuardadas,
          [this.curso.id]: this.evaluacionesCurso
        };
        if (this.evaluacionesRealizadas[this.curso.id]) {
          delete this.evaluacionesRealizadas[this.curso.id][idx];
          localStorage.setItem("evaluacionesRealizadas", JSON.stringify(this.evaluacionesRealizadas));
        }
        localStorage.setItem("evaluaciones", JSON.stringify(this.evaluacionesGuardadas));
      }
    },
  },
  mounted() {
    this.cargarDatos();
  },
  watch: {
    $route() {
      this.cargarDatos();
    },
  },
};
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
}
main {
  flex-grow: 1;
}
.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
.task-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}
.btn-purple {
  background-color: #7c3aed;
  color: #fff;
  border: none;
  cursor: pointer;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  font-weight: 600;
}
.btn-purple:hover {
  background-color: #6b21a8;
}
#descripcionCurso {
  white-space: pre-line;
  background-color: #fff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  font-size: 1.1rem;
  line-height: 1.4;
}
footer {
  background-color: #f1f1f1;
  padding: 1rem;
  text-align: center;
}
.text-success {
  color: #28a745;
}
</style>
