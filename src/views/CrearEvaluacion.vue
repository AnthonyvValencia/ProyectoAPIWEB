<template>
  <div class="container my-5">
    <h2>Crear Nueva Evaluación</h2>
    <form @submit.prevent="guardarEvaluacion">
      <div class="mb-3">
        <label for="tituloEvaluacion" class="form-label">Título de la evaluación</label>
        <input
          id="tituloEvaluacion"
          v-model="titulo"
          type="text"
          class="form-control"
          required
        />
      </div>

      <div id="preguntasContainer">
        <div
          v-for="(pregunta, index) in preguntas"
          :key="index"
          class="mb-4 border p-3 rounded"
        >
          <label class="form-label"><strong>Pregunta {{ index + 1 }}</strong></label>
          <input
            v-model="pregunta.texto"
            type="text"
            class="form-control mb-2"
            placeholder="Texto de la pregunta"
            required
          />

          <div
            v-for="(opcion, i) in pregunta.opciones"
            :key="i"
            class="mb-2 d-flex align-items-center gap-2"
          >
            <input
              type="radio"
              :name="'correcta' + index"
              :value="['a', 'b', 'c'][i]"
              v-model="pregunta.correcta"
              required
            />
            <input
              v-model="pregunta.opciones[i]"
              type="text"
              class="form-control"
              :placeholder="`Opción ${String.fromCharCode(65 + i)}`"
              required
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        class="btn btn-secondary mb-3"
        @click="agregarPregunta"
      >
        Agregar pregunta
      </button>
      <button type="submit" class="btn btn-purple">Guardar Evaluación</button>
      <button
        type="button"
        class="btn btn-link"
        @click="cancelar"
      >
        Cancelar
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: "CrearEvaluacion",
  data() {
    return {
      cursoId: null,
      titulo: "",
      preguntas: [
        {
          texto: "",
          opciones: ["", "", ""],
          correcta: null,
        },
      ],
    };
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    this.cursoId = urlParams.get("cursoId");

    if (!this.cursoId) {
      alert("Falta el ID del curso");
      this.$router.back();
    }
  },
  methods: {
    agregarPregunta() {
      this.preguntas.push({
        texto: "",
        opciones: ["", "", ""],
        correcta: null,
      });
    },
    validarPreguntas() {
      for (let i = 0; i < this.preguntas.length; i++) {
        const p = this.preguntas[i];
        if (!p.texto.trim()) {
          alert(`La pregunta ${i + 1} está vacía.`);
          return false;
        }
        if (p.opciones.some((op) => !op.trim())) {
          alert(`Debe llenar todas las opciones en la pregunta ${i + 1}.`);
          return false;
        }
        if (!p.correcta) {
          alert(`Debe seleccionar la opción correcta para la pregunta ${i + 1}.`);
          return false;
        }
      }
      return true;
    },
    guardarEvaluacion() {
      if (!this.titulo.trim()) {
        alert("Debe ingresar el título de la evaluación.");
        return;
      }
      if (!this.validarPreguntas()) {
        return;
      }
      const todasEvaluaciones = JSON.parse(localStorage.getItem("evaluaciones") || "{}");
      if (!todasEvaluaciones[this.cursoId]) {
        todasEvaluaciones[this.cursoId] = [];
      }
      todasEvaluaciones[this.cursoId].push({
        titulo: this.titulo.trim(),
        preguntas: this.preguntas.map((p) => ({
          texto: p.texto.trim(),
          opciones: p.opciones.map((o) => o.trim()),
          correcta: p.correcta,
        })),
      });
      localStorage.setItem("evaluaciones", JSON.stringify(todasEvaluaciones));
      alert("Evaluación guardada correctamente.");
      this.$router.push({ path: "/CursoGenerico", query: { cursoId: this.cursoId } });
    },
    cancelar() {
      this.$router.back();
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  background: white;
  padding: 30px;
  border-radius: 10px;
  margin: 40px auto;
  background-color: #f9f9f9;
}

.btn-purple {
  background-color: #7c3aed;
  color: #fff;
  border: none;
}
.btn-purple:hover {
  background-color: #6b21a8;
}
</style>
