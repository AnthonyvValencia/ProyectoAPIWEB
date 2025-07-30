<template>
  <div class="admin-wrapper">
    <!-- Header -->
    <div class="admin-header">
      <div class="header-content">
        <div>
          <h1>🔧 Panel de Administrador</h1>
          <p>Gestiona tu plataforma educativa</p>
        </div>
        <button @click="cerrarSesion" class="btn-logout">
          🚪 Cerrar sesión
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div>
          <h3>{{ usuarios.length }}</h3>
          <p>Usuarios</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📚</div>
        <div>
          <h3>{{ cursos.length }}</h3>
          <p>Cursos</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📝</div>
        <div>
          <h3>{{ todasTareas.length }}</h3>
          <p>Tareas</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div>
          <h3>{{ todasEvaluaciones.length }}</h3>
          <p>Evaluaciones</p>
        </div>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="content-grid">
      <!-- Usuarios -->
      <div class="admin-card">
        <div class="card-header">
          <h3>👥 Usuarios</h3>
          <span class="badge">{{ usuarios.length }}</span>
        </div>
        <div class="card-content">
          <div v-if="usuarios.length === 0" class="empty">
            No hay usuarios registrados
          </div>
          <div v-else class="item-list">
            <div v-for="(u, index) in usuarios" :key="index" class="item">
              <div class="item-info">
                <strong>{{ u.nombre || u.email }}</strong>
                <span class="role" :class="u.rol">{{ u.rol }}</span>
              </div>
              <button @click="eliminarUsuario(index)" class="btn-delete">🗑️</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Cursos -->
      <div class="admin-card">
        <div class="card-header">
          <h3>📚 Cursos</h3>
          <span class="badge">{{ cursos.length }}</span>
        </div>
        <div class="card-content">
          <div v-if="cursos.length === 0" class="empty">
            No hay cursos registrados
          </div>
          <div v-else class="item-list">
            <div v-for="(c, index) in cursos" :key="index" class="item">
              <div class="item-info">
                <strong>{{ c.titulo || 'Curso sin título' }}</strong>
                <span class="meta">{{ c.descripcion || 'Sin descripción' }}</span>
              </div>
              <button @click="eliminarCurso(index)" class="btn-delete">🗑️</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tareas -->
      <div class="admin-card">
        <div class="card-header">
          <h3>📝 Tareas</h3>
          <span class="badge">{{ todasTareas.length }}</span>
        </div>
        <div class="card-content">
          <div v-if="todasTareas.length === 0" class="empty">
            No hay tareas registradas
          </div>
          <div v-else class="item-list">
            <div v-for="(tarea, index) in todasTareas" :key="index" class="item">
              <div class="item-info">
                <strong>{{ tarea.titulo }}</strong>
                <span class="meta">
                  {{ tarea.descripcion }}
                  <br>
                  <small class="curso-info">📚 Curso: {{ obtenerNombreCurso(tarea.cursoId) }}</small>
                </span>
              </div>
              <button @click="eliminarTarea(tarea.cursoId, tarea.index)" class="btn-delete">🗑️</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Evaluaciones -->
      <div class="admin-card">
        <div class="card-header">
          <h3>✅ Evaluaciones</h3>
          <span class="badge">{{ todasEvaluaciones.length }}</span>
        </div>
        <div class="card-content">
          <div v-if="todasEvaluaciones.length === 0" class="empty">
            No hay evaluaciones registradas
          </div>
          <div v-else class="item-list">
            <div v-for="(evaluacion, index) in todasEvaluaciones" :key="index" class="item">
              <div class="item-info">
                <strong>{{ evaluacion.titulo }}</strong>
                <span class="meta">
                  {{ evaluacion.preguntas?.length || 0 }} pregunta/s
                  <br>
                  <small class="curso-info">📚 Curso: {{ obtenerNombreCurso(evaluacion.cursoId) }}</small>
                </span>
              </div>
              <button @click="eliminarEvaluacion(evaluacion.cursoId, evaluacion.index)" class="btn-delete">🗑️</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdministradorView",
  data() {
    return {
      usuarios: [],
      cursos: [],
    };
  },
  computed: {
    todasTareas() {
      const tareas = [];
      
      // Recorrer todas las claves de localStorage para encontrar tareas por curso
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        // Buscar claves que contengan "tareas_curso_"
        if (key && key.startsWith('tareas_curso_')) {
          const cursoId = key.replace('tareas_curso_', '');
          
          try {
            const tareasDelCursoRaw = localStorage.getItem(key);
            console.log(`📝 Datos para ${key}:`, tareasDelCursoRaw);
            
            const tareasDelCurso = JSON.parse(tareasDelCursoRaw || '[]');
            
            // Validar que sea un array
            if (Array.isArray(tareasDelCurso)) {
              // Agregar cada tarea con información del curso
              tareasDelCurso.forEach((tarea, idx) => {
                tareas.push({
                  ...tarea,
                  cursoId: cursoId,
                  index: idx
                });
              });
            } else {
              console.warn(`⚠️ Los datos para ${key} no son un array:`, tareasDelCurso);
            }
          } catch (error) {
            console.error(`❌ Error parseando datos para ${key}:`, error);
          }
        }
      }
      
      return tareas;
    },
    
    todasEvaluaciones() {
      const evaluaciones = [];
      
      // Recorrer todas las claves de localStorage para encontrar evaluaciones por curso
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        // Buscar claves que contengan "evaluaciones_curso_"
        if (key && key.startsWith('evaluaciones_curso_')) {
          const cursoId = key.replace('evaluaciones_curso_', '');
          
          try {
            const evaluacionesDelCursoRaw = localStorage.getItem(key);
            console.log(`🎯 Datos para ${key}:`, evaluacionesDelCursoRaw);
            
            const evaluacionesDelCurso = JSON.parse(evaluacionesDelCursoRaw || '[]');
            
            // Validar que sea un array
            if (Array.isArray(evaluacionesDelCurso)) {
              // Agregar cada evaluación con información del curso
              evaluacionesDelCurso.forEach((evaluacion, idx) => {
                evaluaciones.push({
                  ...evaluacion,
                  cursoId: cursoId,
                  index: idx
                });
              });
            } else {
              console.warn(`⚠️ Los datos para ${key} no son un array:`, evaluacionesDelCurso);
            }
          } catch (error) {
            console.error(`❌ Error parseando datos para ${key}:`, error);
          }
        }
      }
      
      return evaluaciones;
    }
  },
  
  mounted() {
    this.cargarDatos();
  },
  
  methods: {
    cargarDatos() {
      this.usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      this.cursos = JSON.parse(localStorage.getItem("cursosAgregados")) || [];
      
      // Debug: Mostrar las claves de localStorage
      console.log("📦 Claves en localStorage:");
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        console.log(key);
      }
    },
    
    obtenerNombreCurso(cursoId) {
      const curso = this.cursos.find(c => c.id == cursoId);
      return curso ? curso.titulo : `Curso ID: ${cursoId}`;
    },
    
    eliminarUsuario(index) {
      if (confirm("¿Eliminar este usuario?")) {
        this.usuarios.splice(index, 1);
        localStorage.setItem("usuarios", JSON.stringify(this.usuarios));
      }
    },
    
    eliminarCurso(index) {
      if (confirm("¿Eliminar este curso? Esto también eliminará todas sus tareas y evaluaciones.")) {
        const cursoEliminado = this.cursos[index];
        
        // Eliminar el curso
        this.cursos.splice(index, 1);
        localStorage.setItem("cursosAgregados", JSON.stringify(this.cursos));
        
        // Eliminar tareas y evaluaciones relacionadas
        if (cursoEliminado && cursoEliminado.id) {
          localStorage.removeItem(`tareas_curso_${cursoEliminado.id}`);
          localStorage.removeItem(`evaluaciones_curso_${cursoEliminado.id}`);
        }
        
        
        // Recargar datos
        this.cargarDatos();
      }
    },
    
    eliminarTarea(cursoId, tareaIndex) {
      if (confirm("¿Eliminar esta tarea?")) {
        const tareasKey = `tareas_curso_${cursoId}`;
        const tareas = JSON.parse(localStorage.getItem(tareasKey) || '[]');
        
        // Eliminar la tarea específica
        tareas.splice(tareaIndex, 1);
        localStorage.setItem(tareasKey, JSON.stringify(tareas));
        
        // Forzar actualización de la vista
        this.$forceUpdate();
      }
    },
    
    eliminarEvaluacion(cursoId, evaluacionIndex) {
      if (confirm("¿Eliminar esta evaluación?")) {
        const evaluacionesKey = `evaluaciones_curso_${cursoId}`;
        const evaluaciones = JSON.parse(localStorage.getItem(evaluacionesKey) || '[]');
        
        // Eliminar la evaluación específica
        evaluaciones.splice(evaluacionIndex, 1);
        localStorage.setItem(evaluacionesKey, JSON.stringify(evaluaciones));
        
        // Forzar actualización de la vista
        this.$forceUpdate();
      }
    },
    
    cerrarSesion() {
      localStorage.removeItem("usuarioActual");
      localStorage.removeItem("rol");
      alert("Sesión cerrada.");
      this.$router.push("/Sesion");
    },
  },
};
</script>

