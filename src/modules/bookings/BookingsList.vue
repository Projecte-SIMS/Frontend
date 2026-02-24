<template>
  <div>
    <h1>Mis Reservas</h1>
    <div v-if="loading">Cargando...</div>
    <div v-if="error">Error: {{ error }}</div>
    <ul v-if="bookings.length">
      <li v-for="booking in bookings" :key="booking.id">
        Vehículo: {{ booking.vehicle?.model }} ({{ booking.vehicle?.license_plate }})<br>
        Fecha: {{ booking.trip ? booking.trip.engine_started_at : 'Sin viaje'}}<br>
        Monto: {{ booking.trip ? booking.trip.total_amount : 'N/A'}}
      </li>
    </ul>
    <div v-else-if="!loading">No tienes reservas.</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import useBookingsUser from './composables/useBookingsUser'

const { bookings, loading, error, getBookings } = useBookingsUser()

onMounted(() => {
  getBookings()
})
</script>
