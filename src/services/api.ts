import axios from 'axios'

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
    return Promise.reject(error)
  }
)

// Interceptor to handle authentication errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Invalid or expired token, clear cookie
      document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/'
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
