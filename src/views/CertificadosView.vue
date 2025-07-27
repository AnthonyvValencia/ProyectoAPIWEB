<template>
  <div class="cert-container">
    <h2 class="mb-4 text-center">Mis Certificados</h2>

    <div v-for="(cert, index) in certificados" :key="index" class="certificate">
      <h4>{{ cert.titulo }}</h4>
      <p><strong>Nombre:</strong> {{ cert.nombre }}</p>
      <p><strong>Fecha de emisión:</strong> {{ cert.fecha }}</p>
      <a :href="cert.archivo" download>
        <button class="btn btn-purple">Descargar Certificado</button>
      </a>
    </div>

    <div class="text-center mt-4">
      <router-link to="/Cursos" class="btn btn-outline-secondary">← Volver a Mis Cursos</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "CertificadosView",
  data() {
    return {
      certificados: [
        {
          titulo: "Fundamentos de Redes de Computadoras",
          nombre: "Juan Pérez",
          fecha: "15 de mayo de 2025",
          archivo: "certificado.pdf",
        },
        {
          titulo: "Desarrollo Web con HTML, CSS y JavaScript",
          nombre: "Juan Pérez",
          fecha: "22 de mayo de 2025",
          archivo: "certificado.pdf",
        },
        {
          titulo: "Ciberseguridad Básica",
          nombre: "Juan Pérez",
          fecha: "28 de mayo de 2025",
          archivo: "certificado.pdf",
        },
      ],
    };
  },
};
</script>

<style scoped>
body {
  background-color: #f9f9f9;
}
.cert-container {
  max-width: 900px;
  margin: 60px auto;
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
}
.certificate {
  border: 2px solid #7c3aed;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #f3e8ff;
}
.certificate h4 {
  color: #6b21a8;
  margin-bottom: 10px;
}
.certificate p {
  font-size: 1rem;
  margin-bottom: 10px;
}
.btn-purple {
  background-color: #7c3aed;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
}
.btn-purple:hover {
  background-color: #6b21a8;
}
</style>
