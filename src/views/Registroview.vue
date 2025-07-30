<template>
  <div class="page-wrapper">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="nav-content">
        <router-link to="/" class="brand">Educan593</router-link>
        <router-link to="/Sesion" class="btn-outline">Iniciar Sesión</router-link>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="main-content">
      <div class="register-header">
        <h2>Únete a Educan593</h2>
        <p>Completa tu registro y comienza tu transformación digital</p>
      </div>

      <form @submit.prevent="validarFormulario" class="register-form">
        <div class="form-grid">
          <!-- Información Personal -->
          <div class="form-section">
            <h3>📝 Información Personal</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label>Nombre</label>
                <input v-model="form.nombre" type="text" placeholder="Tu nombre" required />
              </div>
              <div class="form-group">
                <label>Apellidos</label>
                <input v-model="form.apellidos" type="text" placeholder="Tus apellidos" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Fecha de nacimiento</label>
                <input v-model="form.fechaNacimiento" type="date" required />
              </div>
              <div class="form-group">
                <label>Ciudad</label>
                <select v-model="form.direccion" required>
                  <option disabled value="">Selecciona tu ciudad</option>
                  <option>Manta</option>
                  <option>Quito</option>
                  <option>Guayaquil</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Rol</label>
              <select v-model="form.rol" required>
                <option disabled value="">¿Eres estudiante o profesor?</option>
                <option>Estudiante</option>
                <option>Profesor</option>
              </select>
            </div>
          </div>

          <!-- Contacto y Acceso -->
          <div class="form-section">
            <h3>📧 Contacto y Acceso</h3>
            
            <div class="form-group">
              <label>Email</label>
              <input v-model="form.email" type="email" placeholder="tu@email.com" required />
            </div>

            <div class="form-group">
              <label>Teléfono</label>
              <input
                v-model="form.telefono"
                type="tel"
                placeholder="0987654321"
                maxlength="10"
                @input="soloNumeros"
                required
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Contraseña</label>
                <input
                  v-model="form.contrasena"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  minlength="8"
                  required
                />
              </div>
              <div class="form-group">
                <label>Confirmar contraseña</label>
                <input
                  v-model="form.confirmarContrasena"
                  type="password"
                  placeholder="Repite tu contraseña"
                  minlength="8"
                  required
                />
              </div>
            </div>

            <div v-if="errorContrasena" class="error-msg">{{ errorContrasena }}</div>

            <!-- Redes Sociales (Opcional) -->
            <div class="social-section">
              <h4>🌐 Redes Sociales (Opcional)</h4>
              <div class="form-row">
                <div class="form-group">
                  <label>Instagram</label>
                  <div class="input-with-icon">
                    <span>@</span>
                    <input v-model="form.instagram" type="text" placeholder="tu_usuario" />
                  </div>
                </div>
                <div class="form-group">
                  <label>Facebook</label>
                  <input v-model="form.facebook" type="text" placeholder="Tu perfil de Facebook" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="form-actions">
          <button type="submit" class="btn-primary">
            ✅ Crear Cuenta
          </button>
          <router-link to="/Sesion" class="btn-secondary">
            ¿Ya tienes cuenta? Inicia sesión
          </router-link>
        </div>
      </form>
    </div>

    <!-- Footer -->
    <footer>
      <div class="footer-content">
        <p><strong>Educan593</strong></p>
        <p>© 2025 Todos los derechos reservados</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "RegistroView",
  data() {
    return {
      form: {
        nombre: "",
        apellidos: "",
        fechaNacimiento: "",
        direccion: "",
        rol: "",
        email: "",
        telefono: "",
        contrasena: "",
        confirmarContrasena: "",
        instagram: "",
        facebook: "",
      },
      errorContrasena: "",
    };
  },
  methods: {
    soloNumeros() {
      this.form.telefono = this.form.telefono.replace(/\D/g, "").slice(0, 10);
    },
    validarFormulario() {
      this.errorContrasena = "";
      
      const telefonoValido = /^\d{10}$/.test(this.form.telefono);
      const contrasenaValida = /^(?=.*[A-Z]).{8,}$/.test(this.form.contrasena);
      const contrasenasCoinciden = this.form.contrasena === this.form.confirmarContrasena;

      if (!telefonoValido) {
        alert("❌ El teléfono debe tener 10 dígitos.");
        return;
      }

      if (!contrasenaValida) {
        this.errorContrasena = "❌ La contraseña debe tener al menos 8 caracteres y una letra mayúscula.";
        return;
      }

      if (!contrasenasCoinciden) {
        this.errorContrasena = "❌ Las contraseñas no coinciden.";
        return;
      }

      if (
        !this.form.nombre ||
        !this.form.apellidos ||
        !this.form.fechaNacimiento ||
        !this.form.direccion ||
        !this.form.email
      ) {
        alert("❌ Todos los campos obligatorios deben estar completos.");
        return;
      }

      // Validación de edad mínima de 8 años
      const fechaNacimiento = new Date(this.form.fechaNacimiento);
      const fechaActual = new Date();
      const edadMinima = 8;
      
      // Calcular la fecha límite (hace 8 años)
      const fechaLimite = new Date();
      fechaLimite.setFullYear(fechaActual.getFullYear() - edadMinima);
      
      if (fechaNacimiento > fechaLimite) {
        alert("❌ Debes tener al menos 8 años para registrarte.");
        return;
      }
      
      // Validar que la fecha no sea futura
      if (fechaNacimiento > fechaActual) {
        alert("❌ La fecha de nacimiento no puede ser futura.");
        return;
      }

      if (!this.form.rol) {
        alert("❌ Debes seleccionar una ocupación.");
        return;
      }

      // Guardar en la lista global de usuarios
      let usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];

      const existeUsuario = usuariosGuardados.some(u => u.email.toLowerCase() === this.form.email.toLowerCase());
      if (existeUsuario) {
        alert("❌ El email ya está registrado.");
        return;
      }

      const telefonoExistente = usuariosGuardados.some(
        u => u.telefono === this.form.telefono
      );
      if (telefonoExistente) {
        alert("❌ El teléfono ya está registrado.");
        return;
      }

      usuariosGuardados.push({ ...this.form });
      localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));

      const clavePerfil = `datos_${this.form.email.toLowerCase()}`;
      const datosPerfil = {
        nombre: this.form.nombre,
        apellidos: this.form.apellidos,
        nacimiento: this.form.fechaNacimiento,
        direccion: this.form.direccion,
        correo: this.form.email,
        telefono: this.form.telefono,
        usuario_red1: this.form.instagram,
        usuario_red2: this.form.facebook
      };

      localStorage.setItem(clavePerfil, JSON.stringify(datosPerfil));

      alert("✅ Cuenta creada exitosamente");
      this.$router.push("/Sesion");
    },
  },
};
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

