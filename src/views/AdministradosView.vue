<template>
  <div class="container mt-5">
    <button @click="cerrarSesion" class="btn btn-outline-danger btn-cerrar">Cerrar sesión</button>
    <h1 class="mb-4 text-center">Panel del Administrador</h1>

    <div class="row g-4">
      <!-- Usuarios -->
      <div class="col-md-6" v-if="usuarios.length">
        <div class="card">
          <div class="card-header">Usuarios</div>
          <ul class="list-group list-group-flush">
            <li v-for="(u, index) in usuarios" :key="index" class="list-group-item">
              {{ u.nombre }} ({{ u.rol }})
            </li>
          </ul>
        </div>
      </div>

      <!-- Cursos -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">Cursos</div>
          <ul class="list-group list-group-flush">
            <li v-if="cursos.length === 0" class="list-group-item">No hay cursos registrados</li>
            <li v-for="(c, index) in cursos" :key="index" class="list-group-item d-flex justify-content-between align-items-center">
              {{ c.titulo || 'Curso sin título' }}
              <button class="btn btn-sm btn-danger" @click="eliminarCurso(index)">Eliminar</button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Tareas -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">Tareas</div>
          <ul class="list-group list-group-flush">
            <li v-if="todasTareas.length === 0" class="list-group-item">No hay tareas registradas</li>
            <li v-for="(tarea, index) in todasTareas" :key="index" class="list-group-item d-flex justify-content-between align-items-center">
              <div><strong>{{ tarea.titulo }}</strong> - {{ tarea.descripcion }}</div>
              <button class="btn btn-sm btn-danger" @click="eliminarTarea(tarea.cursoId, tarea.index)">Eliminar</button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Evaluaciones -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">Evaluaciones</div>
          <ul class="list-group list-group-flush">
            <li v-if="todasEvaluaciones.length === 0" class="list-group-item">No hay evaluaciones registradas</li>
            <li v-for="(e, index) in todasEvaluaciones" :key="index" class="list-group-item d-flex justify-content-between align-items-center">
              <div><strong>{{ e.titulo }}</strong> ({{ e.preguntas?.length || 0 }} pregunta/s)</div>
              <button class="btn btn-sm btn-danger" @click="eliminarEvaluacion(e.cursoId, e.index)">Eliminar</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdministradorView",
  data() {
    return {
      usuarios: [
        { nombre: "Juan Pérez", rol: "Estudiante" },
        { nombre: "Jenny Wilson", rol: "Profesor" },
        { nombre: "admin", rol: "Administrador" }
      ],
      cursos: [],
      tareasPorCurso: {},
      evaluacionesPorCurso: {}
    };
  },
  computed: {
    todasTareas() {
      return Object.entries(this.tareasPorCurso).flatMap(([cursoId, tareas]) =>
        tareas.map((t, index) => ({ ...t, cursoId, index }))
      );
    },
    todasEvaluaciones() {
      return Object.entries(this.evaluacionesPorCurso).flatMap(([cursoId, evaluaciones]) =>
        evaluaciones.map((e, index) => ({ ...e, cursoId, index }))
      );
    }
  },
  mounted() {
    this.cursos = JSON.parse(localStorage.getItem("cursosAgregados")) || [];
    this.tareasPorCurso = JSON.parse(localStorage.getItem("tareas")) || {};
    this.evaluacionesPorCurso = JSON.parse(localStorage.getItem("evaluaciones")) || {};
  },
  methods: {
    eliminarCurso(index) {
      if (confirm("¿Eliminar este curso?")) {
        this.cursos.splice(index, 1);
        localStorage.setItem("cursosAgregados", JSON.stringify(this.cursos));
      }
    },
    eliminarTarea(cursoId, tareaIndex) {
      if (confirm("¿Eliminar esta tarea?")) {
        this.tareasPorCurso[cursoId].splice(tareaIndex, 1);
        localStorage.setItem("tareas", JSON.stringify(this.tareasPorCurso));
      }
    },
    eliminarEvaluacion(cursoId, evaluacionIndex) {
      if (confirm("¿Eliminar esta evaluación?")) {
        this.evaluacionesPorCurso[cursoId].splice(evaluacionIndex, 1);
        localStorage.setItem("evaluaciones", JSON.stringify(this.evaluacionesPorCurso));
      }
    },
    cerrarSesion() {
      localStorage.removeItem("usuarioActual");
      alert("Sesión cerrada.");
      this.$router.push("/Sesion");
    }
  }
};
</script>

<style scoped>
body {
  background-color: #f4f4f4;
}
.card {
  border-radius: 10px;
}
.card-header {
  background-color: #7c3aed;
  color: #fff;
}
.btn-cerrar {
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>
