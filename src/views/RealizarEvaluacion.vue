<template>
  <div class="container mt-5">
    <h2>{{ evaluacion?.titulo || "Cargando evaluación..." }}</h2>

    <!-- Mostrar resultado si ya fue realizada -->
    <div v-if="calificacionGuardada" class="alert alert-info mt-4" v-html="mensajeCalificacion"></div>

    <!-- Botón Volver al curso después de evaluación -->
    <div v-if="calificacionGuardada" class="mt-3">
      <button @click="volverAlCurso" class="btn btn-secondary">Volver al curso</button>
    </div>

    <!-- Mostrar formulario solo si no ha sido realizada -->
    <form v-else-if="evaluacion" @submit.prevent="finalizarEvaluacion">
      <div v-for="(pregunta, i) in evaluacion.preguntas" :key="i" class="pregunta">
        <p><strong>Pregunta {{ i + 1 }}:</strong> {{ pregunta.texto }}</p>
        <label
          v-for="(opcion, j) in pregunta.opciones"
          :key="j"
          class="opcion-label"
        >
          <input
            type="radio"
            :name="'pregunta' + i"
            :value="letras[j]"
            v-model="respuestas[i]"
            @change="verificarRespuestas"
            required
          />
          {{ opcion }}
        </label>
      </div>

      <button type="submit" class="btn btn-purple" :disabled="!puedeFinalizar">
        Finalizar
      </button>
      <router-link to="/CursoGenerico" class="btn btn-link ms-3">Volver</router-link>
    </form>

    <div v-else class="text-center">
      <div class="spinner-border text-primary mt-5" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RealizarEvaluacion",
  data() {
    return {
      cursoId: null,
      evaluacionIndex: null,
      evaluacion: null,
      respuestas: [],
      letras: ["a", "b", "c"],
      puedeFinalizar: false,
      calificacionGuardada: null,
      mensajeCalificacion: ""
    };
  },
  mounted() {
    const params = new URLSearchParams(window.location.search);
    this.cursoId = params.get("cursoId");
    this.evaluacionIndex = parseInt(params.get("evaluacionIndex"));

    if (!this.cursoId || isNaN(this.evaluacionIndex)) {
      alert("Parámetros inválidos.");
      history.back();
      return;
    }

    const evaluacionesData =
      JSON.parse(localStorage.getItem("evaluaciones")) || {};
    const evaluacionesCurso = evaluacionesData[this.cursoId] || [];

    if (
      this.evaluacionIndex < 0 ||
      this.evaluacionIndex >= evaluacionesCurso.length
    ) {
      alert("Evaluación no encontrada.");
      history.back();
      return;
    }

    this.evaluacion = evaluacionesCurso[this.evaluacionIndex];
    this.respuestas = Array(this.evaluacion.preguntas.length).fill(null);

    // Revisar si ya existe calificación guardada
    const evaluacionesRealizadas =
      JSON.parse(localStorage.getItem("evaluacionesRealizadas")) || {};

    if (
      evaluacionesRealizadas[this.cursoId] &&
      evaluacionesRealizadas[this.cursoId][this.evaluacionIndex]
    ) {
      this.calificacionGuardada =
        evaluacionesRealizadas[this.cursoId][this.evaluacionIndex];
      this.mensajeCalificacion = `
        Ya realizaste esta evaluación.<br/>
        Tu calificación es <strong>${this.calificacionGuardada.calificacion}</strong>.<br/>
        <small>Realizada el: ${new Date(this.calificacionGuardada.fecha).toLocaleString()}</small>
      `;
    }
  },
  methods: {
    verificarRespuestas() {
      this.puedeFinalizar = this.respuestas.every((r) => r !== null);
    },
    finalizarEvaluacion() {
      const total = this.evaluacion.preguntas.length;
      let correctas = 0;

      this.evaluacion.preguntas.forEach((pregunta, i) => {
        if (this.respuestas[i] === pregunta.correcta) correctas++;
      });

      const porcentaje = (correctas / total) * 100;

      // Guardar calificación en localStorage para impedir repetir
      const evaluacionesRealizadas =
        JSON.parse(localStorage.getItem("evaluacionesRealizadas")) || {};

      if (!evaluacionesRealizadas[this.cursoId]) {
        evaluacionesRealizadas[this.cursoId] = {};
      }

      evaluacionesRealizadas[this.cursoId][this.evaluacionIndex] = {
        calificacion: `${porcentaje.toFixed(2)}%`,
        fecha: new Date().toISOString(),
      };

      localStorage.setItem("evaluacionesRealizadas", JSON.stringify(evaluacionesRealizadas));

      this.calificacionGuardada = evaluacionesRealizadas[this.cursoId][this.evaluacionIndex];
      this.mensajeCalificacion = `
        Has respondido correctamente <strong>${correctas}</strong> de <strong>${total}</strong> preguntas.<br/>
        Tu nota es <strong>${porcentaje.toFixed(2)}%</strong>.<br/>
        <small>Realizada el: ${new Date(this.calificacionGuardada.fecha).toLocaleString()}</small>
      `;

      this.puedeFinalizar = false;
    },
    volverAlCurso() {
      this.$router.push({ path: "/CursoGenerico", query: { cursoId: this.cursoId } });
    }
  }
};
</script>

<style scoped>
body {
  background-color: #f9f9f9;
}
.container {
  max-width: 800px;
  margin: 40px auto;
  background: white;
  padding: 30px;
  border-radius: 10px;
}
.btn-purple {
  background-color: #7c3aed;
  color: #fff;
  border: none;
}
.btn-purple:hover {
  background-color: #6b21a8;
}
.pregunta {
  margin-bottom: 25px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.opcion-label {
  display: block;
  margin-bottom: 8px;
  cursor: pointer;
}
.btn-secondary {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  cursor: pointer;
}
.btn-secondary:hover {
  background-color: #5a6268;
}
</style>
