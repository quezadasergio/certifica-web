import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    {
      path: '/firma-electronica',
      name: 'signature-request',
      component: () => import('@/views/SignatureRequestView.vue'),
    },
    {
      path: '/renovacion',
      name: 'renewal-request',
      component: () => import('@/views/RenewalRequestView.vue'),
    },
    {
      path: '/sellos-digitales',
      name: 'seal-request',
      component: () => import('@/views/SealRequestView.vue'),
    },
    {
      path: '/certificado',
      name: 'certificate-viewer',
      component: () => import('@/views/CertificateViewerView.vue'),
    },
  ],
})

export default router