/* Navbar */
.navbar {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 1rem 0;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  text-decoration: none;
}

.btn-outline {
  color: white;
  border: 2px solid rgba(255,255,255,0.3);
  padding: 0.5rem 1rem;
  border-radius: 25px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  background: rgba(255,255,255,0.1);
  color: white;
}

/* Main Content */
.main-content {
  flex: 1;
  max-width: 2000px;
  margin: 0 auto;
  padding: 2rem;
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.register-header h2 {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.register-header p {
  color: #718096;
  font-size: 1.1rem;
}

/* Form Styles */
.register-form {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-section h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-with-icon {
  display: flex;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.input-with-icon:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-with-icon span {
  background: #f7fafc;
  padding: 0.75rem;
  color: #4a5568;
  font-weight: 600;
}

.input-with-icon input {
  border: none;
  flex: 1;
  padding: 0.75rem;
}

.input-with-icon input:focus {
  outline: none;
  box-shadow: none;
}

.social-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.social-section h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 1rem;
}

.error-msg {
  background: #fed7d7;
  color: #c53030;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

/* Form Actions */
.form-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  color: #667eea;
  text-decoration: none;
  font-size: 0.95rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #f7fafc;
  color: #5a67d8;
}

/* Footer */
footer {
  background: #2d3748;
  color: white;
  padding: 1.5rem;
  text-align: center;
}

.footer-content p {
  margin: 0.25rem 0;
}

/* Responsive */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .register-form {
    padding: 2rem;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .nav-content {
    padding: 0 1rem;
  }
}
</style>