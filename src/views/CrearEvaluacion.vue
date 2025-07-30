<template>
  <div class="container my-5">
    <div class="header-section">
      <h2>✨ Crear Nueva Evaluación</h2>
      <p class="text-muted">Diseña una evaluación para tu curso con preguntas de opción múltiple</p>
    </div>

    <form @submit.prevent="guardarEvaluacion">
      <div class="mb-4">
        <label for="tituloEvaluacion" class="form-label fw-bold">📝 Título de la evaluación</label>
        <input
          id="tituloEvaluacion"
          v-model="titulo"
          type="text"
          class="form-control form-control-lg"
          placeholder="Ej: Evaluación Final - Matemáticas Básicas"
          required
        />
      </div>

      <div class="questions-section">
        <h4 class="mb-3">🤔 Preguntas de la Evaluación</h4>
        
        <div
          v-for="(pregunta, index) in preguntas"
          :key="index"
          class="question-card mb-4"
        >
          <div class="question-header">
            <label class="form-label fw-bold">Pregunta {{ index + 1 }}</label>
            <button
              v-if="preguntas.length > 1"
              type="button"
              class="btn btn-outline-danger btn-sm"
              @click="eliminarPregunta(index)"
            >
              🗑️ Eliminar
            </button>
          </div>
          
          <input
            v-model="pregunta.texto"
            type="text"
            class="form-control mb-3"
            placeholder="Escribe aquí tu pregunta..."
            required
          />

          <div class="options-container">
            <p class="small text-muted mb-2">Selecciona la respuesta correcta:</p>
            <div
              v-for="(opcion, i) in pregunta.opciones"
              :key="i"
              class="option-row mb-2"
            >
              <div class="option-input">
                <input
                  type="radio"
                  :name="'correcta' + index"
                  :value="['a', 'b', 'c'][i]"
                  v-model="pregunta.correcta"
                  :id="`q${index}o${i}`"
                  required
                />
                <label :for="`q${index}o${i}`" class="option-label">
                  {{ String.fromCharCode(65 + i) }}
                </label>
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
        </div>
      </div>

      <div class="actions-section">
        <button
          type="button"
          class="btn btn-outline-primary mb-3"
          @click="agregarPregunta"
        >
          ➕ Agregar pregunta
        </button>
        
        <div class="form-actions">
          <button type="submit" class="btn btn-purple btn-lg">
            💾 Guardar Evaluación
          </button>
          <button
            type="button"
            class="btn btn-secondary btn-lg"
            @click="cancelar"
          >
            ❌ Cancelar
          </button>
        </div>
      </div>
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
      usuario: JSON.parse(localStorage.getItem("usuarioActual")),
    };
  },
  mounted() {
    // Obtener cursoId desde query params (Vue Router)
    this.cursoId = this.$route.query.cursoId;
    
    // Fallback: intentar obtener desde URL params si no está en $route
    if (!this.cursoId) {
      const urlParams = new URLSearchParams(window.location.search);
      this.cursoId = urlParams.get("cursoId");
    }

    console.log("🎯 Curso ID recibido:", this.cursoId);

    if (!this.cursoId) {
      alert("❌ Falta el ID del curso");
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

    eliminarPregunta(index) {
      if (this.preguntas.length > 1) {
        this.preguntas.splice(index, 1);
      }
    },

    validarPreguntas() {
      for (let i = 0; i < this.preguntas.length; i++) {
        const p = this.preguntas[i];
        if (!p.texto.trim()) {
          alert(`❌ La pregunta ${i + 1} está vacía.`);
          return false;
        }
        if (p.opciones.some((op) => !op.trim())) {
          alert(`❌ Debe llenar todas las opciones en la pregunta ${i + 1}.`);
          return false;
        }
        if (!p.correcta) {
          alert(`❌ Debe seleccionar la opción correcta para la pregunta ${i + 1}.`);
          return false;
        }
      }
      return true;
    },

    guardarEvaluacion() {
      console.log("💾 Iniciando guardado de evaluación...");
      
      if (!this.titulo.trim()) {
        alert("❌ Debe ingresar el título de la evaluación.");
        return;
      }
      if (!this.validarPreguntas()) {
        return;
      }

      // CLAVE CORREGIDA: usar la misma que lee CursoGenerico
      const claveCorrecta = `evaluaciones_curso_${this.cursoId}`;
      console.log("🔑 Usando clave:", claveCorrecta);

      // Cargar evaluaciones existentes
      const evaluacionesExistentes = JSON.parse(localStorage.getItem(claveCorrecta) || "[]");
      console.log("📋 Evaluaciones existentes:", evaluacionesExistentes.length);

      // Crear nueva evaluación
      const nuevaEvaluacion = {
        titulo: this.titulo.trim(),
        descripcion: `Evaluación con ${this.preguntas.length} pregunta${this.preguntas.length > 1 ? 's' : ''}`,
        preguntas: this.preguntas.map((p) => ({
          texto: p.texto.trim(),
          opciones: p.opciones.map((o) => o.trim()),
          correcta: p.correcta,
        })),
        fechaCreacion: new Date().toISOString(),
        creador: this.usuario?.email || this.usuario?.correo,
      };

      // Agregar la nueva evaluación al array
      evaluacionesExistentes.push(nuevaEvaluacion);

      // Guardar en localStorage
      localStorage.setItem(claveCorrecta, JSON.stringify(evaluacionesExistentes));
      
      console.log("✅ Evaluación guardada exitosamente");
      console.log("📊 Total evaluaciones ahora:", evaluacionesExistentes.length);
      console.log("🎯 Datos guardados:", nuevaEvaluacion);

      // Confirmar que se guardó
      const verificacion = localStorage.getItem(claveCorrecta);
      console.log("🔍 Verificación - datos en storage:", verificacion);

      alert("✅ Evaluación guardada correctamente.");
      
      // Navegar de vuelta al curso
      this.$router.push({
        path: "/CursoGenerico",
        query: { cursoId: this.cursoId, refresh: Date.now() }
      });
    },

    cancelar() {
      if (confirm("¿Estás seguro? Se perderán los cambios no guardados.")) {
        this.$router.back();
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 900px;
  background: white;
  padding: 2rem;
  border-radius: 15px;
  margin: 2rem auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.header-section {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f1f3f4;
}

.header-section h2 {
  color: #6b21a8;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.questions-section h4 {
  color: #374151;
  margin-bottom: 1.5rem;
}

.question-card {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.question-card:hover {
  border-color: #7c3aed;
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.1);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.question-header .form-label {
  color: #6b21a8;
  font-size: 1.1rem;
  margin: 0;
}

.options-container {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #dee2e6;
}

.option-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.option-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.option-label {
  background: #6b21a8;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
}

input[type="radio"]:checked + .option-label {
  background: #10b981;
  transform: scale(1.1);
}

.actions-section {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid #f1f3f4;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.btn-purple {
  background: linear-gradient(135deg, #7c3aed, #6b21a8);
  color: white;
  border: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-purple:hover {
  background: linear-gradient(135deg, #6b21a8, #5b21b6);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(124, 58, 237, 0.3);
}

.form-control:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 0.2rem rgba(124, 58, 237, 0.25);
}

.btn-outline-primary {
  border-color: #7c3aed;
  color: #7c3aed;
}

.btn-outline-primary:hover {
  background-color: #7c3aed;
  border-color: #7c3aed;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    margin: 1rem;
    padding: 1rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .option-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .option-input {
    justify-content: flex-start;
  }
}
</style>