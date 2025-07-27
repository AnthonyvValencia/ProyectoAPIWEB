<template>
  <div class="container mt-5">
    <h1>Editar Información</h1>
    <p class="text-muted">Puedes actualizar tu información de perfil.</p>

    <form @submit.prevent="guardarCambios" class="row g-4">
      <!-- Columna izquierda -->
      <div class="col-md-6">
        <label for="nombre">Nombre</label>
        <input type="text" id="nombre" class="form-control" v-model="datos.nombre" required>

        <label for="apellidos">Apellidos</label>
        <input type="text" id="apellidos" class="form-control" v-model="datos.apellidos" required>

        <label for="nacimiento">Fecha de nacimiento</label>
        <input type="date" id="nacimiento" class="form-control" v-model="datos.nacimiento" required>

        <label for="direccion">Dirección</label>
        <select id="direccion" class="form-select" v-model="datos.direccion" required>
          <option value="">Seleccione una ciudad</option>
          <option value="Manta">Manta</option>
          <option value="Quito">Quito</option>
          <option value="Guayaquil">Guayaquil</option>
        </select>
      </div>

      <!-- Columna derecha -->
      <div class="col-md-6">
        <label for="correo">Correo electrónico</label>
        <input type="email" id="correo" class="form-control" v-model="datos.correo" required>

        <label for="telefono">Teléfono</label>
        <input type="tel" id="telefono" class="form-control" v-model="datos.telefono" required pattern="^\d{10}$" maxlength="10">

        <label>Instagram</label>
        <input type="text" id="usuario_red1" class="form-control" v-model="datos.usuario_red1" placeholder="@usuario" pattern="^@[\w\.]+$" required>

        <label>Facebook</label>
        <input type="text" id="usuario_red2" class="form-control" v-model="datos.usuario_red2" placeholder="@perfil" pattern="^@[\w\.]+$">
      </div>

      <div class="col-12 text-center">
        <button type="submit" class="submit-btn me-2">Guardar Cambios</button>
        <router-link to="/Cursos" class="volver-btn">Volver</router-link>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "PerfilView",
  data() {
    return {
      datos: {
        nombre: "",
        apellidos: "",
        nacimiento: "",
        direccion: "",
        correo: "",
        telefono: "",
        usuario_red1: "",
        usuario_red2: "",
      },
    };
  },
  mounted() {
    const rol = localStorage.getItem("rol");
    const key = rol === "profesor" ? "usuarioDatosProfesor" : "usuarioDatosEstudiante";
    const datosGuardados = JSON.parse(localStorage.getItem(key)) || {};

    Object.keys(this.datos).forEach((campo) => {
      if (datosGuardados[campo]) {
        this.datos[campo] = datosGuardados[campo];
      }
    });

    this.keyStorage = key;
  },
  methods: {
    guardarCambios() {
      localStorage.setItem(this.keyStorage, JSON.stringify(this.datos));
      alert("Cambios guardados correctamente.");
    },
  },
};
</script>

<style scoped>
body {
  background-color: #f8f9fa;
  font-family: 'Segoe UI', sans-serif;
}
.container {
  max-width: 900px;
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
label {
  font-weight: 600;
}
.submit-btn {
  margin-top: 20px;
  padding: 12px 30px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
}
.submit-btn:hover {
  background-color: #0056b3;
}
.volver-btn {
  margin-top: 20px;
  padding: 12px 30px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  text-decoration: none;
}
.volver-btn:hover {
  background-color: #5a6268;
  color: white;
}
</style>
