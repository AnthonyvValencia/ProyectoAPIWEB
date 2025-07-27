<template>
  <div class="upload-container">
    <h2 class="mb-4 text-center">Subir Archivo - {{ nombreTarea }}</h2>

    <form @submit.prevent="subirArchivo" enctype="multipart/form-data" novalidate>
      <div class="mb-3">
        <label for="archivo" class="form-label">Selecciona el archivo para subir:</label>
        <input
          ref="archivoInput"
          class="form-control"
          type="file"
          id="archivo"
          required
        />
      </div>

      <button type="submit" class="btn btn-purple w-100">Subir Archivo</button>
    </form>

    <div class="mt-3 text-center">
      <button @click="volverCurso" class="btn btn-link">← Volver al curso</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SubirArchivo",
  data() {
    return {
      cursoId: null,
      tareaIndex: null,
      nombreTarea: "Tarea",
    };
  },
  mounted() {
    this.cursoId = this.$route.query.cursoId;
    this.tareaIndex = this.$route.query.tareaIndex;

    if (!this.cursoId || this.tareaIndex === undefined) {
      alert("Faltan parámetros obligatorios.");
      this.$router.back();
      return;
    }

    // Cargar nombre de tarea desde localStorage para mostrar título más exacto
    const curso = JSON.parse(localStorage.getItem("cursoSeleccionado"));
    if (curso && curso.tareas && curso.tareas[this.tareaIndex]) {
      this.nombreTarea = curso.tareas[this.tareaIndex].titulo || "Tarea";
    }
  },
  methods: {
    subirArchivo() {
      const archivoInput = this.$refs.archivoInput;
      if (!archivoInput.files.length) {
        alert("Debes seleccionar un archivo antes de subir.");
        return;
      }

      // Simular subida guardando metadata en localStorage
      let archivosSubidos = JSON.parse(localStorage.getItem("archivosSubidos") || "{}");
      if (!archivosSubidos[this.cursoId]) archivosSubidos[this.cursoId] = {};

      archivosSubidos[this.cursoId][this.tareaIndex] = {
        nombreArchivo: archivoInput.files[0].name,
        fechaSubida: new Date().toISOString(),
      };

      localStorage.setItem("archivosSubidos", JSON.stringify(archivosSubidos));

      alert("Archivo subido correctamente.");
      this.$router.push({ path: "/CursoGenerico", query: { cursoId: this.cursoId } });
    },
    volverCurso() {
      this.$router.push({ path: "/CursoGenerico", query: { cursoId: this.cursoId } });
    },
  },
};
</script>

<style scoped>
.upload-container {
  max-width: 500px;
  margin: 80px auto;
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
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
