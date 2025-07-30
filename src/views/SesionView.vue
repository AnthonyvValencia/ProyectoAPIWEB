<template>
  <div class="page-wrapper">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="nav-content">
        <router-link to="/Inicio" class="brand">Educan593</router-link>
        <router-link to="/registro" class="btn-outline">Registrarse</router-link>
      </div>
    </nav>

    <!-- Login Container -->
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h2>Bienvenido de vuelta</h2>
          <p>Inicia sesión para continuar tu aprendizaje</p>
        </div>

        <form @submit.prevent="iniciarSesion">
          <div class="form-group">
            <label for="username">Usuario</label>
            <input
              type="text"
              v-model="username"
              id="username"
              placeholder="ej. estudiante@educan593.com"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input
              type="password"
              v-model="password"
              id="password"
              placeholder="Tu contraseña"
              required
            />
          </div>

          <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>

          <button type="submit" class="btn-primary">
            Iniciar Sesión
            <span class="arrow">→</span>
          </button>

          <div class="login-footer">
            <router-link to="/registro">¿Aún no tienes cuenta? Regístrate</router-link>
          </div>
        </form>
      </div>
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
  name: "SesionView",
  data() {
    return {
      username: "",
      password: "",
      errorMsg: "",
    };
  },
  mounted() {
    // Cargar usuarios o crear admin solo si no existe admin
    let usuariosRegistrados = JSON.parse(localStorage.getItem("usuarios")) || [];
    const existeAdmin = usuariosRegistrados.some(
      (u) => u.email.toLowerCase() === "administrador@hotmail.com"
    );
    if (!existeAdmin) {
      const usuarioPredeterminado = {
        email: "Administrador@hotmail.com",
        contrasena: "Administrador",
        nombre: "Anthony",
        rol: "Administrador",
      };
      usuariosRegistrados.push(usuarioPredeterminado);
      localStorage.setItem("usuarios", JSON.stringify(usuariosRegistrados));
      console.log("Usuario administrador creado:", usuarioPredeterminado);
    }
    console.log("Usuarios cargados:", usuariosRegistrados);
  },
  methods: {
    iniciarSesion() {
      this.errorMsg = "";

      const user = this.username.trim().toLowerCase();
      const pass = this.password.trim();

      const usuariosRegistrados = JSON.parse(localStorage.getItem("usuarios")) || [];
      console.log("Intentando login con:", user, pass);

      const usuarioEncontrado = usuariosRegistrados.find(
        (u) => u.email.toLowerCase() === user && u.contrasena === pass
      );

      if (usuarioEncontrado) {
        const rolLower = usuarioEncontrado.rol.toLowerCase();

        localStorage.setItem("rol", rolLower);
        localStorage.setItem("usuarioActual", JSON.stringify(usuarioEncontrado));

        if (rolLower === "estudiante") {
          this.$router.push("/cursos");
        } else if (rolLower === "profesor") {
          this.$router.push("/cursos");
        } else if (rolLower === "administrador") {
          this.$router.push("/Administrador");
        } else {
          this.$router.push("/");
        }
      } else {
        this.errorMsg = "Correo o contraseña incorrectos.";
      }
    },
  },
};
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #c3ccf2 0%, #764ba2 100%);
}

/* Navbar */
.navbar {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
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
  font-size: 2rem;
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

/* Login Container */
.login-container {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-card {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}
.login-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
}
/* Form */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #263269;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.error-msg {
  background: #fed7d7;
  color: #c53030;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.btn-primary {
  width: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 0.875rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}
.arrow {
  transition: transform 0.3s ease;
}

.btn-primary:hover .arrow {
  transform: translateX(3px);
}

/* Footer */
footer {
  background: rgba(0,0,0,0.2);
  color: white;
  padding: 1rem;
  text-align: center;
}

.footer-content p {
  margin: 0.25rem 0;
}

/* Responsive */
@media (max-width: 768px) {
  .login-card {
    padding: 2rem;
    margin: 1rem;
  }
  
  .nav-content {
    padding: 0 1rem;
  }
}
</style>