<template>
  <div class="container my-5 p-4 bg-white rounded-3" style="max-width: 600px;">
    <h2>Crear Nueva Tarea</h2>
    <form @submit.prevent="guardarTarea">
      <div class="mb-3">
        <label for="tituloTarea" class="form-label">Título de la tarea</label>
        <input
          type="text"
          id="tituloTarea"
          class="form-control"
          :value="tituloTarea"
          readonly
        />
      </div>
      <div class="mb-3">
        <label for="descripcionTarea" class="form-label">Descripción</label>
        <textarea
          id="descripcionTarea"
          rows="5"
          class="form-control"
          v-model="descripcionTarea"
          placeholder="Ingrese descripción"
          required
        ></textarea>
      </div>
      <div class="mb-3">
        <label for="descripcionCate" class="form-label">Descripción categoría</label>
        <textarea
          id="descripcionCate"
          rows="5"
          class="form-control"
          v-model="descripcionCate"
          placeholder="Ingrese Categoría"
          required
        ></textarea>
      </div>
      <button type="submit" class="btn btn-purple">Guardar Tarea</button>
      <button @click.prevent="cancelar" class="btn btn-link">Cancelar</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "CrearTarea",
  data() {
    return {
      curso: null,
      tituloTarea: "",
      descripcionTarea: "",
      descripcionCate: "",
      cursoId: null,
    };
  },
  mounted() {
    this.cursoId = this.$route.query.cursoId;
    if (!this.cursoId) {
      alert("Falta el ID del curso");
      this.$router.back();
      return;
    }

    const cursoSeleccionado = JSON.parse(localStorage.getItem("cursoSeleccionado"));
    if (!cursoSeleccionado || cursoSeleccionado.id !== this.cursoId) {
      alert("Curso no encontrado");
      this.$router.back();
      return;
    }

    this.curso = cursoSeleccionado;

    const numeroTarea = (this.curso.tareas?.length || 0) + 1;
    this.tituloTarea = `Actividad #${numeroTarea}`;
  },
  methods: {
    guardarTarea() {
      if (!this.descripcionTarea.trim()) {
        alert("Debe ingresar una descripción para la tarea.");
        return;
      }
      if (!this.descripcionCate.trim()) {
        alert("Debe ingresar una categoría para la tarea.");
        return;
      }

      const nuevaTarea = {
        titulo: this.tituloTarea,
        descripcion: this.descripcionTarea.trim(),
        categoria: this.descripcionCate.trim(),
        boton: "Subir archivo",
        enlace: `vista_archivo.html?cursoId=${encodeURIComponent(this.cursoId)}`,
      };

      // Agregar la tarea al curso seleccionado
      this.curso.tareas = this.curso.tareas || [];
      this.curso.tareas.push(nuevaTarea);

      // Guardar el curso actualizado en localStorage
      localStorage.setItem("cursoSeleccionado", JSON.stringify(this.curso));

      // Guardar la tarea también en el objeto 'tareas' en localStorage
      let tareasGuardadas = JSON.parse(localStorage.getItem("tareas")) || {};
      if (!Array.isArray(tareasGuardadas[this.cursoId])) {
        tareasGuardadas[this.cursoId] = [];
      }
      tareasGuardadas[this.cursoId].push(nuevaTarea);
      localStorage.setItem("tareas", JSON.stringify(tareasGuardadas));

      alert("Tarea guardada correctamente.");
      this.$router.push({ path: "/CursoGenerico", query: { cursoId: this.cursoId } });
    },
    cancelar() {
      this.$router.back();
    },
  },
};
</script>

<style scoped>
.btn-purple {
  background-color: #7c3aed;
  color: #fff;
  border: none;
}
.btn-purple:hover {
  background-color: #6b21a8;
}
</style>
