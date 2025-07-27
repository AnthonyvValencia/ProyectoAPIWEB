<template>
  <div class="page-wrapper">
    <main>
      <header class="hero">
        <h1>Bienvenido a Educan593</h1>
        <p>Aprende, crece y transforma tu futuro con cursos en tecnología y software</p>
        <br />
        Inicia Sesión para comenzar
        <br />
        <router-link to="/Sesion" class="btn btn-main">Iniciar Sesión</router-link>
      </header>

      <section class="features container">
        <h2>¿Por qué elegirnos?</h2>
        <div class="row justify-content-center">
          <div class="col-md-4 feature-box">
            <h5>Contenido Actualizado</h5>
            <p>
              Los cursos están diseñados por expertos del área y se actualizan constantemente para el mercado laboral.
            </p>
          </div>
          <div class="col-md-4 feature-box">
            <h5>Modalidad Flexible</h5>
            <p>Aprende a tu ritmo desde cualquier lugar, con recursos accesibles 24/7.</p>
          </div>
          <div class="col-md-4 feature-box">
            <h5>Certificación</h5>
            <p>Al finalizar cada curso, obtendrás un certificado de participación o aprobación.</p>
          </div>
        </div>
      </section>
    </main>

    <footer>
      <div class="card-footer">
        <p class="mb-1 fw-bold fs-10">Educan593</p>
        <p class="mb-0">© 2025 Todos los derechos reservados</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "InicioView"
}
</script>

<style scoped>
/* Estructura general */
.page-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Cuerpo principal */
main {
  flex: 1;
}

/* Cabecera principal */
.hero {
  background: linear-gradient(135deg, #6f2cff, #9b51e0);
  color: white;
  padding: 5rem 1rem;
  text-align: center;
}

.hero h1 {
  font-size: 3rem;
  font-weight: bold;
}

.hero p {
  font-size: 1.2rem;
  margin-top: 1rem;
}

.btn-main {
  background-color: white;
  color: #6f2cff;
  font-weight: 600;
  border-radius: 30px;
  padding: 0.6rem 1.5rem;
  margin-top: 1.5rem;
}

/* Sección de características */
.features {
  padding: 4rem 1rem;
  text-align: center;
}

.features h2 {
  font-weight: bold;
  margin-bottom: 2rem;
}

.feature-box {
  padding: 1.5rem;
  border-radius: 10px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin: 1rem;
}

/* Footer */
footer {
  background-color: #4c4f4f;
  color: white;
  padding: 0.6rem 0.2rem;
  text-align: center;
  margin-top: auto;
}

.card-footer {
  background-color: transparent;
  border-top: none;
}
</style>
