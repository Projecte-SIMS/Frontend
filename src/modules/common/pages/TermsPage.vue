<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 p-8 sm:p-12">
      <div class="mb-10 text-center">
        <div class="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary-50 dark:bg-brand-primary-900/20 text-brand-primary-600 mb-6">
          <span class="material-icons text-3xl">Gavel</span>
        </div>
        <h1 class="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Términos de Servicio</h1>
        <p class="text-sm text-gray-500 mt-2 italic">Última actualización: Abril 2026</p>
      </div>

      <div class="prose dark:prose-invert max-w-none space-y-8 text-gray-600 dark:text-gray-400 leading-relaxed">
        <section>
          <h2 class="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider">1. Aceptación del Servicio</h2>
          <p>Al utilizar Fleetly, aceptas que el sistema acceda a tu ubicación en tiempo real mientras el vehículo esté reservado. Te comprometes a usar la flota siguiendo las normas de tráfico vigentes.</p>
        </section>

        <section>
          <h2 class="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider">2. Exoneración de Responsabilidad</h2>
          <p class="font-bold text-rose-600 dark:text-rose-400">Fleetly no se hace responsable de daños, accidentes o infracciones derivadas del mal uso del vehículo, exceso de velocidad o conducción temeraria por parte del usuario.</p>
          <p>El usuario es el único responsable de cualquier sanción administrativa o daño a terceros durante el periodo de su reserva.</p>
        </section>

        <section>
          <h2 class="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider">3. Telemetría y Control Remoto</h2>
          <p>Aceptas que los administradores pueden monitorizar la velocidad, RPM y estado del motor. En casos de emergencia o uso indebido detectado por telemetría, Fleetly se reserva el derecho de detener el motor de forma remota una vez el vehículo esté inmovilizado.</p>
        </section>

        <section>
          <h2 class="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider">4. Obligaciones del Usuario</h2>
          <ul class="list-disc pl-5 space-y-2">
            <li>Mantener la seguridad de las credenciales de acceso.</li>
            <li>No permitir el uso del vehículo a terceros no registrados.</li>
            <li>Finalizar el viaje correctamente desde la App para evitar cargos adicionales.</li>
          </ul>
        </section>
      </div>

      <div class="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
        <router-link to="/login" class="text-brand-primary-600 font-black text-xs uppercase tracking-widest hover:underline">Volver al inicio</router-link>
      </div>
    </div>
  </div>
</template>
