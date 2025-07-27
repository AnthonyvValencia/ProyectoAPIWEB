<template>
  <div class="login-container">
    <h2 class="text-center mb-4">Educan593 - Iniciar Sesión</h2>
    <form @submit.prevent="iniciarSesion">
      <div class="mb-3">
        <label for="username" class="form-label">Usuario</label>
        <input type="text" v-model="username" class="form-control" id="username" placeholder="ej. estudiante" required />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Contraseña</label>
        <input type="password" v-model="password" class="form-control" id="password" placeholder="Contraseña" required />
      </div>
      <div v-if="errorMsg" class="text-danger mb-3">{{ errorMsg }}</div>
      <button type="submit" class="btn btn-purple w-100">Iniciar Sesión</button>
      <br><br>
      <router-link to="/registro">¿Aún no tienes cuenta?</router-link>
    </form>
  </div>
</template>

<script>
export default {
  name: 'SesionView',
  data() {
    return {
      username: '',
      password: '',
      errorMsg: ''
    };
  },
  methods: {
    iniciarSesion() {
      const user = this.username.trim().toLowerCase();
      const pass = this.password.trim();

      this.errorMsg = '';

      if (user === 'estudiante' && pass === 'estudiante') {
        localStorage.setItem('rol', 'estudiante');
        const usuarioDatosEstudiante = {
          nombre: 'Juan',
          apellidos: 'Pérez',
          nacimiento: '2000-01-01',
          direccion: 'Quito',
          correo: 'juan.perez@example.com',
          telefono: '0990123456',
          red1: 'Instagram',
          usuario_red1: '@juanperez',
          red2: 'Facebook',
          usuario_red2: '@juanperezFB'
        };
        localStorage.setItem('usuarioDatosEstudiante', JSON.stringify(usuarioDatosEstudiante));
        this.$router.push('/cursos');

      } else if (user === 'profesor' && pass === 'profesor') {
        localStorage.setItem('rol', 'profesor');
        const usuarioDatosProfesor = {
          nombre_profesor: 'Jenny',
          apellidos_profesor: 'Wilson',
          correo: 'jenny.wilson@example.com',
          telefono: '0999876543'
        };
        localStorage.setItem('usuarioDatosProfesor', JSON.stringify(usuarioDatosProfesor));
        this.$router.push('/cursos');

      } else if (user === 'admin' && pass === 'admin') {
        localStorage.setItem('rol', 'admin');
        const usuarioDatosAdmin = {
          nombre_admin: 'Administrador',
          correo: 'admin@educan593.com',
          telefono: '0990000000'
        };
        localStorage.setItem('usuarioDatosAdmin', JSON.stringify(usuarioDatosAdmin));
        this.$router.push('/administrador');

      } else {
        this.errorMsg = 'Usuario o contraseña incorrectos.';
      }
    }
  }
};
</script>

<style scoped>
body {
  background-color: #f3f4f6;
}
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.btn-purple {
  background-color: #7c3aed;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
}
.btn-purple:hover {
  background-color: #6b21a8;
}
</style>