<style scoped>
.admin-wrapper { 
  min-height: 100vh; 
  background: rgb(177, 177, 177);
  padding: 20px; 
  font-family: 'Segoe UI', sans-serif; 
}

.admin-header { 
  background: rgba(255,255,255,0.1); 
  backdrop-filter: blur(10px); 
  border-radius: 15px; 
  padding: 20px; 
  margin-bottom: 20px; 
  border: 1px solid rgba(255,255,255,0.2); 
}

.header-content { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  color: rgb(5, 4, 4); 
}

.header-content h1 { 
  margin: 0; 
  font-size: 1.8rem; 
}

.header-content p { 
  margin: 5px 0 0 0; 
  opacity: 0.8; 
}

.btn-logout { 
  background: rgba(255,107,107,0.2); 
  color: #ff6b6b; 
  border: 1px solid rgba(255,107,107,0.3); 
  padding: 10px 20px; 
  border-radius: 25px; 
  cursor: pointer; 
  transition: all 0.3s; 
}

.btn-logout:hover { 
  background: #ff6b6b; 
  color: white; 
}

.stats-grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
  gap: 15px; 
  margin-bottom: 25px; 
}

.stat-card { 
  background: rgba(255,255,255,0.15); 
  backdrop-filter: blur(10px); 
  border-radius: 15px; 
  padding: 20px; 
  display: flex; 
  align-items: center; 
  gap: 15px; 
  color: white; 
  border: 1px solid rgba(255,255,255,0.2); 
  transition: transform 0.3s; 
}

