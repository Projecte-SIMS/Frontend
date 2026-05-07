import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { useTheme } from '@/modules/common/composables/useTheme'

const { initTheme } = useTheme()
initTheme()

createApp(App)
	.use(router)
	.use(i18n)
	.use(Vue3Toastify)
	.mount('#app')
