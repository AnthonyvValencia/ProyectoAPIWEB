<template>
  <div class="perfil-container">
    <!-- Navbar mejorada -->
    <nav class="navbar">
      <div class="nav-content">
        <a class="brand" href="/Cursos">📚 Educan593</a>
        <div class="nav-links">
          <a href="/Cursos" class="nav-link">Cursos</a>
          <a href="/Certificados" class="nav-link">Certificados</a>
          <button @click="cerrarSesion" class="btn-logout">Cerrar sesión</button>
        </div>
      </div>
    </nav>

    <!-- Contenido principal -->
    <div class="main-content">
      <div class="profile-card">
        <!-- Header del perfil -->
        <div class="profile-header">
          <div class="avatar">
            {{ datos.nombre.charAt(0) }}{{ datos.apellidos.charAt(0) }}
          </div>
          <div class="header-text">
            <h1>Editar Perfil</h1>
            <p>Actualiza tu información personal</p>
          </div>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="guardarCambios" class="profile-form">
          <div class="form-grid">
            <!-- Información personal -->
            <div class="form-section">
              <h3>👤 Información Personal</h3>
              
              <div class="input-group">
                <label for="nombre">Nombre</label>
                <input 
                  type="text" 
                  id="nombre" 
                  v-model="datos.nombre" 
                  placeholder="Tu nombre"
                  required
                >
              </div>

              <div class="input-group">
                <label for="apellidos">Apellidos</label>
                <input 
                  type="text" 
                  id="apellidos" 
                  v-model="datos.apellidos" 
                  placeholder="Tus apellidos"
                  required
                >
              </div>

              <div class="input-group">
                <label for="nacimiento">Fecha de nacimiento</label>
                <input 
                  type="date" 
                  id="nacimiento" 
                  v-model="datos.nacimiento" 
                  required
                >
              </div>

              <div class="input-group">
                <label for="direccion">Ciudad</label>
                <select id="direccion" v-model="datos.direccion" required>
                  <option value="">Selecciona tu ciudad</option>
                  <option value="Manta">🏖️ Manta</option>
                  <option value="Quito">🏔️ Quito</option>
                  <option value="Guayaquil">🌊 Guayaquil</option>
                </select>
              </div>
            </div>

            <!-- Contacto y redes -->
            <div class="form-section">
              <h3>📞 Contacto y Redes</h3>
              
              <div class="input-group">
                <label for="correo">Email</label>
                <input 
                  type="email" 
                  id="correo" 
                  v-model="datos.correo" 
                  disabled
                  class="disabled-input"
                >
                <small>El email no se puede modificar</small>
              </div>

              <div class="input-group">
                <label for="telefono">Teléfono</label>
                <input 
                  type="tel" 
                  id="telefono" 
                  v-model="datos.telefono" 
                  placeholder="0987654321"
                  pattern="^\d{10}$"
                  maxlength="10"
                  required
                >
              </div>

              <div class="input-group">
                <label for="usuario_red1">Instagram</label>
                <input 
                  type="text" 
                  id="usuario_red1" 
                  v-model="datos.usuario_red1" 
                  placeholder="@tu_usuario"
                  pattern="^@[\w\.]+$"
                  required
                >
              </div>

              <div class="input-group">
                <label for="usuario_red2">Facebook</label>
                <input 
                  type="text" 
                  id="usuario_red2" 
                  v-model="datos.usuario_red2" 
                  placeholder="@tu_perfil"
                  pattern="^@[\w\.]+$"
                >
              </div>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="form-actions">
            <button type="submit" class="btn-primary">
              💾 Guardar Cambios
            </button>
            <router-link to="/Cursos" class="btn-secondary">
              ← Volver
            </router-link>
          </div>
        </form>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <p><strong>Educan593</strong> © 2025 - Todos los derechos reservados</p>
    </footer>
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
      keyStorage: "",
    };
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem("usuarioActual"));
    const correo = user?.correo || user?.email;

    if (!correo) {
      alert("No se encontró el usuario actual");
      return;
    }

    const key = `datos_${correo.toLowerCase()}`;
    const datosGuardados = JSON.parse(localStorage.getItem(key)) || {};

    this.keyStorage = key;
    this.datos.correo = correo;

    Object.keys(this.datos).forEach((campo) => {
      if (datosGuardados[campo]) {
        this.datos[campo] = datosGuardados[campo];
      }
    });
  },
  methods: {
    guardarCambios() {
      localStorage.setItem(this.keyStorage, JSON.stringify(this.datos));
      alert("✅ Cambios guardados correctamente");
    },
    cerrarSesion() {
      localStorage.removeItem("rol");
      localStorage.removeItem("usuario");
      this.$router.push("/Inicio");
    }
  },
};
</script>

<style scoped>
* { box-sizing: border-box; }

.perfil-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #838dbb 0%, #764ba2 100%);
  font-family: 'Inter', system-ui, sans-serif;
}

/* Navbar */
.navbar {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
}

.brand {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  text-decoration: none;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s;
}

.nav-link:hover { opacity: 0.8; }

.btn-logout {
  background: rgba(255, 82, 82, 0.2);
  color: white;
  border: 1px solid rgba(255, 82, 82, 0.5);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-logout:hover {
  background: rgba(255, 82, 82, 0.3);
  transform: translateY(-1px);
}

/* Contenido principal */
.main-content {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 2rem;
}

.profile-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.profile-header {
  background: linear-gradient(135deg, #cacad8, #8b5cf6);
  color: white;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
}

.header-text h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.header-text p {
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
}

/* Formulario */
.profile-form {
  padding: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .form-grid { grid-template-columns: 1fr; }
}

.form-section h3 {
  color: #374151;
  font-size: 1.1rem;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f3f4f6;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s;
}

.input-group input:focus,
.input-group select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.disabled-input {
  background-color: #f9fafb !important;
  color: #6b7280 !important;
}

.input-group small {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

/* Botones de acción */
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 2rem;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  font-size: 1rem;
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-secondary:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

/* Footer */
.footer {
  background: rgba(0, 0, 0, 0.1);
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: 2rem;
}
</style>