.stat-card:hover { 
  transform: translateY(-5px); 
}

.stat-icon { 
  font-size: 2rem; 
  width: 50px; 
  height: 50px; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  background: rgba(255,255,255,0.2); 
  border-radius: 12px; 
}

.stat-card h3 { 
  margin: 0; 
  font-size: 1.5rem; 
}

.stat-card p { 
  margin: 0; 
  opacity: 0.8; 
}

.content-grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); 
  gap: 20px; 
}

.admin-card { 
  background: rgba(255,255,255,0.95); 
  border-radius: 15px; 
  overflow: hidden; 
  box-shadow: 0 8px 32px rgba(0,0,0,0.1); 
}

.card-header { 
  background: linear-gradient(45deg, #7c3aed, #a855f7); 
  color: white; 
  padding: 15px 20px; 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
}

.card-header h3 { 
  margin: 0; 
  font-size: 1.1rem; 
}

.badge { 
  background: rgba(255,255,255,0.3); 
  padding: 4px 12px; 
  border-radius: 15px; 
  font-size: 0.9rem; 
}

.card-content { 
  max-height: 300px; 
  overflow-y: auto; 
}

.empty { 
  text-align: center; 
  padding: 40px 20px; 
  color: #6b7280; 
}

.item-list { 
  padding: 0; 
}

.item { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  padding: 15px 20px; 
  border-bottom: 1px solid #f0f0f0; 
  transition: background 0.2s; 
}

.item:hover { 
  background: #f9fafb; 
}

.item:last-child { 
  border-bottom: none; 
}

.item-info { 
  flex: 1; 
}

.item-info strong { 
  display: block; 
  margin-bottom: 5px; 
}

.meta { 
  color: #6b7280; 
  font-size: 0.9rem; 
}

.curso-info {
  color: #7c3aed;
  font-weight: 500;
}

.role { 
  padding: 2px 8px; 
  border-radius: 10px; 
  font-size: 0.8rem; 
  font-weight: 600; 
}

.role.profesor { 
  background: #10b981; 
  color: white; 
}

.role.estudiante { 
  background: #3b82f6; 
  color: white; 
}

.btn-delete { 
  background: #ef4444; 
  color: white; 
  border: none; 
  padding: 8px 12px; 
  border-radius: 8px; 
  cursor: pointer; 
  transition: all 0.3s; 
}

.btn-delete:hover { 
  background: #dc2626; 
  transform: scale(1.1); 
}

@media (max-width: 768px) {
  .header-content { 
    flex-direction: column; 
    gap: 15px; 
    text-align: center; 
  }
  
  .content-grid { 
    grid-template-columns: 1fr; 
  }
  
  .stats-grid { 
    grid-template-columns: repeat(2, 1fr); 
  }
}
</style>