// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import SesionView from '@/views/SesionView.vue'
import InicioView from '../views/InicioView.vue'
import CursosView from '@/views/CursosView.vue'
import CursoGenerico from '@/views/CursoGenerico.vue'
import CrearTarea from '@/views/CrearTarea.vue'
import CrearEvaluacion from '@/views/CrearEvaluacion.vue'
import SubirArchivo from '@/views/SubirArchivo.vue'
import RealizarEvaluacion from '@/views/RealizarEvaluacion.vue'
import AdministradosView from '@/views/AdministradosView.vue'
import PerfilView from '@/views/PerfilView.vue'
import CertificadosView from '@/views/CertificadosView.vue'



const routes = [
  {
    path: '/',
    redirect: '/inicio'  // Redirige la raíz a /inicio
  },
  {path: '/inicio',name: 'Inicio',component: InicioView},
  {path: '/Sesion',name: 'Sesion',component: SesionView},
  {path: '/Cursos',name: 'Cursos',component: CursosView},
  {path: '/CursoGenerico',name: 'CursoGenerico',component: CursoGenerico},
  {path: '/CrearTarea',name: 'CrearTarea',component: CrearTarea},
  {path: '/CrearEvaluacion',name: 'CrearEvaluacion',component: CrearEvaluacion},
  {path: '/SubirArchivo',name: 'SubirArchivo',component: SubirArchivo},
  {path: '/RealizarEvaluacion',name: 'RealizarEvaluacion',component: RealizarEvaluacion},
  {path: '/Administrador',name: 'Administrador',component: AdministradosView},
  {path: '/Perfil',name: 'Perfil',component: PerfilView},
  {path: '/Certificados',name: 'Certificados',component: CertificadosView},

  // Puedes agregar otras rutas como:
  // {
  //   path: '/login',
  //   name: 'Login',
  //   component: () => import('../views/Login.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
