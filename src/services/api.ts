import axios from 'axios'
import showToast from '@/modules/common/composables/useToast'

// VALE PEÑA COMENTARI EN ESPAÑOL QUE ESPERO QEU ALGU LO LLEGIXQUE
// Este archiu configura axios per a utiltizar la api en base a les coockies
// que pasa ? que si volem seguretat hauriem de fer la cockie httpOnly pero
// en aquest cas no podriem accedir al token des del frontend i per tant no
// podríem afegir-lo a les peticions. Així que fem-ho així per ara i ja
// millorarem la seguretat més endavant si mos enrecordem. Tonoto quien lo lea

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor to add token to all requests
apiClient.interceptors.request.use(
  (config) => {
    // Get token from cookies
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1]

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    const msg = error?.message || 'Request error'
    try {
      showToast(msg)
    } catch (e) {
      console.error(e)
    }
    return Promise.reject(error)
  }
)
export default apiClient
